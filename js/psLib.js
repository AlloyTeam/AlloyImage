/*
 * @author:Bin Wang
 * @description: Main
 *
 */

//删除几个元素   arr为数组下标 
Array.prototype.del = function(arr){

    arr.sort();
    var b = this.concat([]);
    for(var i = arr.length - 1;i >= 0;i --){
        b = b.slice(0,arr[i]).concat(b.slice(arr[i] + 1));
    }
    return b;
};

HTMLImageElement.prototype.loadOnce = function(func){//图片的初次加载才触发事件，后续不触发
   var i = 0;
   this.onload = function(){
        if(!i) func.call(this,null);
        i ++;
   };
};

;(function(Ps){


    var P = {//被所有对象引用的一个对象,静态对象,主处理模块

        lib: [],//模块池

        init: function(){//初始化准备
            this.require("config");
        },

        module: function(name,func){//模块
            this.lib[name] = func.call(null, this);
        },

        require: function(name){//加载文件
            var _this = this;
            var scriptLoader = document.createElement("script");
            document.body.appendChild(scriptLoader);
            scriptLoader.src = "./js/module/" + name + ".js";
            scriptLoader.onload = scriptLoader.onerror = function(e){
                _this.handlerror(e);
            }
        },

        handlerror: function(e){//错误处理部分
            //this.destroySelf("程序因未知原因中断");
        },

        destroySelf: function(msg){//程序被迫自杀，杀前请留下遗嘱
            delete window[Ps];
            var e = new Error(msg);
            throw(e);
        },

        reflect: function(method,imgData,args){//映射器,将中文方法或...映射为实际方法
            var moduleName = this.lib.config.getModuleName(method);//得到实际的模块名称
            return this.lib[moduleName].process(imgData,args);//交由实际处理数据单元处理
        },

        reflectEasy: function(effect){
            var fun = this.lib.config.getEasyFun(effect);
            return this.lib.easy.getFun(fun);
        },

        add: function(lowerData,upperData,method,alpha,dx,dy,isFast,channel){
            return this.lib.addLayer.add(lowerData,upperData,method,alpha,dx,dy,isFast,channel);
        },

        applyMatrix: function(imgData,matrixArr){//对图像进行掩模算子变换
        }



    };

//返回外部接口
    window[Ps] = function(img,width,height){
        if(this instanceof window[Ps]){
        /*
            var image = new Image();
            image.src = img;
            image.onload = function(){
            */
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");

            if(!isNaN(img)){//var l = psLib(20,30);构造适配
                canvas.width = img;
                canvas.height = width;
                height = height || "rgba(255,1,1,0)";
                context.fillStyle = height;
                context.fillRect(0,0,img,width);
            }else{

                /*
                document.body.appendChild(img);
                var computedStyle = getComputedStyle(img);
                canvas.width = parseInt(computedStyle.getPropertyValue("width"));
                canvas.height = parseInt(computedStyle.getPropertyValue("height"));
                context.drawImage(img,0,0);
                //img.style.display = "none";
                */

                canvas.width = parseInt(img.width);
                canvas.height = parseInt(img.height);

                var computedStyle = getComputedStyle(img);
                imgWidth = parseInt(computedStyle.getPropertyValue("width"));
                imgHeight = parseInt(computedStyle.getPropertyValue("height"));

                if(!isNaN(imgWidth)) context.drawImage(img,0,0,imgWidth,imgHeight);
                else context.drawImage(img,0,0);

            }
            //canvas.draggable = "draggable";


            //document.body.appendChild(canvas);

            this.canvas = canvas;
            this.context = context;
            this.imgData = context.getImageData(0,0,canvas.width,canvas.height);

            this.name = Ps + "_" + Math.random();
            this.canvas.id = this.name;
            this.layers = [];//记录挂接到图层上的对象的引用

            /*
            }
            */
            
        }else{
            return new window[Ps](img,width,height);//返回自身构造对象
        }
    };

    window[Ps].module = function(name, func){
        P.module(name,func);
    };

    window[Ps].prototype = {//原型对象

        act: function(method,arg){
            var args = [];
            for(var i = 0;i < arguments.length;i ++){
                if(i == 0) continue;
                args.push(arguments[i]);
            }

            P.reflect(method,this.imgData,args);

            return this;
        },
        view: function(method,arg1,arg2,arg3,arg4){//预览模式 ，所有的再操作全部基于原点，不会改变本图层的效果，直到act会去除这部分图层
            var newLayer = this.clone();
            newLayer.type = 1;
            this.addLayer(newLayer,"正常",0,0);
            newLayer.act(method,arg1,arg2,arg3,arg4);

            return this;
        },

        excute: function(){//将view的结果执行到图层
            var layers = this.layers;
            var n = layers.length;
            if(layers[n - 1] && layers[n - 1][0].type == 1){
                this.imgData = layers[n - 1][0].imgData;
                delete layers[n - 1];
            }
        },

        cancel: function(){//取消view的结果执行
            var layers = this.layers;
            var n = layers.length;
            if(layers[n - 1] && layers[n - 1][0].type == 1){
                delete layers[n - 1];
            }
        },
        show: function(selector,isFast){//isFast用于快速显示

            //创建一个临时的psLib对象，防止因为合并显示对本身imgData影响
            var tempPsLib = new window[Ps](this.canvas.width,this.canvas.height);
            tempPsLib.add(this,"正常",0,0,isFast);
            this.tempPsLib = tempPsLib;

            //将挂接到本对象上的图层对象 一起合并到临时的psLib对象上去 用于显示合并的结果，不会影响每个图层，包括本图层
            for(var i = 0;i < this.layers.length;i ++){
                var tA = this.layers[i];
                var layers = tA[0].layers;
                var currLayer = tA[0];
                if(layers[layers.length - 1] && layers[layers.length - 1][0].type == 1) currLayer = layers[layers.length - 1][0];
                tempPsLib.add(currLayer,tA[1],tA[2],tA[3],isFast);
            }

            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.context.putImageData(tempPsLib.imgData,0,0);//以临时对象data显示
            if(selector){
                //var alreadyCanvas = document.querySelector("#" + this.name);
                    document.querySelector(selector).appendChild(this.canvas);
            }else{
                document.body.appendChild(this.canvas);
            }

            return this;
        },

        replace: function(img){//替换原来的图片
            if(img){
                img.onload = function(){};
                img.src = this.save();
            }

            return this;
        },

        add: function(){//psLibObj,method,alpha,dx,dy,isFast,channel){合并一个psLibObj图层上去
            
            var numberArr = [],psLibObj,method,alpha,dx,dy,isFast,channel;
            for(var i = 0;i < arguments.length;i ++){
                if(!i) continue;

                switch(typeof(arguments[i])){
                    case "string":
                        if(/\d+%/.test(arguments[i])){//alpha
                            alpha = arguments[i].replace("%","");
                        }else if(/[RGB]+/.test(arguments[i])){//channel
                            channel = arguments[i];
                        }else{//method
                            method = arguments[i];
                        }
                    break;

                    case "number":
                        numberArr.push(arguments[i]);
                    break;

                    case "boolean":
                       isFast = arguments[i];
                    break;

                        
                }
            }

            dx = numberArr[0] || 0;
            dy = numberArr[1] || 0;
            method = method || "正常";
            alpha = alpha / 100 || 1;
            isFast = isFast || false;
            channel = channel || "RGB";

            psLibObj = arguments[0];

            this.imgData = P.add(this.imgData,psLibObj.imgData,method,alpha,dx,dy,isFast,channel);

            return this;
        },

        addLayer: function(psLibObj,method,dx,dy){//挂载一个图层上去，不会影响本身，只是显示有变化
            this.layers.push([psLibObj,method,dx,dy]);

            return this;
        },

        clone: function(){

            var tempPsLib = new window[Ps](this.canvas.width,this.canvas.height);
            tempPsLib.add(this);
            return tempPsLib;
        },

        swap: function(a,b){//交换a,b图层的顺序,ab代表当前序号
            var temp = this.layers[a];
            this.layers[a] = this.layers[b];
            this.layers[b] = temp;

            return this;
        },

        deleteLayers: function(arr){//删除几个图层序号
            this.layers = this.layers.del(arr);
        },

        save: function(isFast){//返回一个合成后的图像 png base64
            //创建一个临时的psLib对象，防止因为合并显示对本身imgData影响
            var tempPsLib = new window[Ps](this.canvas.width,this.canvas.height);
            tempPsLib.add(this,"正常",0,0,isFast);
            this.tempPsLib = tempPsLib;

            //将挂接到本对象上的图层对象 一起合并到临时的psLib对象上去 用于显示合并的结果，不会影响每个图层，包括本图层
            for(var i = 0;i < this.layers.length;i ++){
                var tA = this.layers[i];
                var layers = tA[0].layers;
                var currLayer = tA[0];
                if(layers[layers.length - 1] && layers[layers.length - 1][0].type == 1) currLayer = layers[layers.length - 1][0];
                tempPsLib.add(currLayer,tA[1],tA[2],tA[3],isFast);
            }

            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.context.putImageData(tempPsLib.imgData,0,0);//以临时对象data显示

            return this.canvas.toDataURL(); 
        },

        drawRect: function(selector){//绘制直方图
            var canvas;
            if(canvas = document.getElementById("imgRect")){
            }else{
                canvas = document.createElement("canvas");
                canvas.id = "imgRect";
                document.body.appendChild(canvas);
                canvas.width = parseInt(this.canvas.width);
                canvas.height = parseInt(this.canvas.height);
            }
            var context = canvas.getContext("2d");
            context.clearRect(0,0,canvas.width,canvas.height);

            var result = [];
            var data = this.tempPsLib.imgData.data;
            for(var i = 0,n = data.length;i < n;i ++){
               if(!result[data[i]]){
                    result[data[i]] = 1;
               }else{
                    result[data[i]] ++;
               }
            }

            context.beginPath();
            context.moveTo(0,canvas.height);
            var max = 0;
            for(var i = 0;i < 255;i ++){
                if(result[i] > max) max = result[i];
            }

            for(var i = 0;i < 255;i ++){
                var currY = result[i] || 0;
                currY = canvas.height - currY / max * 0.8 * canvas.height;
                context.lineTo(i / 256 * canvas.width ,currY ,1,1); 
            }
            context.lineTo(canvas.width + 10,height);
            context.fill();
        },

        easy: function(effect){
            var fun = P.reflectEasy(effect);
            var _this = this;
            _this = fun.call(_this);
            return _this;
        }

    };

})("psLib");
