/**
 * @author: Bin Wang
 * @description:  马赛克 
 *
 */
;(function(Ps){

    window[Ps].module("Filter.dotted",function(P){

        var M = {
            process: function(imgData,arg){//调节亮度对比度
                //矩形半径
                var R = parseInt(arg[0]) || 1;

                //内小圆半径
                var r = parseInt(arg[1]) || 1;

                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var xLength = R * 2 + 1;

                //构造距离模板
                var disTmlMatrix = [
                ];

                var r2 = r * r;
                for(var x = -R; x < R; x ++){

                    for(var y = -R; y < R; y ++){
                        if((x * x + y * y) > r2){
                            disTmlMatrix.push([x, y]);
                        }
                    }

                }

                var xyToIFun = P.lib.dorsyMath.xyToIFun(width);

                //将大于距离外面的透明度置为0
                for(var x = 0, n = parseInt(width / xLength); x < n; x ++){

                    for(var y = 0, m = parseInt(height / xLength); y < m;y ++){
                        var middleX = parseInt((x + 0.5) * xLength);
                        var middleY = parseInt((y + 0.5) * xLength);

                        for(var i = 0; i < disTmlMatrix.length; i ++){
                            var dotX = middleX + disTmlMatrix[i][0];
                            var dotY = middleY + disTmlMatrix[i][1];

                            //data[(dotY * width + dotX) * 4 + 3] = 0;
                            data[xyToIFun(dotX, dotY, 3)] = 225;
                            data[xyToIFun(dotX, dotY, 2)] = 225;
                            data[xyToIFun(dotX, dotY, 0)] = 225;
                            data[xyToIFun(dotX, dotY, 1)] = 225;
                        }
                    }

                }

                /*
                for(var x = 0; x < width; x ++){
                    for(var y = 0; y < height; y ++){
                        data[(y * width + x) * 4 + 3] = 0;
                    }
                }
                */


                return imgData;
            }
        };

        return M;

    });

})("psLib");
