/*
    Usage:
    <div class="thumbnail-holder">
        <span class="thumbnail-span" data-3d-url="urlIsHere">
              <- Canvas will be added here
            <img>2D Image</img>
        </span>
    </div>

    $("element").load3DThumbnail(function(canvas) {
        //complete!
    });

    The element being called must have a data-3d-url attribute
    While it's loading the OBJ & MTL files, it creates a CSS loading spinner inside the new div.
*/
$(function () {
    var imageRetryDataElement = $("#image-retry-data");
    var gaLoggingPercent = imageRetryDataElement ? imageRetryDataElement.data("ga-logging-percent") : 0;
    var GoogleAnalyticsEvents_FireEvent = (window.GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent) || function () { };
    var GoogleAnalyticsEvents_FireEventPercentage = function (data) {
        if (Math.random() <= gaLoggingPercent / 100.0) {
            GoogleAnalyticsEvents_FireEvent(data);
        }
    }
    // constants
    var minRenderDistanceDefault = 0.1;
    var maxRenderDistanceDefault = 1000;
    var loadingWaitBeforeShowingSpinner = 500; // milliseconds - for UX, don't show the spinner immediately
    var maximumPollsToGet3DThumbnailJson = 10;
    var retryInterval = 1500;
    // WebGLRenderer can be reused by multiple scenes, but returns it's own canvas. Each container needs it's own renderer
    var renderers = [];

    function getRenderer(container) {
        // There's no convenient unique key to be used to index the renderers
        for (var n in renderers) {
            if (renderers[n].container == container) {
                return renderers[n].renderer;
            }
        }
        var renderObject = {
            container: container,
            renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true })
        };
        renderers.push(renderObject);
        return renderObject.renderer;
    }

    function addLightsToScene(scene, camera) {
        Roblox.ThumbnailUtils.addLightsToScene(scene, camera);
    }

    function clearContainer(container) {
        container.find("canvas").remove();
    }

    function isModerationMode(container) {
        return container.parent() ? typeof container.parent().data("moderation-mode") === "string" : false;
    }

    function loadObjAndMtl3D(modelHash, mtlHash, container, json, callBack, onError) {
        var renderer = getRenderer(container);
        var moderationMode = isModerationMode(container);
        var calculatedMaxRenderDistance = (new THREE.Vector3(json.aabb.max.x, json.aabb.max.y, json.aabb.max.z)).length() * 4;
        var maxRenderDistance = Math.max(calculatedMaxRenderDistance, maxRenderDistanceDefault);

        function containerWidth() { return container.parent().width(); }
        function containerHeight() { return container.parent().height(); }

        var fieldOfView = typeof json.camera.fov !== "undefined" ? json.camera.fov : 70;
        var camera = new THREE.PerspectiveCamera(fieldOfView, containerWidth() / containerHeight(), minRenderDistanceDefault, maxRenderDistance);
        var scene = new THREE.Scene();
        var controls;

        function render() {
            renderer.render(scene, camera);
        }

        function animate() {
            if (controls.enabled) {
                controls.update();
            }

            TWEEN.update();
            render();
            requestAnimationFrame(animate);
        }

        function setRendererSize() {
            camera.aspect = containerWidth() / containerHeight();
            camera.updateProjectionMatrix();
            renderer.setSize(containerWidth(), containerHeight());
        }

        function createCanvas() {
            renderer.setSize(containerWidth(), containerHeight());
            var canvas = renderer.domElement;
            var resizeTimer;

            $(window).resize(function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(setRendererSize, 100);
            }).on("beforeunload", function () {
                // canvas goes black when navigating to another page
                $(canvas).hide();
                });

            return canvas;
        }

        function initializeControls() {
            // The controller that lets us spin the camera around an object   
            var orbitControls = new THREE.OrbitControls(camera, container.get(0), json, 'static');
            if (moderationMode) {
                orbitControls.autoRotate = false;
                orbitControls.minDistance = 0.1;
                orbitControls.noPan = false;
                orbitControls.noKeys = false;
                orbitControls.noResetToInitialCameraPosition = true;
            } else {
                orbitControls.rotateSpeed = 1.5;
                orbitControls.zoomSpeed = 1.5;
                orbitControls.dynamicDampingFactor = 0.3;
            }
            orbitControls.addEventListener("change", render);
            return orbitControls;
        }

        function objAndMtlLoaded(modelObject) {
            addLightsToScene(scene, camera);
            scene.add(camera);
            scene.add(modelObject);
            var canvas = createCanvas();
            controls = initializeControls();
            render();
            animate();
            callBack(canvas);
        };

        var objMtlLoader = new THREE.OBJMTLLoader();
        objMtlLoader.load(modelHash, mtlHash, objAndMtlLoaded, undefined, onError);
    }

    $.fn.load3DThumbnail = function (callBack, onError) {
        var cancelled = false;
        function cancelLoading() {
            cancelled = true;
        }

        function getThumbnailJson(url, callBack, retries, options) {
            function retry(options) {
                options.realRegeneration = true; //not strictly true; super fast thumbnail returns will not be logged, but are rare/nonexistent.
                if (retries-- > 0) {
                    options.retriesDone++;
                    setTimeout(function () {
                        getThumbnailJson(url, callBack, retries, options);
                    }, retryInterval);
                } else {
                    var gap = new Date().getTime() - options.start;
                    GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenTime", "3D", "Gave Up", gap]);
                    GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenRetries", "3D", "Gave Up", options.retriesDone]);
                }
            }

            function success(data, options) {
                var gap = new Date().getTime() - options.start;
                if (data.Final) {
                    $.getJSON(data.Url, function (json) {
                        if (options.realRegeneration) {
                            GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenTime", "3D", "Success", gap]);
                            GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenRetries", "3D", "Success", options.retriesDone]);
                        }
                        callBack(json, options);
                    }).fail(function () {
                        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenErrors", "3D", "Failure", data.Url]);
                        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenTime", "3D", "Failure", gap]);
                        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenRetries", "3D", "Failure", options.retriesDone]);
                        onError("3D Thumbnail failed to load");
                    });
                } else {
                    retry(options);
                }
            }

            $.ajax({
                url: url + "&_=" + $.now(), // bust IE caching, not sure why cache: false does not fix this
                method: "GET",
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                    cache: false
                })
                .success(function (data) { success(data, options); })

                .fail(function () {
                    retry(options);
                });
        }

        this.each(function () {
            var container = $(this);
            try {
                var loadThreeDee = function () {
                    var options = {
                        start: new Date().getTime(), realRegeneration: false, retriesDone: 0
                    };
                    var jsonUrl = Roblox.Endpoints.generateAbsoluteUrl(container.data("3d-url"), null, true);
                    if (!jsonUrl) {
                        return;
                    }
                    clearContainer(container);

                    var loaderTimeout;

                    function cancelLoaderUI() {
                        if (loaderTimeout) {
                            clearTimeout(loaderTimeout);
                            loaderTimeout = undefined;
                        }
                    }

                    function startLoaderUI() {
                        loaderTimeout = setTimeout(function () {
                            if (!cancelled) {
                                Roblox.ThumbnailSpinner.show(container);
                            }
                        }, loadingWaitBeforeShowingSpinner);
                    }

                    function endLoaderUI() {
                        cancelLoaderUI();
                        Roblox.ThumbnailSpinner.hide(container);
                    }

                    function disposeRendererWhenCanvasRemoved(canvas) {
                        var observer = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                var removedNodes = mutation.removedNodes;
                                if (mutation.type === 'childList') {
                                    for (var i = 0; i < removedNodes.length; ++i) {
                                        if (removedNodes[i] === canvas) {
                                            var renderer = getRenderer(container);
                                            renderer.forceContextLoss();
                                            observer.disconnect();
                                            return;
                                        }
                                    }
                                }
                            });
                        });
                        observer.observe(canvas.parentNode, { childList: true });
                    }

                    function updateContainer(json, options) {
                        var start = new Date().getTime();
                        loadObjAndMtl3D(json.obj, json.mtl, container, json, function (canvas) {
                            clearContainer(container);
                            if (!cancelled) {
                                endLoaderUI();
                                container.append(canvas);
                                disposeRendererWhenCanvasRemoved(canvas);
                                var gap = new Date().getTime() - start;
                                if (options.realRegeneration) {
                                    GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailInBrowserRenderTime", "3D", "Success", gap]);
                                }
                                callBack(canvas);
                            }
                        }, onError);
                    }

                    startLoaderUI();
                    getThumbnailJson(jsonUrl, updateContainer, maximumPollsToGet3DThumbnailJson, options);
                };

                loadThreeDee();
            } catch (e) {
                onError(e);
            }
        });

        return {
            cancel: cancelLoading
        };
    };
});
