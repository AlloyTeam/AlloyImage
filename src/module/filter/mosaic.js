/**
 * @author: Bin Wang
 * @description:  马赛克 
 *
 */
;(function(Ps){

    window[Ps].module("Filter.mosaic",function(P){

        var M = {
            process: function(imgData,arg){//调节亮度对比度
                var R = parseInt(arg[0]) || 3;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var xLength = R * 2 + 1;

                for(var x = 0,n = parseInt(width / xLength);x < n;x ++){

                    for(var y = 0,m = parseInt(height / xLength);y < m;y ++){

                        var average = [],sum = [0,0,0];
                        for(var i = 0;i < xLength;i ++){

                            for(var j = 0;j < xLength;j ++){
                                var realI = (y * xLength + i) * width + x * xLength + j;
                                sum[0] += data[realI * 4];
                                sum[1] += data[realI * 4 + 1];
                                sum[2] += data[realI * 4 + 2];
                            }
                        }
                        average[0] = sum[0] / (xLength * xLength);
                        average[1] = sum[1] / (xLength * xLength);
                        average[2] = sum[2] / (xLength * xLength);

                        for(var i = 0;i < xLength;i ++){

                            for(var j = 0;j < xLength;j ++){
                                var realI = (y * xLength + i) * width + x * xLength + j;
                                data[realI * 4] = average[0];
                                data[realI * 4 + 1] = average[1];
                                data[realI * 4 + 2] = average[2];

                            }
                        }

                    }

                }


                return imgData;
            }
        };

        return M;

    });

})("psLib");
