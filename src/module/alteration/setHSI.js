/**
 * @author: Bin Wang
 * @description: 调整RGB 饱和和度  
 * H (-2*Math.PI , 2 * Math.PI)  S (-100,100) I (-100,100)
 * 着色原理  勾选着色后，所有的像素不管之前是什么色相，都变成当前设置的色相，
 * 然后饱和度变成现在设置的饱和度，但保持明度为原来的基础上加上设置的明度
 *
 */
;(function(Ps){

    window[Ps].module("Alteration.setHSI",function(P){

        var M = {
            process: function(imgData, arg, mode){//调节亮度对比度
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
                arg[0] = arg[0] / 180 * Math.PI;
                arg[1] = arg[1] / 100 || 0;
                arg[2] = arg[2] / 100 * 255 || 0;
                arg[3] = arg[3] || false;//着色
                
                //调节通道
                var channel = arg[4];
                if(!(/[RGBCMY]+/.test(channel))){
                    channel = "RGBCMY";
                }
                
                var letters = channel.split("");
                var indexOf = {};

                for(var i = 0; i < letters.length; i ++){
                    indexOf[letters[i]] = 1;
                }

                P.lib.dorsyMath.applyInHSI(imgData,function(i, color){
                    if(! indexOf[color]) return;

                    if(arg[3]){
                        i.H = arg[0];
                        i.S = arg[1];
                        i.I += arg[2];
                    }else{
                        i.H += arg[0];
                        i.S += arg[1];
                        i.I += arg[2];
                    }

                });
                console.log("setHSIJS: " + ((new Date()).getTime() - startTime));
                return imgData;
            },

            processCL: function(imgData,arg){//调节亮度对比度
                var startTime = (new Date()).getTime();
                arg[0] = arg[0] / 180 * Math.PI;
                arg[1] = arg[1] / 100 || 0;
                arg[2] = arg[2] / 100 * 255 || 0;
                arg[3] = arg[3] || 0;//着色
                
                //调节通道
                var channel = arg[4];
                if(!(/[RGBCMY]+/.test(channel))){
                    channel = "RGBCMY";
                }
                
                var indexOf = [
                    channel.indexOf("R") > -1 | 0,
                    channel.indexOf("Y") > -1 | 0,
                    channel.indexOf("G") > -1 | 0,
                    channel.indexOf("C") > -1 | 0,
                    channel.indexOf("B") > -1 | 0,
                    channel.indexOf("M") > -1 | 0
                ];

                if (arg[3])
                    arg[3] = 1;
                console.log(indexOf[1]); 
                var result = P.lib.webcl.run("setHSI",
                                             [new Float32Array([arg[0]]),
                                              new Float32Array([arg[1]]),
                                              new Float32Array([arg[2]]),
                                              new Float32Array([arg[3]]),
                                              P.lib.webcl.convertArrayToBuffer(indexOf, "int")
                                             ]).getResult();
                for (var i = 0; i < result.length; i++) {
                    imgData.data[i] = result[i];
                }
                console.log("setHSICL: " + ((new Date()).getTime() - startTime));
                return imgData;
            }
        };

        return M;

    });

})("psLib");
