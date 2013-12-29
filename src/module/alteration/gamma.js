/**
 * @author: Bin Wang
 * @description: gamma调节
 *
 */
;(function(Ps){

    window[Ps].module("Alteration.gamma",function(P){

        var M = {
            process: function(imgData, args){
                var dM = P.lib.dorsyMath;
                var data = imgData.data;
                var width = imgData.width;
                var height = imgData.height;

                //gamma阶-100， 100
                var gamma;

                if(args[0] == undefined) gamma = 10;
                else gamma = args[0];

                var normalizedArg = ((gamma + 100) / 200) * 2;
                
                for(var x = 0; x < width; x ++){
                    for(var y = 0; y < height; y ++){
                        dM.xyCal(imgData, x, y, function(r, g, b){
                            return [
                                Math.pow(r, normalizedArg),
                                Math.pow(g, normalizedArg),
                                Math.pow(b, normalizedArg)
                            ];
                        });
                    }
                }
                return imgData;
            }
        };

        return M;

    });

})("psLib");
