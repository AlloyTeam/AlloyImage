/**
 * @author: Bin Wang
 * @description: 灰度处理
 *
 */
;(function(Ps){

    window[Ps].module("toGray",function(P){

        var M = {
            process: function(imgData){
                var data = imgData.data;

                for(var i = 0,n = data.length;i < n;i += 4){
                    var gray = parseInt((data[i] + data[i + 1] + data[i + 2]) / 3);
                    data[i + 2] = data[i + 1] = data[i] = gray;
                }

                imgData.data = data;

                return imgData;
            }
        };

        return M;

    });

})("psLib");
