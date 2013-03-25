/*
 * @author: Bin Wang
 * @description: Main config
 *
 * */
;(function(Ps){

    window[Ps].module("config",function(P){

        //记录映射关系
        var Reflection = {
            "灰度处理": "toGray",
            "反色": "toReverse",
            "灰度阈值": "toThresh",
            "高斯模糊": "gaussBlur",
            "亮度": "alterRGB",
            "浮雕效果": "embossment",
            "查找边缘": "lapOfGauss",
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
            "美肤" : "e1",
            "素描" : "e2",
            "自然增强" : "e3",
            "紫调" : "e4",
            "柔焦" : "e5",
            "复古" : "e6",
            "黑白" : "e7",
            "仿lomo" : "e8",
            "亮白增强" : "e9",
            "灰白" : "e10",
            "灰色" : "e11",
            "暖秋" : "e12",
            "木雕" : "e13"
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
