/** 
* @description: fix bugs
*
*/
;(function(Ps){

    window[Ps].module("Fix",function(P){
        function detectVerticalSquash(img) {
            var iw = img.naturalWidth, ih = img.naturalHeight;
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, ih).data;
            // search image edge pixel position in case it is squashed vertically.
            var sy = 0;
            var ey = ih;
            var py = ih;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            var ratio = (py / ih);
            return (ratio===0)?1:ratio;
        }

        /**
        * A replacement for context.drawImage
        * (args are for source and destination).
        */
        function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
            var vertSquashRatio = detectVerticalSquash(img);
            // Works only if whole image is displayed:
            // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
            // The following works correct also when only a part of the image is displayed:
            ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, 
                sw * vertSquashRatio, sh * vertSquashRatio, 
            dx, dy, dw, dh );
        }

        function drawImageIOS(ctx, img, dw, dh){
            var sx = 0,
                sy = 0,
                sw = img.width,
                sh = img.height,
                dx = 0,
                dy = 0;
            drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh);
        }


        var M = {
            drawImageIOS: drawImageIOS,
            drawImageIOSFix: drawImageIOSFix
        };

        return M;

    });

})("psLib");

