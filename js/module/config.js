/**
 * @author: Bin Wang
 * @description: Main config
 *
 */
;(function(Ps){

    window[Ps].module("config",function(P){

        //记录映射关系
        var Reflection = {
            "灰度处理": "toGray",
            "反色": "toReverse",
            "灰度阈值": "toThresh",
            "高斯模糊": "gaussBlur",
            "亮度": "brightness",
            "浮雕效果": "embossment",
            "查找边缘": "borderline",
            "色相/饱和度调节": "setHSI",
            "马赛克": "mosaic",
            "油画": "oilPainting",
            "腐蚀": "corrode",
            "锐化" : "sharp",
            "添加杂色" : "noise",
            "曲线" : "curve",
            "暗角" : "darkCorner",
            "喷点" : "dotted"
        };

        var EasyReflection = {
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
        };

        var Config = {

            getModuleName: function(method){
                return Reflection[method] || method;
            },

            getEasyFun: function(effect){
                return EasyReflection[effect] || effect;
            }
        };

        return Config;

    });

})("psLib");
