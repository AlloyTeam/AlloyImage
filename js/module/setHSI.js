/*
 * @author: Bin Wang
 * @description: 调整RGB 饱和和度  
 *
 * */
;(function(Ps){

    window[Ps].module("setHSI",function(P){

        var M = {
            process: function(imgData,arg){//调节亮度对比度
                arg[0] = arg[0] / 180 * Math.PI;
                arg[1] = arg[1] / 100 || 0;
                arg[2] = arg[2] / 100 * 255 || 0;

                P.lib.dorsyMath.applyInHSI(imgData,function(i){

                    i.H += arg[0];
                    i.S += arg[1];
                    i.I += arg[2];

                });

                return imgData;
            }
        };

        return M;

    });

})("psLib");
