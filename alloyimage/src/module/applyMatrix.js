/**
 * @author: Bin Wang
 * @description: 查找边缘
 *
 */
;(function(Ps){

    window[Ps].module("applyMatrix",function(P){

        var M = {
            process: function(imgData, arg){
                var lamta = arg || 0.6;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var template = new P.lib.dorsyMath.Matrix([
                        -2,-4,-4,-4,-2,
                        -4,0,8,0,-4,
                        -4,8,24,8,-4,
                        -4,0,8,0,-4,
                        -2,-4,-4,-4,-2
                    ],25,1);                    
                var tempData = [];

                for(var i = 0, n = data.length; i < n; i += 4){
                    var ii = i / 4;
                    var row = parseInt(ii / width);
                    var col = ii % width;
                    if(row == 0 || col == 0) continue;

                    var pixelArr = [[],[],[]];

                    for(var k = -2; k < 3; k ++){
                        var currRow = row + k;

                        for(var kk = -2; kk < 3; kk ++){

                            var currCol = col + kk;
                            var currI = (currRow * width + currCol) * 4;

                            for(var j = 0; j < 3; j ++){
                                var tempI = currI + j; 
                                pixelArr[j].push(data[tempI]);
                            }

                        }

                    }

                    var pixelMatrix = new P.lib.dorsyMath.Matrix(pixelArr, 3, matrixSize);
                    var resultMatrix = pixelMatrix.mutiply(template);

                    for(var j = 0; j < 3; j ++){
                       tempData[i + j] = resultMatrix.data[j]; 
                    }

                    tempData[i + 4] = data[i + 4];
                }

                for(var i = 0, n = data.length; i < n; i ++){
                    data[i] = tempData[i] || data[i];
                }

                return imgData;
            }
        };

        return M;

    });

})("psLib");
