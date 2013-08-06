/**
 * @author: Bin Wang
 * @description: 色调分离
 *
 */
;(function(Ps){

    window[Ps].module("Filter.posterize",function(P){

        var M = {
            process: function(imgData, args){
                var dM = P.lib.dorsyMath;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;

                //灰度阶数
                //由原来的255阶映射为现在的阶数
                var step = args[0] || 20;

                step = step < 1 ? 1 : (step > 255 ? 255 : step);
                var level = Math.floor(255 / step);
                
                for(var x = 0; x < width; x ++){
                    for(var y = 0; y < height; y ++){
                        dM.xyCal(imgData, x, y, function(r, g, b){
                            return [
                                Math.floor(r / level) * level,
                                Math.floor(g / level) * level,
                                Math.floor(b / level) * level
                            ];
                        });
                    }
                }
                return imgData;
            }
        };

        return M;

    });

})("psLib");
