/*
 * @author: Bin Wang
 * @description: Main config
 *
 * */
;(function(Ps){

    window[Ps].module("config",function(P){

        var Reflection = {//记录映射关系
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
            "添加杂色" : "noise"
        };

        var Config = {
            getModuleName: function(method){
                return Reflection[method];
            }
        };

        return Config;

    });

})("psLib");
