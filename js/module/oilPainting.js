/*
 * @author: Bin Wang
 * @description: 油画 
 *
 * */
;(function(Ps){

    window[Ps].module("oilPainting",function(P){

        var M = {
            process: function(imgData,arg){
                var R = parseInt(arg[0]) || 128;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var xLength = R * 2 + 1;

                //区块
                for(var x = 0;x < width;x ++){

                    for(var y = 0;y < height;y ++){
                        
                        var realI = y * width + x;
                        for(var j = 0;j < 3;j ++){
                            data[realI * 4 + j] = parseInt(data[realI * 4 + j] / R) * R;
                        }
                    }

                }


                return imgData;
            }
        };

        return M;

    });

})("psLib");
