/**
 * @author: Bin Wang
 * @description:  可选颜色 
 * @参考：http://wenku.baidu.com/view/e32d41ea856a561252d36f0b.html
 *
 */
;(function(Ps){

    window[Ps].module("Alteration.selectableColor",function(P){

        var M = {
            process: function(imgData, arg){//调节亮度对比度
                //选择的颜色
                var color = arg[0];

                //百分数
                var C = arg[1];
                var M = arg[2];
                var Y = arg[3];
                var K = arg[4];

                //是否相对
                var isRelative = arg[5] || 0;

                var maxColorMap = {
                    red: "R",
                    green: "G",
                    blue: "B",
                    "红色": "R",
                    "绿色": "G",
                    "蓝色": "B"
                };

                var minColorMap = {
                    cyan: "R",
                    magenta: "G",
                    yellow: "B",
                    "青色": "R",
                    "洋红": "G",
                    "黄色": "B"
                };

                //检查是否是被选中的颜色
                var checkSelectedColor = function(colorObj){
                    if(maxColorMap[color]){
                        return Math.max(colorObj.R, colorObj.G, colorObj.B) == colorObj[maxColorMap[color]];
                    }else if(minColorMap[color]){
                        return Math.min(colorObj.R, colorObj.G, colorObj.B) == colorObj[minColorMap[color]];
                    }else if(color == "black" || color == "黑色"){
                        return Math.min(colorObj.R, colorObj.G, colorObj.B) < 128;
                    }else if(color == "white" || color == "白色"){
                        return Math.max(colorObj.R, colorObj.G, colorObj.B) > 128;
                    }else if(color == "中性色"){
                        return ! ((Math.max(colorObj.R, colorObj.G, colorObj.B) < 1) || (Math.min(colorObj.R, colorObj.G, colorObj.B) > 224));
                    }
                };

                var upLimit = 0;
                var lowLimit = 0;
                var limit = 0;

                var alterNum = [C, M, Y, K];
                for(var x = 0, w = imgData.width; x < w; x ++){
                    for(var y = 0, h = imgData.height; y < h; y ++){
                        P.lib.dorsyMath.xyCal(imgData, x, y, function(R, G, B){
                            var colorObj = {
                                R: R,
                                G: G,
                                B: B
                            };

                            var colorArr = [R, G, B];
                            var resultArr =[];

                            if(checkSelectedColor(colorObj)){
                                if(maxColorMap[color]){
                                    var maxColor = maxColorMap[color];

                                    var middleValue = R + G + B - Math.max(R, G, B) - Math.min(R, G, B);
                                    limit = colorObj[maxColor] - middleValue;

                                    for(var i = 0; i < 3; i ++){
                                        //可减少到的量
                                        var lowLimitDelta = ~~ (limit * (colorArr[i] / 255));
                                        var lowLimit = colorArr[i] - lowLimitDelta;

                                        //可增加到的量
                                        var upLimitDelta =  ~~ (limit * (1 - colorArr[i] / 255));
                                        var upLimit = colorArr[i] + upLimitDelta;

                                        //相对调节
                                        if(isRelative){
                                            //如果分量大于128  减少量=增加量
                                            if(colorArr[i] > 128){
                                                lowLimitDelta = upLimitDelta;
                                            }

                                            //> 0表明在减少
                                            if(alterNum[i] > 0){
                                                var realUpLimit = colorArr[i] - alterNum[i] * lowLimitDelta; 
                                            }else{
                                                var realUpLimit = colorArr[i] - alterNum[i] * upLimitDelta; 
                                            }
                                        }else{

                                            //现在量
                                            var realUpLimit = limit * - alterNum[i] + colorArr[i];

                                            if(realUpLimit > upLimit) realUpLimit = upLimit;
                                            if(realUpLimit < lowLimit) realUpLimit = lowLimit;
                                        }

                                        resultArr[i] = realUpLimit;
                                    }
                                }

                                return resultArr;
                            }
                        });
                    }
                }
                    

            }
        };

        return M;
    });

})("psLib");
