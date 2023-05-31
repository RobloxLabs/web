/*
    Responsible for showing/hiding loading spinners on thumbnails
*/
Roblox = Roblox || {};
Roblox.ThumbnailUtils = (function () {

    var spinnerHtml = '<div class="thumbnail-loader"><span class="spinner spinner-default"></span></div>';
    var selector = ".thumbnail-loader";

    return {
        addLightsToScene: function (scene, camera) {
            var useDynamicLighting = false;
            var dynamicLightingFlag = $("#use-dynamic-thumbnail-lighting");
            if (dynamicLightingFlag !== null && dynamicLightingFlag.length > 0) {
                useDynamicLighting = dynamicLightingFlag.data("use-dynamic-thumbnail-lighting") === "True";
            }

            if (useDynamicLighting) {
                var ambient = new THREE.AmbientLight(0x444444);
                camera.add(ambient);

                var keylight = new THREE.DirectionalLight(0xd4d4d4);
                keylight.target = camera;
                keylight.position.set(-7.5, .5, -6.0).normalize();
                camera.add(keylight);

                var fillLight = new THREE.DirectionalLight(0xacacac);
                fillLight.target = camera;
                fillLight.position.set(20.0, 4.0, -0).normalize();
                camera.add(fillLight);

                var rimLight = new THREE.DirectionalLight(0xacacac);
                rimLight.target = camera;
                rimLight.position.set(0, 1, 1).normalize();
                camera.add(rimLight);
            } else {
                var ambient = new THREE.AmbientLight(0x878780);
                scene.add(ambient);

                var sunLight = new THREE.DirectionalLight(0xACACAC);
                sunLight.position.set(-0.671597898, 0.671597898, 0.312909544).normalize();
                scene.add(sunLight);

                var backLight = new THREE.DirectionalLight(0x444444);
                var backLightPos = new THREE.Vector3().copy(sunLight.position).negate().normalize(); //inverse of sun direction
                backLight.position.set(backLightPos);
                scene.add(backLight);
            }

            return {
                scene: scene,
                camera: camera,
            }
        }
    };

})();