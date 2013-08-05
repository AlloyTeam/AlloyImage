/**
 * @author: Bin Wang
 * @description: 查找边缘
 *
 */
;(function(Ps){

    window[Ps].module("Filter.borderline",function(P){

        var M = {
            process: function(imgData,arg){
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
                return P.lib.dorsyMath.applyMatrix(imgData,template2,250);
            }
        };

        return M;

    });

})("psLib");
