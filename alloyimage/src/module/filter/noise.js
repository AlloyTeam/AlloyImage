/**
 * @author: Bin Wang
 * @description:   添加杂色 
 *
 */
;(function(Ps){

    window[Ps].module("Filter.noise",function(P){

        var M = {
            process: function(imgData,arg){
                var R = parseInt(arg[0]) || 100;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var xLength = R * 2 + 1;

                //区块
                for(var x = 0;x < width;x ++){

                    for(var y = 0;y < height;y ++){
                        
                        var realI = y * width + x;
                        for(var j = 0;j < 3;j ++){
                            var rand = parseInt(Math.random() * R * 2) - R;
                            data[realI * 4 + j] += rand;
                        }

                    }

                }


                return imgData;
            }
        };

        return M;

    });

})("psLib");
