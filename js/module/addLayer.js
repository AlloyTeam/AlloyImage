/*
 * @author: Bin Wang
 * @description: Main add
 *
 * */
;(function(Ps){

    window[Ps].module("addLayer",function(P){

        var Add = {
            add: function(lowerData,upperData,method,dx,dy,isFast){//isFast用于快速，适用于中间处理
                var l = lowerData.data;
                var u = upperData.data;
                dx = dx || 0;
                dy = dy || 0;

                var jump = 1;
                if(isFast){
                   jump = 20; 
                }

                for(var i = 0,n = l.length;i < n;i += 4 * jump){

                    var ii = i / 4,
                        width = lowerData.width;
                        height = lowerData.height;
                    var row = parseInt(ii / width); //得到当前点的坐标 y分量
                    var col = ii % width;

                    var uRow = row - dy;
                    var uCol = col - dx;

                    var uIi = uRow * upperData.width + uCol;
                    var uI = uIi * 4;

                    if(uI >= 0 && uI < (upperData.data.length - 4) && uCol < upperData.width && uCol >= 0){
                        l[i + 3] = u[uI + 3];//透明度
                        for(var j = 0;j < 3;j ++){
                            switch(method){
                                case "颜色减淡" :
                                    l[i + j] = l[i + j] + (l[i + j] * u[uI + j]) / (255 - u[uI + j]);
                                    break;

                                case "变暗":
                                    l[i + j] = l[i + j] < u[uI + j] ? l[i + j] : u[uI + j];
                                    break;

                                case "变亮":
                                    l[i + j] = l[i + j] > u[uI + j] ? l[i + j] : u[uI + j];
                                    break;

                                case "正片叠底":
                                    l[i + j] = parseInt((l[i + j] * u[uI + j]) / 255);
                                    break;

                                case "滤色" :
                                    l[i + j] = parseInt(255 - (255 - l[i + j]) * (255 - u[uI + j]) / 255);
                                    break;

                                case "叠加":
                                    if(l[i + j] <= 127.5){
                                        l[i + j] = l[i + j] * u[uI + j] / 127.5;
                                    }else{
                                        l[i + j] = 255 - (255 - l[i + j]) * (255 - u[uI + j]) / 127.5;
                                    }
                                    break;
                                case "强光":
                                    if(u[uI + j] <= 127.5){
                                        l[i + j] = l[i + j] * u[uI + j] / 127.5;
                                    }else{
                                        l[i + j] = l[i + j] + (255 - l[i + j]) * (u[uI + j] - 127.5) / 127.5;
                                    }
                                    break;
                                case "差值":
                                    l[i + j] = l[i + j] > u[uI + j] ? l[i + j] - u[uI + j] : u[uI + j] - l[i + j];
                                    break;

                                case "排除":
                                    l[i + j] = l[i + j] + u[uI + j] - (l[i + j] * u[uI + j]) / 127.5;
                                    break;

                                case "点光":
                                    if(l[i + j] < (2 * u[uI + j] - 255)){
                                        l[i + j] = 2 * u[uI + j] - 255;
                                    }else if(l[i + j] < 2 * u[uI + j]){
                                    }else{
                                        l[i + j] = 2 * u[uI + j];    
                                    }
                                    break;

                                case "颜色加深":
                                    l[i + j] = 255 - 255 * (255 - l[i + j]) / u[uI + j];
                                    break;

                                case "线性加深":
                                    var tempR = l[i + j] + u[uI + j];
                                    l[i + j] = tempR > 255 ? tempR - 255 : 0;
                                    break;

                                case "线性减淡":
                                    var tempR = l[i + j] + u[uI + j];
                                    l[i + j] = tempR > 255 ? 255 : tempR;
                                    break;

                                case "柔光":
                                    if(u[uI + j] < 127.5){
                                        l[i + j] = ((2 * u[uI + j] - 255) * (255 - l[i + j]) / (255 * 255) + 1) * l[i + j];
                                    }else{
                                        l[i + j] = (2 * u[uI + j] - 255) * (Math.sqrt(l[i + j] / 255) - l[i + j] / 255) + l[i + j];
                                    }
                                    break;

                                case "亮光":
                                    if(u[uI + j] < 127.5){
                                        l[i + j] = (1 - (255 - l[i + j]) / (2 * u[uI + j])) * 255;
                                    }else{
                                        l[i + j] = l[i + j] / (2 * (1 - u[uI + j] / 255));
                                    }
                                    break;

                                case "线性光":
                                    var tempR = l[i + j] + 2 * u[uI + j] - 255;
                                    l[i + j] = tempR > 255 ? 255 : tempR;
                                    break;

                                case "实色混合":
                                    if(u[uI + j] < (255 - l[i + j])){
                                        l[i + j] = 0;
                                    }else{
                                        l[i + j] = 255;
                                    }
                                    break;

                                default: 
                                    l[i + j] = u[uI + j];
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
