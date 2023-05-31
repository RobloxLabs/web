var RobloxThumbs = function() {
    
    /** Private **/
   function _GenerateAvatarThumbHelper(imgTagId, userId, thumbnailFormatId) {
        $.get("/thumbs/rawavatar.ashx",
        {
            UserID: userId,
            ThumbnailFormatID: thumbnailFormatId
        },
        function(data) 
        {
            if (data == "PENDING") 
            {
                window.setTimeout(function() 
                {
                    _GenerateAvatarThumbHelper(imgTagId, userId, thumbnailFormatId);
                }, 3000);
            }
            else if (data.substring(5, 0) == "ERROR") // Should be using JSON...
            {
                // DO something if an error occurs ?
            }
            else // Success
            {
                $('#' + imgTagId).attr('src', data);
            }
        });
    }

    /** Public **/
    return {
        GenerateAvatarThumb: function(imgTagId, userId, thumbnailFormatId) {

            $('#' + imgTagId).attr('src', '/images/spinners/waiting.gif');

            _GenerateAvatarThumbHelper(imgTagId, userId, thumbnailFormatId);
        }
    };
} ();
