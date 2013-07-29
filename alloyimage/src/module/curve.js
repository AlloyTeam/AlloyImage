/**
 * @author: Bin Wang
 * @description:    曲线 
 *
 */
;(function(Ps){

    window[Ps].module("curve", function(P){

        var M = {
            process: function(imgData, arg){
                /*
                 * arg   arg[0] = [3,3] ,arg[1]  = [2,2]
                 * */

                //获得插值函数
                var f = P.lib.dorsyMath.lagrange(arg[0], arg[1]);
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;

                //区块
                for(var x = 0; x < width; x ++){

                    for(var y = 0; y < height; y ++){
                        
                        var realI = y * width + x;

                        for(var j = 0; j < 3; j ++){
                            data[realI * 4 + j] = f(data[realI * 4 + j]);
                        }

                    }

                }

                return imgData;
            }
        };

        return M;

    });

})("psLib");
