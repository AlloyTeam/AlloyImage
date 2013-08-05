/**
 * @author: Bin Wang
 * @description: 反色
 *
 */
;(function(Ps){

    window[Ps].module("Filter.toReverse",function(P){

        var M = {
            process: function(imgData){
                var data = imgData.data;

                for(var i = 0,n = data.length;i < n;i += 4){
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }

                imgData.data = data;

                return imgData;
            }
        };

        return M;

    });

})("psLib");
