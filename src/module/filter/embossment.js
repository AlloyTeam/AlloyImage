/**
 * @author: Bin Wang
 * @description:  浮雕效果
 *
 */
;(function(Ps){

    window[Ps].module("Filter.embossment",function(P){

        var M = {
            process: function(imgData, arg, mode){
               if (typeof(arguments[arguments.length-1]) == "boolean")
                   mode = arguments[arguments.length-1];
               else
                   return;
               if (mode)
                   this.processCL(imgData, arg);
               else
                   this.processJS(imgData, arg);
            },

            processJS: function(imgData, arg){
                var startTime = (new Date()).getTime();
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;

                var outData = [];
                for(var i = 0,n = data.length;i < n;i += 4){

                    var ii = i / 4;
                    var row = parseInt(ii / width);
                    var col = ii % width;
                    var A = ((row - 1) *  width + (col - 1)) * 4;
                    var G = (row + 1) * width * 4 + (col + 1) * 4;

                    if(row == 0 || col == 0) continue;
                    for(var j = 0;j < 3;j ++){
                        outData[i + j] = data[A + j] - data[G + j] + 127.5;
                    }
                    outData[i + 4] = data[i + 4];
                }

                for(var i = 0,n = data.length;i < n;i ++){
                    data[i] = outData[i] || data[i];
                }

                console.log("embossmentJS: " + ((new Date()).getTime() - startTime));
                return imgData;
            },

            processCL: function(imgData, arg){//（WebCL版本）
                var startTime = (new Date()).getTime();
                var result = P.lib.webcl.run("embossment",
                                             [P.lib.webcl.convertArrayToBuffer(imgData.data, "float")])
                                        .getResult();
                for (var i = 0; i < result.length; ++i)
                    imgData.data[i] = result[i];

                console.log("embossmentCL: " + ((new Date()).getTime() - startTime));
                return imgData;
            }
        };

        return M;

    });

})("psLib");
