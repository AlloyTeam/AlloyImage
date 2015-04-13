/**
 * @author: Bin Wang
 * @description: Main config
 *
 */
;(function(Ps){

    window[Ps].module("config",function(P){

        //记录映射关系
        var Reflection = {
            //调整
            Alteration: {
                "亮度": "brightness",
                "色相/饱和度调节": "setHSI",
                "曲线" : "curve",
                "gamma调节" : "gamma",
                "可选颜色": "selectiveColor"
            },

            //滤镜
            Filter: {
                "灰度处理": "toGray",
                "反色": "toReverse",
                "灰度阈值": "toThresh",
                "高斯模糊": "gaussBlur",
                "浮雕效果": "embossment",
                "查找边缘": "borderline",
                "马赛克": "mosaic",
                "油画": "oilPainting",
                "腐蚀": "corrode",
                "锐化" : "sharp",
                "添加杂色" : "noise",
                "暗角" : "darkCorner",
                "喷点" : "dotted",
                "降噪" : "denoise",
                "棕褐色" : "sepia",
                "色调分离" : "posterize"
            },

            ComEffect: {
                "美肤" : "softenFace",
                "素描" : "sketch",
                "自然增强" : "softEnhancement",
                "紫调" : "purpleStyle",
                "柔焦" : "soften",
                "复古" : "vintage",
                "黑白" : "gray",
                "仿lomo" : "lomo",
                "亮白增强" : "strongEnhancement",
                "灰白" : "strongGray",
                "灰色" : "lightGray",
                "暖秋" : "warmAutumn",
                "木雕" : "carveStyle",
                "粗糙" : "rough"
            }
        };

        //转换映射关系 便于查找
        var revertReflection = function(){
            var result = {};

            for(var i in Reflection){
                //comEffect 组合效果不遍历
                if(i == "ComEffect") continue;

                for(var j in Reflection[i]){
                    result[j] = i;
                    result[Reflection[i][j]] = i;
                }
            }

            return result;
        }();

        var Config = {

            getModuleName: function(method){
                var spaceName;

                if(spaceName = revertReflection[method]){
                    var actName = Reflection[spaceName][method] || method;
                    return {
                        spaceName: spaceName,
                        actName: actName
                    };

                }else{
                    throw new Error("AI_ERROR:调用AI不存在的方法" + method);
                }
            },

            //组合效果
            getEasyFun: function(effect){
                return {
                    spaceName: "ComEffect",
                    actName: Reflection.ComEffect[effect] || effect
                };
            },

            getConfig: function(){
                return Reflection;
            }
        };

        return Config;

    });

})("psLib");
