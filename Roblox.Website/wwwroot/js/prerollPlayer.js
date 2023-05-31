import $ from 'jquery';
import VideoPreRollDFP from './videoPreRollDFP';

const PrerollPlayer = {
    waitForPreroll: params => {
        const deferred = new $.Deferred();

        const videoPreRoll = VideoPreRollDFP;
        videoPreRoll.placeId =
            typeof params.placeId !== 'undefined' ? params.placeId : 0;
        if (videoPreRoll.showVideoPreRoll) {
            const popupOptions = {
                escClose: true,
                opacity: 80,
                overlayCss: { backgroundColor: '#000' },
                zIndex: 1031 // higher than nav
            };
            popupOptions.onShow = dialog => {
                videoPreRoll.correctIEModalPosition(dialog);
                videoPreRoll.start();
                // Enable close button after ad (:15 or :30)
                $('#prerollClose').hide();
                $('#prerollClose')
                    .delay(1000 * videoPreRoll.adTime)
                    .show(300);
            };
            popupOptions.onClose = () => {
                videoPreRoll.close();
            };
            popupOptions.closeHTML =
                '<a href="#" id="prerollClose" class="ImageButton closeBtnCircle_35h ABCloseCircle VprCloseButton"></a>';

            $('#videoPrerollPanel').modal(popupOptions);

            const interval = setInterval(() => {
                if (!videoPreRoll.isPlaying()) {
                    $.modal.close();
                    clearInterval(interval);
                    if (videoPreRoll.videoCancelled) {
                        deferred.reject(params);
                    } else {
                        deferred.resolve(params);
                    }
                }
            }, 200);
        } else {
            deferred.resolve(params);
            videoPreRoll.logVideoPreRoll();
        }

        return deferred;
    }
};

export default PrerollPlayer;
