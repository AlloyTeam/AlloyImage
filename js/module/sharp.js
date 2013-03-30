/**
 * @author: Bin Wang
 * @description:锐化 
 *
 */
;(function(Ps){

    window[Ps].module("sharp",function(P){

        var M = {
            process: function(imgData,arg){
                var lamta = arg[0] || 0.6;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;

                for(var i = 0,n = data.length;i < n;i += 4){
                    var ii = i / 4;
                    var row = parseInt(ii / width);
                    var col = ii % width;
                    if(row == 0 || col == 0) continue;

                    var A = ((row - 1) *  width + (col - 1)) * 4;
                    var B = ((row - 1) * width + col) * 4;
                    var E = (ii - 1) * 4;

                    for(var j = 0;j < 3;j ++){
                        var delta = data[i + j] - (data[B + j] + data[E + j] + data[A + j]) / 3;
                        data[i + j] += delta * lamta;
                    }
                }

                return imgData;
            }
        };

        return M;

    });

})("psLib");
