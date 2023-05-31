/*
    Major modifications made to OrbitControls by NDean
*/

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
// supported.
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe
//
// This is a drop-in replacement for (most) TrackballControls used in examples.
// That is, include this js file and wherever you see:
//    	controls = new THREE.TrackballControls( camera );
//      controls.target.z = 150;
// Simple substitute "OrbitControls" and the control should work as-is.

THREE.OrbitControls = function (object, domElement, thumbnailJson) {

    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement : document;

    // API

    this.autoRotate = true;
    this.fullRotation = true;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the control orbits around
    // and where it pans with respect to.
    var aabbMax = thumbnailJson.aabb.max;
    aabbMax = new THREE.Vector3(aabbMax.x, aabbMax.y, aabbMax.z);

    var aabbMin = thumbnailJson.aabb.min;
    aabbMin = new THREE.Vector3(aabbMin.x, aabbMin.y, aabbMin.z);

    var midPoint = new THREE.Vector3();
    midPoint.copy(aabbMax).add(aabbMin).multiplyScalar(0.5);

    this.target = midPoint;

    // center is old, deprecated; use "target" instead
    this.center = this.target;

    // This option actually enables dollying in and out; left as "zoom" for
    // backwards compatibility
    this.noZoom = false;
    this.zoomSpeed = 1.0;

    // Limits to how far you can dolly in and out
    this.minDistance = 1;
    this.maxDistance = Infinity;

    // Set to true to disable this control
    this.noRotate = false;
    this.rotateSpeed = 1.0;

    // Set to true to disable this control
    this.noPan = true;
    this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

    //hack by NDean: prevent gimbal lock by adding slight value to mins/maxes
    var offsetFromAxis = Math.PI / 180;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0 + offsetFromAxis; // radians
    this.maxPolarAngle = Math.PI - offsetFromAxis; // radians

    // Set to true to disable use of the keys
    this.noKeys = true;

    // The four arrow keys
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    ////////////
    // internals
    
    //keep track of last user interaction so we can tween back to default camera position when user is idle
    var idleTime = 0.75 * 1000;
    var lastActionTime;
    function actionBegun() { lastActionTime = undefined; }
    function actionEnded() { lastActionTime = $.now(); }

    var thumbnailCameraPosition = thumbnailJson.camera.position;
    thumbnailCameraPosition = new THREE.Vector3(thumbnailCameraPosition.x, thumbnailCameraPosition.y, thumbnailCameraPosition.z);

    var thumbnailCameraDirection = thumbnailJson.camera.direction;
    thumbnailCameraDirection = new THREE.Vector3(thumbnailCameraDirection.x, thumbnailCameraDirection.y, thumbnailCameraDirection.z);

    var cameraHeight = thumbnailCameraPosition.y;
    var cameraVerticalAngle = 22.5 * (Math.PI / 180);

    var zDiff = thumbnailCameraPosition.z - this.target.z;
    var xDiff = thumbnailCameraPosition.x - this.target.x
    var cameraAngle = Math.atan2( xDiff, zDiff); //horizontal angle

    var cameraDistance = thumbnailCameraPosition.distanceTo(this.target);

    //initial state
    //if (this.autoRotate !== true) {
        var position = new THREE.Vector3(
			thumbnailCameraPosition.x,//this.target.x + cameraDistance * Math.sin(cameraAngle),
			thumbnailCameraPosition.y,//cameraHeight,
			thumbnailCameraPosition.z//this.target.z + cameraDistance * Math.cos(cameraAngle)
		);
        var pointToLookat = new THREE.Vector3();
        pointToLookat.copy(thumbnailCameraPosition);
        pointToLookat.sub(thumbnailCameraDirection);

        this.object.position = position;
        this.object.lookAt(pointToLookat); //this.target
    //}

    //for idle rotation or back-and-forth animation
    var defaultAngle = cameraAngle;
    var maxAngle = Math.PI / 6;
    var currentAngle = 0;
    var angleIteration = 0;
    var rotationDelta = -0.01;

    function resetRotation() {
        currentAngle = defaultAngle;
        angleIteration = 0;
    }

    var tweenDuration = 1500; //milliseconds
    var isTweening = false;

    var scope = this;

    var EPS = 0.000001;

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();
    var panOffset = new THREE.Vector3();

    var offset = new THREE.Vector3();

    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    var phiDelta = 0;
    var thetaDelta = 0;
    var scale = 1;
    var pan = new THREE.Vector3();

    var lastPosition = new THREE.Vector3();

    // ignore scale
    var pos = new THREE.Vector3(
        this.target.x + cameraDistance * Math.sin(cameraAngle),
        this.target.y + cameraDistance * Math.sin(cameraVerticalAngle),
        this.target.z + cameraDistance * Math.cos(cameraAngle)
    );

    this.lastPosition = pos; //{ x: this.object.x, y: this.object.y, z: this.object.z };

    var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5, IDLE: 6 };

    var state = this.autoRotate ? STATE.IDLE : STATE.NONE;

    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();

    var quat = new THREE.Quaternion();
    var quatInverse = quat.clone().inverse();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };

    this.cancelAllTweens = function () {
        TWEEN.removeAll();
    };

    this.tweenToLastPosition = function () {
        this.tweenCamera(this.lastPosition, tweenDuration, function () {
            state = STATE.IDLE;
        });
        resetRotation();
    };

    this.tweenCamera = function (targetPosition, duration, callback) {
        isTweening = true;

        var rotationTween;

        function onUpdate() {
            if (isTweening === false) {
                rotationTween.stop();
            }
            scope.object.position.x = this.x;
            scope.object.position.y = this.y;
            scope.object.position.z = this.z;
            scope.object.lookAt(scope.target);
        }

        rotationTween = new TWEEN.Tween(scope.object.position)
            .to(targetPosition, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(onUpdate)
			.onComplete(function () {
			    isTweening = false;
			    callback();
			})
			.start();
    }

    this.rotateLeft = function (angle) {

        if (angle === undefined) {

            angle = getAutoRotationAngle();

        }

        thetaDelta -= angle;

    };

    this.rotateUp = function (angle) {

        if (angle === undefined) {

            angle = getAutoRotationAngle();

        }

        phiDelta -= angle;

    };

    // pass in distance in world space to move left
    this.panLeft = function (distance) {

        var te = this.object.matrix.elements;

        // get X column of matrix
        panOffset.set(te[0], te[1], te[2]);
        panOffset.multiplyScalar(-distance);

        pan.add(panOffset);

    };

    // pass in distance in world space to move up
    this.panUp = function (distance) {

        var te = this.object.matrix.elements;

        // get Y column of matrix
        panOffset.set(te[4], te[5], te[6]);
        panOffset.multiplyScalar(distance);

        pan.add(panOffset);

    };

    // pass in x,y of change desired in pixel space,
    // right and down are positive
    this.pan = function (deltaX, deltaY) {

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        if (scope.object.fov !== undefined) {

            // perspective
            var position = scope.object.position;
            var offset = position.clone().sub(scope.target);
            var targetDistance = offset.length();

            // half of the fov is center to top of screen
            targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);

            // we actually don't use screenWidth, since perspective camera is fixed to screen height
            scope.panLeft(2 * deltaX * targetDistance / element.clientHeight);
            scope.panUp(2 * deltaY * targetDistance / element.clientHeight);

        } else if (scope.object.top !== undefined) {

            // orthographic
            scope.panLeft(deltaX * (scope.object.right - scope.object.left) / element.clientWidth);
            scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / element.clientHeight);

        } else {

            // camera neither orthographic or perspective
            // WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.

        }
    };

    this.dollyIn = function (dollyScale) {

        if (dollyScale === undefined) {

            dollyScale = getZoomScale();

        }

        scale /= dollyScale;

    };

    this.dollyOut = function (dollyScale) {

        if (dollyScale === undefined) {

            dollyScale = getZoomScale();

        }

        scale *= dollyScale;

    };

    this.update = function () {
        if (this.autoRotate === true) {
            if (state === STATE.IDLE) {
                var distance = cameraDistance * scale;
                var position = new THREE.Vector3(
                    this.target.x + distance * Math.sin(currentAngle),
                    this.target.y + distance * Math.sin(cameraVerticalAngle),
                    this.target.z + distance * Math.cos(currentAngle)
                );
                this.object.position = position;
                this.object.lookAt(this.target);

                // had issue with using reference value to camera.position
                if (scope.fullRotation === true) {
                    currentAngle = defaultAngle + angleIteration;
                } else {
                    currentAngle = defaultAngle + maxAngle * Math.sin(angleIteration);
                }
                angleIteration += rotationDelta;

                return;
            }
        }

        if ((lastActionTime !== undefined) && ($.now() >= (lastActionTime + idleTime))) {
            lastActionTime = undefined;
            scope.tweenToLastPosition();
        }

        var position = this.object.position;

        offset.copy(position).sub(this.target);

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis

        var theta = Math.atan2(offset.x, offset.z);

        // angle from y-axis

        var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

        /*if (this.autoRotate) {

            this.rotateLeft(getAutoRotationAngle());

        }*/

        theta += thetaDelta;
        phi += phiDelta;

        // restrict phi to be between desired limits
        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

        // restrict phi to be betwee EPS and PI-EPS
        phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

        var radius = offset.length() * scale;

        // restrict radius to be between desired limits
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

        // move target to panned location
        this.target.add(pan);

        offset.x = radius * Math.sin(phi) * Math.sin(theta);
        offset.y = radius * Math.cos(phi);
        offset.z = radius * Math.sin(phi) * Math.cos(theta);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(this.target).add(offset);

        this.object.lookAt(this.target);

        thetaDelta = 0;
        phiDelta = 0;
        scale = 1;
        pan.set(0, 0, 0);

        if (lastPosition.distanceToSquared(this.object.position) > EPS) {

            this.dispatchEvent(changeEvent);

            lastPosition.copy(this.object.position);

        }

    };


    this.reset = function () {

        state = STATE.NONE;

        this.target.copy(this.target0);
        this.object.position.copy(this.position0);

        this.update();

    };

    function getZoomScale() {

        return Math.pow(0.95, scope.zoomSpeed);

    }

    function onMouseDown(event) {

        event.preventDefault();

        if (event.button === 0) {
            if (scope.noRotate === true) return;

            actionBegun();
            scale = 1;
            scope.cancelAllTweens();

            state = STATE.ROTATE;

            rotateStart.set(event.clientX, event.clientY);

        } else if (event.button === 1) {
            if (scope.noZoom === true) return;

            state = STATE.DOLLY;

            dollyStart.set(event.clientX, event.clientY);

        } else if (event.button === 2) {
            if (scope.noPan === true) return;

            state = STATE.PAN;

            panStart.set(event.clientX, event.clientY);

        }

        scope.domElement.addEventListener('mousemove', onMouseMove, false);
        scope.domElement.addEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(startEvent);

    }

    function onMouseMove(event) {

        if (scope.enabled === false) return;

        if (this.autoRotate === true && isTweening === true) {
            isTweening = false;
        }

        event.preventDefault();

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        if (state === STATE.ROTATE) {

            if (scope.noRotate === true) return;

            rotateEnd.set(event.clientX, event.clientY);
            rotateDelta.subVectors(rotateEnd, rotateStart);

            // rotating across whole screen goes 360 degrees around
            scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

            // rotating up and down along whole screen attempts to go 360, but limited to 180
            //comment out this line to only allow horizontal rotation
            scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

            rotateStart.copy(rotateEnd);

        } else if (state === STATE.DOLLY) {

            if (scope.noZoom === true) return;

            dollyEnd.set(event.clientX, event.clientY);
            dollyDelta.subVectors(dollyEnd, dollyStart);

            if (dollyDelta.y > 0) {

                scope.dollyIn();

            } else {

                scope.dollyOut();

            }

            dollyStart.copy(dollyEnd);

        } else if (state === STATE.PAN) {

            if (scope.noPan === true) return;

            panEnd.set(event.clientX, event.clientY);
            panDelta.subVectors(panEnd, panStart);

            scope.pan(panDelta.x, panDelta.y);

            panStart.copy(panEnd);

        }

        scope.update();

    }

    function onMouseLeave(event) {
        //if the user drags out of the window we want to let go if they're holding down the mouse
        if (state == STATE.ROTATE) {
            //we need to cancel rotate
            onMouseUp();
            lastActionTime = undefined;
            scope.tweenToLastPosition();
        }

        event.preventDefault();
        event.stopPropagation();
    }

    function onMouseUp( /* event */) {

        if (scope.enabled === false) return;

        actionEnded();

        scope.domElement.removeEventListener('mousemove', onMouseMove, false);
        scope.domElement.removeEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(endEvent);
        state = STATE.NONE;

    }

    function onMouseWheel(event) {

        if (scope.enabled === false || scope.noZoom === true) return;

        if (state != STATE.ROTATE) {
            actionEnded();
            scope.cancelAllTweens();
        }

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if (event.detail !== undefined) { // Firefox

            delta = - event.detail;

        }

        if (delta > 0) {

            scope.dollyOut();

        } else {

            scope.dollyIn();

        }

        scope.update();
        scope.dispatchEvent(startEvent);
        scope.dispatchEvent(endEvent);

    }

    function onKeyDown(event) {

        if (scope.enabled === false || scope.noKeys === true || scope.noPan === true) return;

        switch (event.keyCode) {

            case scope.keys.UP:
                scope.pan(0, scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.BOTTOM:
                scope.pan(0, -scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.LEFT:
                scope.pan(scope.keyPanSpeed, 0);
                scope.update();
                break;

            case scope.keys.RIGHT:
                scope.pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;

        }

    }

    function touchstart(event) {

        if (scope.enabled === false) return;

        switch (event.touches.length) {

            case 1:	// one-fingered touch: rotate

                if (scope.noRotate === true) return;

                state = STATE.TOUCH_ROTATE;

                rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                break;

            case 2:	// two-fingered touch: dolly

                if (scope.noZoom === true) return;

                state = STATE.TOUCH_DOLLY;

                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                dollyStart.set(0, distance);
                break;

            case 3: // three-fingered touch: pan

                if (scope.noPan === true) return;

                state = STATE.TOUCH_PAN;

                panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                break;

            default:

                state = STATE.NONE;

        }

        scope.dispatchEvent(startEvent);

    }

    function touchmove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                if (scope.noRotate === true) return;
                if (state !== STATE.TOUCH_ROTATE) return;

                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                rotateDelta.subVectors(rotateEnd, rotateStart);

                // rotating across whole screen goes 360 degrees around
                scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
                // rotating up and down along whole screen attempts to go 360, but limited to 180
                scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

                rotateStart.copy(rotateEnd);

                scope.update();
                break;

            case 2: // two-fingered touch: dolly

                if (scope.noZoom === true) return;
                if (state !== STATE.TOUCH_DOLLY) return;

                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);

                dollyEnd.set(0, distance);
                dollyDelta.subVectors(dollyEnd, dollyStart);

                if (dollyDelta.y > 0) {

                    scope.dollyOut();

                } else {

                    scope.dollyIn();

                }

                dollyStart.copy(dollyEnd);

                scope.update();
                break;

            case 3: // three-fingered touch: pan

                if (scope.noPan === true) return;
                if (state !== STATE.TOUCH_PAN) return;

                panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                panDelta.subVectors(panEnd, panStart);

                scope.pan(panDelta.x, panDelta.y);

                panStart.copy(panEnd);

                scope.update();
                break;

            default:

                state = STATE.NONE;

        }

    }

    function touchend( /* event */) {

        if (scope.enabled === false) return;

        scope.dispatchEvent(endEvent);
        state = STATE.NONE;

    }

    this.domElement.addEventListener('mouseleave', onMouseLeave, false);
    this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
    this.domElement.addEventListener('mousedown', onMouseDown, false);
    this.domElement.addEventListener('mousewheel', onMouseWheel, false);
    this.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

    this.domElement.addEventListener('touchstart', touchstart, false);
    this.domElement.addEventListener('touchend', touchend, false);
    this.domElement.addEventListener('touchmove', touchmove, false);

    window.addEventListener('keydown', onKeyDown, false);

    // force an update at start
    this.update();

};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);