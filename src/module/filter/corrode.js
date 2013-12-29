/**
 * @author: Bin Wang
 * @description:    腐蚀 
 *
 */
;(function(Ps){

    window[Ps].module("Filter.corrode", function(P){

        var M = {
            process: function(imgData, arg){
                var R = parseInt(arg[0]) || 3;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var xLength = R * 2 + 1;

                //区块
                for(var x = 0; x < width; x ++){

                    for(var y = 0; y < height; y ++){
                        
                        var randomI = parseInt(Math.random() * R * 2) - R ;//区块随机代表
                        var randomJ = parseInt(Math.random() * R * 2) - R;//区块随机代表
                        var realI = y * width + x;
                        var realJ = (y + randomI) * width + x + randomJ;

                        for(var j = 0; j < 3; j ++){
                            data[realI * 4 + j] = data[realJ * 4 + j];
                        }

                    }

                }

                return imgData;
            }
        };

        return M;

    });

})("psLib");
