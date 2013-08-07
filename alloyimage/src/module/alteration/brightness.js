/**
 * @author: Bin Wang
 * @description: 调整亮度对比度
 *
 */
;(function(Ps){

    window[Ps].module("Alteration.brightness",function(P){

        var M = {
            //调节亮度对比度
            process: function(imgData, args){
                var data = imgData.data;
                var brightness = args[0] / 50;// -1,1
                var arg2 = args[1] || 0;
                var c = arg2 / 50;// -1,1
                var k = Math.tan((45 + 44 * c) * Math.PI / 180);

                for(var i = 0,n = data.length;i < n;i += 4){
                    for(var j = 0;j < 3;j ++){
                        data[i + j] = (data[i + j] - 127.5 * (1 - brightness)) * k + 127.5 * (1 + brightness);
                    }
                }

                return imgData;
            }
        };

        return M;

    });

})("psLib");
