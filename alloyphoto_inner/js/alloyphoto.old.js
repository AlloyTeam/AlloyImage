/**
 * @author dorsywang(Bin Wang)
 * @description alloyphoto嵌入版
 */
;(function(Pname){
    //css
    var cssStyle = "\
        .apWrapper{\
            width: 846px;\
            overflow: auto;\
            background: #ccc;\
            position: fixed;\
            top: 50%;\
            left: 50%;\
            margin: 0;\
            padding: 0;\
            margin-left: -423px;\
            margin-top: -300px;\
            font-family: Microsoft Yahei;\
            border-top-left-radius: 7px;\
            border-top-right-radius: 7px;\
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\
        }\
        #tbItemUl{\
            overflow: auto;\
            -webkit-box-shadow:0 -1px 14px #2d6a88;\
        }\
        .apItem{\
            float: left;\
            list-style: none;\
            padding: 10px;\
            cursor: pointer;\
            background: -webkit-gradient(linear,0 0,100% 100%,from(#fff),to(#F0F0F0));\
            border-left: #e1e1e1 solid 1px;\
            border-top: #e1e1e1 solid 1px;\
            color: #5388d5;\
            font-family: Microsoft Yahei;\
            margin: 0 auto;\
        }\
        #apImgWrapper{\
            float: left;\
            margin: 0 auto;\
        }\
        .apTitle{\
            text-align: center;\
            font-size: 18px;\
            font-weight: normal;\
            background: #50bff5;\
            margin: 0;\
            color: #fff;\
            line-height: 40px;\
            cursor: default;\
            -webkit-user-select: none;\
            position: relative;\
        }\
        .apBigCloseTool{\
            display: block;\
            position: absolute;\
            font-size: 28px;\
            top: 0;\
            right: 0;\
        }\
        .apBigCloseTool span{\
            display: inline-block;\
        }\
        .apMinimize{\
            background: -webkit-linear-gradient(top, #4C8FFD, #4787ED);\
            padding: 0 5px;\
            height: 20px;\
            overflow: hidden;\
        }\
        .apMinimize label{\
            margin-top: -8px;\
            display: block;\
        }\
        .apItem:hover{\
            background: #fff;\
        }\
        .apItem:first-child{\
            margin-left: 0;\
        }\
        #apUlWrapperEl{\
            border-right: #e1e1e1 solid 1px;\
            border-bottom: #e1e1e1 solid 1px;\
            float: left;\
            padding: 0;\
        }\
    ";
    //配置信息
    var Config = {
        css: cssStyle,
        aiPath: "alloyimage.js",
        useWorker: 0
    };

    var HTMLModel = "\
        <div class='apWrapper'>\
            <ul class='tbItemUl'>\
            </ul>\
            <div class='imgWrapper'>\
            </div>\
        </div>\
    ";

    var P = function(){
        if(this instanceof P){
            //做一些初始化操作
            this.apWrapper = this.createElement("div", {className: "apWrapper"}, document.body);

            //title
            this.apTitle = this.createElement("h2", {className: "apTitle"}, this.apWrapper);

            this.apTitle.innerHTML = "AlloyPhoto嵌入版";

            //最小化关闭按钮等工具区
            this.apBigCloseTool = this.createElement("span", {className: "apBigCloseTool"}, this.apTitle);
            this.apMinimize = this.createElement("span", {className: "apMinimize"}, this.apBigCloseTool);
            this.apClose = this.createElement("span", {className: "apClose"}, this.apBigCloseTool);

            this.apMinimize.innerHTML = "<label>-</label>";
            this.apClose.innerHTML = "<label>×</label>";

            //toolbar wrapperUL
            this.tbWrapperEl = this.createElement("div", {id: "tbItemUl"}, this.apWrapper);
            this.apUlWrapperEl = this.createElement("ul", {id: "apUlWrapperEl"}, this.tbWrapperEl);
            this.imgWrapper = this.createElement("div", {id: "apImgWrapper"}, this.apWrapper);

            //待处理的img元素
            this.imgEl = null;

            //处理的图层
            this.layer = document.createElement("canvas");

            this.applyStyle(Config.css);
            
            var _this = this;
            if(window.$AI){
                if(Config.useWork){
                    $AI.useWorker(Config.aiPath);
                }

                _this.renderHTML();
                _this.bindEvent();
            }else{
                this.requireJs(Config.aiPath, function(){
                    if(Config.useWorker){
                        $AI.useWorker(Config.aiPath);
                    }

                    _this.renderHTML();
                    _this.bindEvent();
                
                });
            }

        }else{
            return new P();
        }
    };

    P.prototype = {
        requireJs: function(jsPath, callback){
            var scriptLoader = document.createElement("script");

            scriptLoader.src = jsPath;
            scriptLoader.onload = function(){
                callback && callback();
            };

            scriptLoader.onerror = function(){
                console.log("alloyImage文件加载失败");
            };

            document.body.appendChild(scriptLoader);
        },

        //渲染html代码
        renderHTML: function(){
            var comEffects = $AI.getConfig().ComEffect;
            var html = "";

            for(var i in comEffects){
                html += "<li class='apItem'>" + i + "</li>";
            }

            this.apUlWrapperEl.innerHTML = html;
        },

        bindEvent: function(){
            var _this = this, clickFlag = 0;

            var originX = 0, originY = 0, originLeft = 0; originTop = 0;

            var marginLeft = parseInt(getComputedStyle(this.apWrapper).getPropertyValue("margin-left"));
            var marginTop = parseInt(getComputedStyle(this.apWrapper).getPropertyValue("margin-top"));

            this.apWrapper.onclick = function(e){
                var targetEl = e.target;

                if(targetEl.className == "apItem"){
                    var effect = targetEl.innerHTML;

                    $AI(_this.layer).ps(effect).replace(_this.imgEl);
                }
            };

            this.apWrapper.onmousedown = function(e){
                var targetEl = e.target;

                if(targetEl.className == "apTitle"){
                    clickFlag = 1;

                    originX = e.pageX;
                    originY = e.pageY;

                    originLeft = _this.apWrapper.offsetLeft;
                    originTop = _this.apWrapper.offsetTop;
                }

                e.preventDefault();
            };

            this.apWrapper.onmouseup = function(e){
                clickFlag = 0;
            };

            document.body.onmousemove = function(e){
                var targetEl = e.target;

                if(1 || targetEl.className == "apTitle"){
                    if(clickFlag){
                        var x = e.pageX;
                        var y = e.pageY;

                        var dx = x - originX;
                        var dy = y - originY;

                        var left = originLeft + dx - marginLeft;
                        var top = originTop + dy - marginTop;

                        console.log(left, top);

                        _this.apWrapper.style.left = left + "px";
                        _this.apWrapper.style.top = top + "px";
                    }
                }

                e.preventDefault();
            };
        },

        createElement: function(elType, elAtrr, parentNode){
            var el = document.createElement(elType);

            for(var i in elAtrr){
                el[i] = elAtrr[i];
            }

            parentNode && parentNode.appendChild(el);

            return el;
        },

        applyStyle: function(mainCss){
            var head = document.getElementsByTagName("head");

            var styleEl = document.createElement("style");
            styleEl.innerHTML = mainCss;

            head[0].appendChild(styleEl);
        },

        //处理图片
        ps: function(img){
            var el = typeof img == "string" ? document.querySelector(img) : img;

            if(typeof el == ""){
            }

            this.originImgEl = el;
            
            var cloneNode = el.cloneNode();

            this.imgEl = cloneNode;

            this.imgWrapper.innerHTML = "";
            this.imgWrapper.appendChild(cloneNode);

            //ai还没有加载完成
            if(! window.$AI){
            }
            this.layer.width = el.width;
            this.layer.height = el.height;

            this.layer.getContext("2d").drawImage(el, 0, 0);
        },

        //增加处理中提示
        addProcessing: function(){
        }
    };

    //public API
    var ap = function(){
        var temp = new P();

        return {
            ps: function(selector){
                temp.ps(selector);
            }
        };
    };

    ap.setPath = function(path){
        Config.aiPath = path;
    };

    if(window[Pname]){
    }else{
        window[Pname] = ap;
    }

    window[Pname].noConflict = function(){
        return ap;
    };

    window["$AP"] = window[Pname];

})("alloyphoto");
