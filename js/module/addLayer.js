/*
 * @author: Bin Wang
 * @description: Main add
 *
 * */
;(function(Ps){

    window[Ps].module("addLayer",function(P){

        var Add = {

            //isFast用于快速，适用于中间处理
            add: function(lowerData, upperData, method, alpha, dx, dy, isFast, channel){
                var l = lowerData.data;
                var u = upperData.data;
                dx = dx || 0;
                dy = dy || 0;
                alpha = alpha || 1;//alpha 范围为0 - 100
                isFast = isFast || false;
                channel = channel || "RGB";

                if(!(/[RGB]+/.test(channel))){
                    channel = "RGB";
                }

                var channelString = channel.replace("R","0").replace("G","1").replace("B","2");

                var jump = 1;
                if(isFast){
                   jump = 1; 
                }

                var result;

                for(var i = 0,n = l.length;i < n;i += 4 * jump){

                    var ii = i / 4,
                        width = lowerData.width;
                        height = lowerData.height;

                    //得到当前点的坐标 y分量
                    var row = parseInt(ii / width); 
                    var col = ii % width;

                    var uRow = row - dy;
                    var uCol = col - dx;

                    var uIi = uRow * upperData.width + uCol;
                    var uI = uIi * 4;

                    if(uI >= 0 && uI < (upperData.data.length - 4) && uCol < upperData.width && uCol >= 0){

                        //l[i + 3] = u[uI + 3];//透明度
                        for(var j = 0;j < 3;j ++){

                            //若此点透明则不计算
                            if(u[uI + 3] == 0) break;
                            else l[i + 3] = u[uI + 3];

                            switch(method){
                                case "颜色减淡" :
                                    if(channelString.indexOf(j) > -1){
                                       result = l[i + j] + (l[i + j] * u[uI + j]) / (255 - u[uI + j]);
                                       l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "变暗":
                                    if(channelString.indexOf(j) > -1){
                                        result = l[i + j] < u[uI + j] ? l[i + j] : u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "变亮":
                                    if(channelString.indexOf(j) > -1){
                                        result = l[i + j] > u[uI + j] ? l[i + j] : u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "正片叠底":
                                    if(channelString.indexOf(j) > -1){
                                        result = parseInt((l[i + j] * u[uI + j]) / 255);
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "滤色" :
                                    if(channelString.indexOf(j) > -1){
                                        result = parseInt(255 - (255 - l[i + j]) * (255 - u[uI + j]) / 255);
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "叠加":
                                    if(channelString.indexOf(j) > -1){
                                        if(l[i + j] <= 127.5){
                                            result = l[i + j] * u[uI + j] / 127.5;
                                        }else{
                                            result = 255 - (255 - l[i + j]) * (255 - u[uI + j]) / 127.5;
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "强光":
                                    if(channelString.indexOf(j) > -1){
                                        if(u[uI + j] <= 127.5){
                                            result = l[i + j] * u[uI + j] / 127.5;
                                        }else{
                                            result = l[i + j] + (255 - l[i + j]) * (u[uI + j] - 127.5) / 127.5;
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "差值":
                                    if(channelString.indexOf(j) > -1){
                                        result = l[i + j] > u[uI + j] ? l[i + j] - u[uI + j] : u[uI + j] - l[i + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "排除":
                                    if(channelString.indexOf(j) > -1){
                                        result = l[i + j] + u[uI + j] - (l[i + j] * u[uI + j]) / 127.5;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "点光":
                                    if(channelString.indexOf(j) > -1){
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
                                    if(channelString.indexOf(j) > -1){
                                        result = 255 - 255 * (255 - l[i + j]) / u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "线性加深":
                                    if(channelString.indexOf(j) > -1){
                                        var tempR = l[i + j] + u[uI + j];
                                        result = tempR > 255 ? tempR - 255 : 0;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "线性减淡":
                                    if(channelString.indexOf(j) > -1){
                                        var tempR = l[i + j] + u[uI + j];
                                        result = tempR > 255 ? 255 : tempR;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "柔光":
                                    if(channelString.indexOf(j) > -1){
                                        if(u[uI + j] < 127.5){
                                            result = ((2 * u[uI + j] - 255) * (255 - l[i + j]) / (255 * 255) + 1) * l[i + j];
                                        }else{
                                            result = (2 * u[uI + j] - 255) * (Math.sqrt(l[i + j] / 255) - l[i + j] / 255) + l[i + j];
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "亮光":
                                    if(channelString.indexOf(j) > -1){
                                        if(u[uI + j] < 127.5){
                                            result = (1 - (255 - l[i + j]) / (2 * u[uI + j])) * 255;
                                        }else{
                                            result = l[i + j] / (2 * (1 - u[uI + j] / 255));
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "线性光":
                                    if(channelString.indexOf(j) > -1){
                                        var tempR = l[i + j] + 2 * u[uI + j] - 255;
                                        result = tempR > 255 ? 255 : tempR;
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                case "实色混合":
                                    if(channelString.indexOf(j) > -1){
                                        if(u[uI + j] < (255 - l[i + j])){
                                            result = 0;
                                        }else{
                                            result = 255;
                                        }
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                                    break;

                                default: 
                                    if(channelString.indexOf(j) > -1){
                                        result = u[uI + j];
                                        l[i + j] = (1 - alpha) * l[i + j] + (alpha) * result;
                                    }
                            }
                        }
                    }
                    
                }

                lowerData.data = l;

                return lowerData;
            }
        };

        return Add;

    });

})("psLib");
