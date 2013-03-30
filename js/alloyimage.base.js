/**
 * @author:Bin Wang
 * @description: Main
 *
 */

//删除几个元素   arr为数组下标 
Array.prototype.del = function(arr){

    //对数组重新排序
    arr.sort();

    //复制数组，防止污染
    var b = this.concat([]);
    for(var i = arr.length - 1; i >= 0; i --){
        b = b.slice(0, arr[i]).concat(b.slice(arr[i] + 1));
    }

    return b;
};

//worker适配
try{

    //给图像对象添加初次加载才触发事件，后续不触发
    HTMLImageElement.prototype.loadOnce = function(func){
       var i = 0;
       this.onload = function(){
            if(!i) func.call(this, null);
            i ++;
       };
    };
}catch(e){
    window = {};
}

;(function(Ps){

    //被所有对象引用的一个对象,静态对象,主处理模块
    var P = {

        //模块池
        lib: [],

        //初始化准备
        init: function(){
            this.require("config");
        },

        //模块注册方法
        module: function(name, func){
            this.lib[name] = func.call(null, this);
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
            var moduleName = this.lib.config.getModuleName(method);

            //交由实际处理数据单元处理
            return this.lib[moduleName].process(imgData, args);
        },

        //组合效果映射器
        reflectEasy: function(effect){
            var fun = this.lib.config.getEasyFun(effect);
            return this.lib.easy.getFun(fun);
        },

        //合并一个图层到对象
        add: function(lowerData, upperData, method, alpha, dx, dy, isFast, channel){
            return this.lib.addLayer.add(lowerData, upperData, method, alpha, dx, dy, isFast, channel);
        },

        //用worker进行异步处理
        worker: function(func, callback){
            
        },

        //对图像进行掩模算子变换
        applyMatrix: function(imgData, matrixArr){
        }
    };

    //返回外部接口
    window[Ps] = function(img, width, height){

        if(this instanceof window[Ps]){
            //记录时间 time trace
            this.startTime = + new Date();

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            
            //var l = psLib(20,30);构造适配
            if(!isNaN(img)){

                canvas.width = img;
                canvas.height = width;
                height = height || "#fff";
                context.fillStyle = height;
                context.fillRect(0, 0, img, width);

            }else{
                canvas.width = parseInt(img.width);
                canvas.height = parseInt(img.height);

                var computedStyle = getComputedStyle(img);
                imgWidth = parseInt(computedStyle.getPropertyValue("width"));
                imgHeight = parseInt(computedStyle.getPropertyValue("height"));

                if(!isNaN(imgWidth)) context.drawImage(img, 0, 0, imgWidth, imgHeight);
                else context.drawImage(img, 0, 0);

            }

            //将引用的canvas对象挂接到对象上
            this.canvas = canvas;
            this.context = context;
            this.imgData = context.getImageData(0, 0, canvas.width, canvas.height);

            //赋予对象唯一ID
            this.name = Ps + "_" + Math.random();
            this.canvas.id = this.name;

            //记录挂接到图层上的对象的引用
            this.layers = [];

            //原生canvas支持时的临时canvas
            var ctxCanvas = document.createElement("canvas");
            ctxCanvas.width = canvas.width;
            ctxCanvas.height = canvas.height;

            this.ctxCanvas = ctxCanvas;
            this.ctxContext = canvas.getContext("2d");

            //默认使用worker进行处理
            this.useWorker = P.useWorker;

            //初始化readyState为ready,readyState表明处理就绪
            this.readyState = 1;

            if(this.useWorker){
                //如果使用worker,则初始化一个dorsyWorker封装实例出来
                this.dorsyWorker = P.lib.dorsyWorker(this);
            }
            
        }else{

            //返回自身构造对象
            return new window[Ps](img, width, height);
        }
    };

    //模块注册方法
    window[Ps].module = function(name, func){
        P.module(name, func);
    };

    //返回一个外部独立的数学处理模式出去
    window[Ps].dorsyMath = function(){
        return P.lib.dorsyMath;
    };

    window[Ps].setName = function(name){
        P.name = name || "alloyimage.js";
    };

    //定义使用worker,需要给出alloyimage所在路径
    window[Ps].useWorker = function(path){
        
        //如果不能使用worker，直接降级为单线程
        if(! window.Worker){
            this.useWorker = 0;

            console.log("AI_WARNING: 浏览器不支持web worker, 自动切换为单线程\nAI_WARNING: the brower doesn't support Web Worker");
            return;
        }

        var path = path || "";

        //如果以目录给出，默认为默认文件名
        if(/[\/\\]$/.test(path)){
            path = path + P.name;
        }else{
        }

        if(path == "") path = "alloyimage.js";

        P.useWorker = 1;
        P.path = path;

        //检测文件是否存在
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){

            if(xhr.readyState == 4){

                if(xhr.status == "404"){
                    P.destroySelf("AI_ERROR：使用worker时，ai文件路径指定错误\nAI_ERROR: error occured while using web worker since indicate the wrong path of file ai");
                }
            }
        };
        xhr.open("GET", path, false);
        xhr.send();
    };

    //worker监听
    onmessage = function(e){
        var data = e.data, imgData;
        if(data[0] == "act"){
            imgData = P.reflect(data[1], data[2], data[3]);
        }else if(data[0] == "add"){
            imgData = P.add.apply(P, data[1]);
        }
        postMessage(imgData);
    };

    //原型对象
    window[Ps].prototype = {

        //动作
        act: function(method, arg){
            //console.log("actStart");
            var args = [];

            //提取参数为数组
            args = Array.prototype.slice.call(arguments, 1);

            if(this.useWorker){
                this.dorsyWorker.queue.push(["act", method, args]);

                checkStartWorker.call(this);
                
            }else{
                //做一次转发映射
                P.reflect(method, this.imgData, args);
            }
            
            return this;
        },

        //预览模式 ，所有的再操作全部基于原点，不会改变本图层的效果，直到act会去除这部分图层
        view: function(method, arg1, arg2, arg3, arg4){

            //克隆本图层对象
            var newLayer = this.clone();

            //标记本图层的种类为预览的已合并的图层
            newLayer.type = 1;

            //挂接克隆图层副本到对象
            this.addLayer(newLayer, "正常", 0, 0);
            newLayer.act(method, arg1, arg2, arg3, arg4);

            return this;
        },

        //将view的结果执行到图层
        excute: function(){
            var layers = this.layers;
            var n = layers.length;
            if(layers[n - 1] && layers[n - 1][0].type == 1){
                this.imgData = layers[n - 1][0].imgData;
                delete layers[n - 1];
            }
        },

        //取消view的结果执行
        cancel: function(){
            var layers = this.layers;
            var n = layers.length;
            if(layers[n - 1] && layers[n - 1][0].type == 1){
                delete layers[n - 1];
            }
        },

        //显示对象 isFast用于快速显示
        show: function(selector, isFast, flag){
            
            if(flag){
            }else{
                if(this.useWorker){
                    this.dorsyWorker.queue.push(["show", selector, isFast]);
                    return this;
                }
            }

            //如果其上无其他挂载图层，加快处理
            if(this.layers.length == 0){
                this.tempPsLib = {
                    imgData: this.imgData
                };
            }else{

                //创建一个临时的psLib对象，防止因为合并显示对本身imgData影响
                var tempPsLib = new window[Ps](this.canvas.width, this.canvas.height);
                tempPsLib.add(this, "正常", 0, 0, isFast);
                this.tempPsLib = tempPsLib;

                //将挂接到本对象上的图层对象 一起合并到临时的psLib对象上去 用于显示合并的结果，不会影响每个图层，包括本图层
                for(var i = 0; i < this.layers.length; i ++){
                    var tA = this.layers[i];
                    var layers = tA[0].layers;
                    var currLayer = tA[0];

                    if(layers[layers.length - 1] && layers[layers.length - 1][0].type == 1) currLayer = layers[layers.length - 1][0];
                    tempPsLib.add(currLayer, tA[1], tA[2], tA[3], isFast);
                }

                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            }

            //以临时对象data显示
            this.context.putImageData(this.tempPsLib.imgData, 0, 0);

            if(selector){
                document.querySelector(selector).appendChild(this.canvas);
            }else{
                document.body.appendChild(this.canvas);
            }

            return this;
        },

        //替换原来的图片
        replace: function(img, workerFlag){
            if(workerFlag){
            }else{
                if(this.useWorker){
                    this.dorsyWorker.queue.push(['replace', img]);
                    checkStartWorker.call(this);

                    return this;
                }
            }

            if(img){
                img.onload = function(){};
                img.src = this.save(0, workerFlag);
            }

            return this;
        },

        //合并一个AlloyImage图层上去
        add: function(){
            
            var numberArr = [], psLibObj, method, alpha, dx, dy, isFast, channel;

            //做重载
            for(var i = 0; i < arguments.length; i ++){
                if(!i) continue;

                switch(typeof(arguments[i])){
                    case "string":
                        if(/\d+%/.test(arguments[i])){//alpha
                            alpha = arguments[i].replace("%", "");
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

            //赋值
            dx = numberArr[0] || 0;
            dy = numberArr[1] || 0;
            method = method || "正常";
            alpha = alpha / 100 || 1;
            isFast = isFast || false;
            channel = channel || "RGB";

            psLibObj = arguments[0];

            //console.log("add init");

            if(this.useWorker){
                this.dorsyWorker.queue.push(['add', psLibObj, method, alpha, dx, dy, isFast, channel]);

                checkStartWorker.call(this);

            }else{
                //做映射转发
                this.imgData = P.add(this.imgData, psLibObj.imgData, method, alpha, dx, dy, isFast, channel);
            }

            return this;
        },

        //挂载一个图层上去，不会影响本身，只是显示有变化
        addLayer: function(psLibObj, method, dx, dy){
            this.layers.push([psLibObj, method, dx, dy]);

            return this;
        },

        clone: function(workerFlag){

            /*
            if(workerFlag){
            }else{

                if(this.useWorker){
                    this.dorsyWorker.queue.push(['clone']);
                    return this;
                }
            }
            */

            var tempPsLib = new window[Ps](this.canvas.width, this.canvas.height);
            tempPsLib.context.putImageData(this.imgData, 0, 0);
            tempPsLib.imgData = tempPsLib.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            /*
            tempPsLib.add(this);
            */

            return tempPsLib;
        },

        //交换a,b图层的顺序,ab代表当前序号
        swap: function(a, b){
            var temp = this.layers[a];
            this.layers[a] = this.layers[b];
            this.layers[b] = temp;

            return this;
        },

        //删除几个图层序号
        deleteLayers: function(arr){
            this.layers = this.layers.del(arr);
        },

        //返回一个合成后的图像 png base64
        save: function(isFast, workerFlag){
            if(workerFlag){
            }else{
                if(this.useWorker){
                    this.dorsyWorker.queue.push(['save']);
                    checkStartWorker.call(this);

                    return this;
                }
            }

            if(! this.layers.length){
                this.context.putImageData(this.imgData, 0, 0);
                return this.canvas.toDataURL(); 
            }


            //创建一个临时的psLib对象，防止因为合并显示对本身imgData影响
            var tempPsLib = new window[Ps](this.canvas.width, this.canvas.height);
            tempPsLib.add(this, "正常", 0, 0, isFast);
            this.tempPsLib = tempPsLib;

            //将挂接到本对象上的图层对象 一起合并到临时的psLib对象上去 用于显示合并的结果，不会影响每个图层，包括本图层
            for(var i = 0; i < this.layers.length; i ++){
                var tA = this.layers[i];
                var layers = tA[0].layers;
                var currLayer = tA[0];

                if(layers[layers.length - 1] && layers[layers.length - 1][0].type == 1) currLayer = layers[layers.length - 1][0];

                tempPsLib.add(currLayer, tA[1], tA[2], tA[3], isFast);
            }

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //以临时对象data显示
            this.context.putImageData(tempPsLib.imgData, 0, 0);

            return this.canvas.toDataURL(); 
        },

        //绘制直方图
        drawRect: function(selector){
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
            context.clearRect(0, 0, canvas.width, canvas.height);

            var result = [];
            var data = this.tempPsLib.imgData.data;

            for(var i = 0, n = data.length; i < n; i ++){
               if(!result[data[i]]){
                    result[data[i]] = 1;
               }else{
                    result[data[i]] ++;
               }
            }

            context.beginPath();
            context.moveTo(0, canvas.height);

            var max = 0;

            for(var i = 0; i < 255; i ++){
                if(result[i] > max) max = result[i];
            }

            for(var i = 0; i < 255; i ++){
                var currY = result[i] || 0;
                currY = canvas.height - currY / max * 0.8 * canvas.height;
                context.lineTo(i / 256 * canvas.width, currY, 1, 1); 
            }
            
            context.lineTo(canvas.width + 10, canvas.height);
            context.fill();
        },

        //组合效果
        ps: function(effect){
            var fun = P.reflectEasy(effect);
            var _this = this;

            _this = fun.call(_this);

            this.logTime("组合效果" + effect);

            return _this;
        },

        //记录运行时间
        logTime: function(msg){
            console.log(msg + ": " + (+ new Date() - this.startTime) / 1000 + "s");
        },

        //调用原生canvas.context接口
        ctx: function(func){
            //func中的this指向context
            var ctx = this.ctxContext;

            ctx.putImageData(this.imgData, 0, 0);

            //调用func
            func.call(ctx);
            this.imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            return this;
        },

        notify: function(msg){
            //通知
            if(msg == "readyStateOK") this.readyState = 1;
        },

        //所有动作异步执行完了的回调
        complete: function(func){
            if(this.useWorker){
                //console.log("complete init");
                this.dorsyWorker.queue.push(['complete', func]);
            }else{
                func();
            }
        }
    };

    //以下为AI所有的私有的方法,不需要公开 private methods

    //检查是否要开始worker
    function checkStartWorker(){

        //如果readyState为就绪状态 表明act为阶段首次动作,进入worker
        if(this.readyState){
            this.readyState = 0;
            this.dorsyWorker.startWorker();
        }
    }

})("psLib");

window.AlloyImage = $AI = window.psLib;
