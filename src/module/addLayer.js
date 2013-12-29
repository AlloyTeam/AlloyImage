/**
 * @author: Bin Wang
 * @description: Main add
 *
 */
;(function(Ps){

    window[Ps].module("addLayer",function(P){

        var Add = {

            //isFast用于快速，适用于中间处理
            add: function(lowerData, upperData, method, alpha, dx, dy, isFast, channel){
                var l = lowerData.data,
                    u = upperData.data,
                
                    dx = dx || 0,
                    dy = dy || 0,
                    alpha = alpha || 1,//alpha 范围为0 - 100
                    isFast = isFast || false,
                    channel = channel || "RGB";

                if(!(/[RGB]+/.test(channel))){
                    channel = "RGB";
                }
                
                var channelString = channel.replace("R","0").replace("G","1").replace("B","2"),
                    jump = 1,
                    result,
                    width = lowerData.width,
                    height = lowerData.height,
                    upperLength = u.length,
                    upperWidth = upperData.width,
                    upperHeight = upperData.height,

                    indexOfArr = [
                        channelString.indexOf("0") > -1,
                        channelString.indexOf("1") > -1,
                        channelString.indexOf("2") > -1
                    ],
                    everyJump = 4 * jump;

                     /*
                if(isFast){
                   jump = 1; 
                }
                */           

                var ii, row, col, uRow, uCol, uIi, uI;

                //计算重叠部分x ,y范围
                var xMin, yMin, xMax, yMax;

                var uXMin = dx;
                var uXMax = dx + upperWidth;
                var uYMin = dy;
                var uYMax = dy + upperHeight;

                if(uXMin > width){
                    return;
                }else if(uXMin < 0){
                    uXMin = 0;
                }

                if(uXMax < 0){
                    return;
                }else if(uXMax > width){
                    uXMax = width;
                }

                if(uYMin > height){
                    return;
                }else if(uYMin < 0){
                    uYMin = 0;
                }

                if(uYMax < 0){
                    return;
                }else if(uYMax > height){
                    uYMax = height;
                }

                
                var currRow, upperY, upperRow;
                for(var y = uYMin; y < uYMax; y ++){
                    currRow = y * width;
                    upperY = y - dy;
                    upperRow = upperY * upperWidth;

                    for(var x = uXMin; x < uXMax; x ++){
                    //计算此时对应的upperX,Y
                        var upperX = x - dx;

                        //计算此时的i
                        var i = (currRow + x) * 4;

                        //计算此时的upperI
                        var uI = (upperRow + upperX) * 4;

                //for(var i = 0, n = l.length; i < n; i += everyJump){

                    //ii = i / 4;

                    //得到当前点的坐标 y分量
                    //row = ~~(ii / width); 
                    //col = ii % width;

                    //uRow = row - dy;
                    //uCol = col - dx;

                    //uIi = uRow * upperWidth + uCol;
                    //uI = uIi * 4;

                    //if(uI >= 0 && uI < (upperLength - 4) && uCol < upperWidth && uCol >= 0){

                        //l[i + 3] = u[uI + 3];//透明度
                        for(var j = 0; j < 3; j ++){
                            
                            //若此点透明则不计算
                            if(u[uI + 3] == 0) break;
                            else l[i + 3] = u[uI + 3];

                            switch(method){
                                case "颜色减淡" :
                                    if(indexOfArr[j]){
                                       result = l[i + j] + (l[i + j] * u[uI + j]) / (255 - u[uI + j]);
                                       l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "变暗":
                                    if(indexOfArr[j]){
                                        result = l[i + j] < u[uI + j] ? l[i + j] : u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "变亮":
                                    if(indexOfArr[j]){
                                        result = l[i + j] > u[uI + j] ? l[i + j] : u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "正片叠底":
                                    if(indexOfArr[j]){
                                        result = ~~((l[i + j] * u[uI + j]) / 255);
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "滤色" :
                                    if(indexOfArr[j]){
                                        result = ~~(255 - (255 - l[i + j]) * (255 - u[uI + j]) / 255);
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "叠加":
                                    if(indexOfArr[j]){
                                        if(l[i + j] <= 127.5){
                                            result = l[i + j] * u[uI + j] / 127.5;
                                        }else{
                                            result = 255 - (255 - l[i + j]) * (255 - u[uI + j]) / 127.5;
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "强光":
                                    if(indexOfArr[j]){
                                        if(u[uI + j] <= 127.5){
                                            result = l[i + j] * u[uI + j] / 127.5;
                                        }else{
                                            result = l[i + j] + (255 - l[i + j]) * (u[uI + j] - 127.5) / 127.5;
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "差值":
                                    if(indexOfArr[j]){
                                        result = l[i + j] > u[uI + j] ? l[i + j] - u[uI + j] : u[uI + j] - l[i + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "排除":
                                    if(indexOfArr[j]){
                                        result = l[i + j] + u[uI + j] - (l[i + j] * u[uI + j]) / 127.5;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "点光":
                                    if(indexOfArr[j]){
                                        if(l[i + j] < (2 * u[uI + j] - 255)){
                                            result = 2 * u[uI + j] - 255;
                                        }else if(l[i + j] < 2 * u[uI + j]){
                                            result = l[i + j];
                                        }else{
                                            result = 2 * u[uI + j];    
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "颜色加深":
                                    if(indexOfArr[j]){
                                        result = 255 - 255 * (255 - l[i + j]) / u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "线性加深":
                                    if(indexOfArr[j]){
                                        var tempR = l[i + j] + u[uI + j];
                                        result = tempR > 255 ? tempR - 255 : 0;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "线性减淡":
                                    if(indexOfArr[j]){
                                        var tempR = l[i + j] + u[uI + j];
                                        result = tempR > 255 ? 255 : tempR;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "柔光":
                                    if(indexOfArr[j]){
                                        if(u[uI + j] < 127.5){
                                            result = ((2 * u[uI + j] - 255) * (255 - l[i + j]) / (255 * 255) + 1) * l[i + j];
                                        }else{
                                            result = (2 * u[uI + j] - 255) * (Math.sqrt(l[i + j] / 255) - l[i + j] / 255) + l[i + j];
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "亮光":
                                    if(indexOfArr[j]){
                                        if(u[uI + j] < 127.5){
                                            result = (1 - (255 - l[i + j]) / (2 * u[uI + j])) * 255;
                                        }else{
                                            result = l[i + j] / (2 * (1 - u[uI + j] / 255));
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "线性光":
                                    if(indexOfArr[j]){
                                        var tempR = l[i + j] + 2 * u[uI + j] - 255;
                                        result = tempR > 255 ? 255 : tempR;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "实色混合":
                                    if(indexOfArr[j]){
                                        if(u[uI + j] < (255 - l[i + j])){
                                            result = 0;
                                        }else{
                                            result = 255;
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                default: 
                                    if(indexOfArr[j]){
                                        result = u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                            }//end switch
                        }//end for
                    }//end y
                    
                }//end x

                return lowerData;
            }
        };

        return Add;

    });

})("psLib");
