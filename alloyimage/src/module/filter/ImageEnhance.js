/**
 * @author: Bin Wang
 * @description:灰度扩展
 *
 */
;(function(Ps){

    window[Ps].module("Filter.ImageEnhance",function(P){

        var M = {
            process: function(imgData,arg1,arg2){
                var lamta = arg || 0.5;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;
                var p1 = arg1 || {x: 10,y: 10};
                var p2 = arg2 || {x: 50,y: 40};

                function transfer(d){
                }

                for(var i = 0,n = data.length;i < n;i += 4){
                    
                }

                imgData.data = data;

                return imgData;
            }
        };

        return M;

    });

})("psLib");
