/**
 * @author: Bin Wang
 * @description: 查找边缘
 *
 */
;(function(Ps){

    window[Ps].module("Filter.borderline",function(P){

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
                var template1 = [
                    -2,-4,-4,-4,-2,
                    -4,0,8,0,-4,
                    -4,8,24,8,-4,
                    -4,0,8,0,-4,
                    -2,-4,-4,-4,-2
                ];
                var template2 = [
                        0,		1,		0,
						1,		-4,		1,
						0,		1,		0
                ];
                var template3 = [
                ];
                var result = P.lib.dorsyMath.applyMatrix(imgData,template2,250);
                console.log("borderlineJS: " + ((new Date()).getTime() - startTime));
                return result;
            },

            processCL: function(imgData,arg){
                var startTime = (new Date()).getTime();
                var template = [
                        0,      1,      0,
                        1,      -4,     1,
                        0,      1,      0
                ];
                var start = -(Math.sqrt(template.length) - 1) / 2;
                var low = 250;
                var result =  P.lib.webcl.run("borderline",
                                              [new Int32Array([start]),
                                               P.lib.webcl.convertArrayToBuffer(template, "int"),
                                               P.lib.webcl.convertArrayToBuffer(imgData.data, "float")])
                                         .getResult();
                for (var i = 0; i < result.length; ++i){
                    if (result[i] < 256){
                        imgData.data[i] = result[i] < low ? result[i] : imgData.data[i];
                    }
                }
                console.log("borderlineCL: " + ((new Date()).getTime() - startTime));
                return imgData;
            }
        };

        return M;

    });

})("psLib");
