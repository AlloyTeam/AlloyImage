/**
 * @author: Bin Wang
 * @description:    曲线 
 *
 */
;(function(Ps){

    window[Ps].module("Alteration.curve", function(P){

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
                /*
                 * arg   arg[0] = [3,3] ,arg[1]  = [2,2]
                 * */
                var startTime = (new Date()).getTime();
                //获得插值函数
                var f = P.lib.dorsyMath.lagrange(arg[0], arg[1]);
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;

                //调节通道
                var channel = arg[2];
                if(!(/[RGB]+/.test(channel))){
                    channel = "RGB";
                }
                
                var channelString = channel.replace("R","0").replace("G","1").replace("B","2");
                var indexOfArr = [
                    channelString.indexOf("0") > -1,
                    channelString.indexOf("1") > -1,
                    channelString.indexOf("2") > -1
                ];
                console.log(indexOfArr[0]);

                //区块
                for(var x = 0; x < width; x ++){

                    for(var y = 0; y < height; y ++){
                        
                        var realI = y * width + x;

                        for(var j = 0; j < 3; j ++){
                            if(! indexOfArr[j]) continue;
                            data[realI * 4 + j] = f(data[realI * 4 + j]);
                        }

                    }

                }
                console.log("curveJS: " + ((new Date()).getTime() - startTime));
                return imgData;
            },

            processCL: function(imgData, arg){
                /*
                 * arg   arg[0] = [3,3] ,arg[1]  = [2,2]
                 * */
                var startTime = (new Date()).getTime();
                //调节通道
                var channel = arg[2];
                if(!(/[RGB]+/.test(channel))){
                    channel = "RGB";
                }
                
                var channelString = channel.replace("R","0").replace("G","1").replace("B","2");
                
                var indexOfArr = [];
                    channelString.indexOf("0") > -1 ? indexOfArr[0] = 1 : indexOfArr[0] = 0;
                    channelString.indexOf("1") > -1 ? indexOfArr[1] = 1 : indexOfArr[1] = 0;
                    channelString.indexOf("2") > -1 ? indexOfArr[2] = 1 : indexOfArr[2] = 0;
                var result = P.lib.webcl.run("curve",
                                             [P.lib.webcl.convertArrayToBuffer(arg[0], "float"),
                                              P.lib.webcl.convertArrayToBuffer(arg[1], "float"),
                                              P.lib.webcl.convertArrayToBuffer(indexOfArr, "int"),
                                              new Int32Array([arg[0].length])
                                             ])
                                        .getResult();
                for (var i = 0; i < result.length; ++i){
                    imgData.data[i] = result[i];
                }
                console.log("curveCL: " + ((new Date()).getTime() - startTime));
                return imgData;
            }
        };

        return M;

    });

})("psLib");
