/**
 * AlloyImage process module
 * The main Process module For AlloyImage, It's private;
 * @author dorsywang From Tencent AlloyTeam
 */

AIDefine('process', ['config', 'layer'], function(Config, Layer){
    var Process = {

        //模块池
        lib: [],

        //外部定义的ps效果
        definedPs: {},

        //初始化准备
        init: function(){
            this.require("config");
        },

        //模块注册方法
        module: function(name, func){
            var moduleArr = [name];
            if(/\./g.test(name)){
                moduleArr = name.split(".");
            }

            var count = -1, _this = this;
            function addModule(obj){
                count ++;

                var attr = moduleArr[count];

                //递归出口
                if(count == moduleArr.length - 1){
                    obj[attr] = func.call(null, _this);

                    return;
                }

                obj[attr] ? addModule(obj[attr]) : addModule(obj[attr] = {});
            }

            addModule(this.lib);

        },

        //加载文件
        require: function(name){
            var _this = this;
            var scriptLoader = document.createElement("script");

            document.body.appendChild(scriptLoader);
            scriptLoader.src = "./js/module/" + name + ".js";
            scriptLoader.onload = scriptLoader.onerror = function(e){
                _this.handlerror(e);
            }
        },

        //错误处理部分
        handlerror: function(e){
            //this.destroySelf("程序因未知原因中断");
        },

        //程序被迫自杀，杀前请留下遗嘱
        destroySelf: function(msg){
            delete window[Ps];
            var e = new Error(msg);
            throw(e);
        },

        //映射器,将中文方法或...映射为实际方法
        reflect: function(method, imgData, args){

            //得到实际的模块名称
            var moduleName = Config.getModuleName(method);

            var spaceName = moduleName.spaceName;
            var actName = moduleName.actName;

            switch(spaceName){
                case "Filter":
                    return Filter[actName].process(imgData, args);

                case "Alteration":

                    return Alteration[actName].process(imgData, args);
                    //break;

                case "ComEffect":
                    return ComEffect[actName].process(imgData, args);
                    //break;

                default:
                    //逻辑几乎不会到这里 出于好的习惯，加上default
                    this.destroySelf("AI_ERROR: ");
            }
        },

        //组合效果映射器
        reflectEasy: function(effect){
            var fun = Config.getEasyFun(effect).actName;
            return this.definedPs[effect] || ComEffect.getFun(fun);
        },

        //合并一个图层到对象
        add: function(lowerData, upperData, method, alpha, dx, dy, isFast, channel){
            return Layer.add(lowerData, upperData, method, alpha, dx, dy, isFast, channel);
        },

        //用worker进行异步处理
        worker: function(func, callback){
            
        },

        //对图像进行掩模算子变换
        applyMatrix: function(imgData, matrixArr){
        },

        //args[0]代表处理方法，args[1...]代表参数
        tools: function(imgData, args){
            var actMethod = Array.prototype.shift.call(args);

            if(this.lib.Tools[actMethod]){
                return this.lib.Tools[actMethod].process(imgData, args);
            }else{
                throw new Error("AI_ERROR: 不存在的工具方法_" + actMethod);
            }
        },

        definePs: function(name, func){
            this.definedPs[name] = func;
        }
    };

    return Process;
});
