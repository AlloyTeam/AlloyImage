/**
 * @author: Bin Wang
 * @description:灰度阈值 做只有2级灰度图像处理 
 *
 */
;(function(Ps){

    window[Ps].module("Filter.toThresh",function(P){

        var M = {
            process: function(imgData,arg){
                imgData = P.reflect("toGray", imgData);
                var data = imgData.data;

                var arg = arg[0] || 128;
                for(var i = 0,n = data.length;i < n;i ++){
                    if((i + 1) % 4){
                        data[i] = data[i] > arg ? 255 : 0;
                    }
                }

                imgData.data = data;

                return imgData;
            }
        };

        return M;

    });

})("psLib");
