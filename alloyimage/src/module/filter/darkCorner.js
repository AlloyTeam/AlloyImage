/**
 * @author: Bin Wang
 * @description:     暗角
 *
 */
;(function(Ps){

    window[Ps].module("Filter.darkCorner", function(P){

        var M = {
            process: function(imgData,arg){
                //暗角级别 分1-10级吧
                var R = parseInt(arg[0]) || 3;

                //暗角的形状
                var type = arg[2] || "round";

                //暗角最终的级别 0 - 255
                var lastLevel = arg[1] || 30;

                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var xLength = R * 2 + 1;

                //计算中心点
                var middleX = width * 2 / 3;
                var middleY = height * 1/ 2;
                
                //计算距中心点最长距离
                var maxDistance = P.lib.dorsyMath.distance([middleX ,middleY]);
                //开始产生暗角的距离
                var startDistance = maxDistance * (1 - R / 10);

                var f = function(x, p0, p1, p2, p3){

                 //基于三次贝塞尔曲线 
                     return p0 * Math.pow((1 - x), 3) + 3 * p1 * x * Math.pow((1 - x), 2) + 3 * p2 * x * x * (1 - x) + p3 * Math.pow(x, 3);
               }

                //计算当前点应增加的暗度
                function calDark(x, y, p){
                    //计算距中心点距离
                    var distance = P.lib.dorsyMath.distance([x, y], [middleX, middleY]);
                    var currBilv = (distance - startDistance) / (maxDistance - startDistance);
                    if(currBilv < 0) currBilv = 0;

                    //应该增加暗度
                    return  f(currBilv, 0, 0.02, 0.3, 1) * p * lastLevel / 255;
                }

                //区块
                for(var x = 0; x < width; x ++){

                    for(var y = 0; y < height; y ++){
                        
                        var realI = y * width + x;
                        for(var j = 0;j < 3;j ++){
                            var dDarkness = calDark(x, y, data[realI * 4 + j]);
                            data[realI * 4 + j] -= dDarkness;
                        }

                    }

                }


                return imgData;
            }
        };

        return M;

    });

})("psLib");
