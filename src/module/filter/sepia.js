/**
 * @author: Bin Wang
 * @description: 棕褐色
 *
 */
;(function(Ps){

    window[Ps].module("Filter.sepia",function(P){

        var M = {
            process: function(imgData){
                var dM = P.lib.dorsyMath;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                
                for(var x = 0; x < width; x ++){
                    for(var y = 0; y < height; y ++){
                        dM.xyCal(imgData, x, y, function(r, g, b){
                            return [
                                r * 0.393 + g * 0.769 + b * 0.189,
                                r * 0.349 + g * 0.686 + b * 0.168,
                                r * 0.272 + g * 0.534 + b * 0.131
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
