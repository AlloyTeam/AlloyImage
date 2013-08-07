/**
 * @author dorsywang(Bin Wang)
 * @description alloyphoto嵌入版
 */
;(function(Pname){
    //css
    var cssStyle = "\
        .apItem{\
            float: left;\
            list-style: none;\
            padding: 5px;\
            cursor: pointer;\
        }\
    ";
    //配置信息
    var Config = {
        css: cssStyle
    };

    var P = function(){
        if(this instanceof P){
            //做一些初始化操作
            this.wrapperEl = document.createElement("div");

            //待处理的img元素
            this.imgEl = null;

            //处理的图层
            this.layer = null;

            this.renderHTML();
            this.applyStyle(Config.css);
            this.bindEvent();

        }else{
            return new P();
        }
    };

    P.prototype = {
        //追加到元素后面
        appendTo: function(selector){
            var el = typeof selector == "string" ? document.querySelector(selector) : selector;
            el.appendChild(this.wrapperEl);

            return this;
        },

        //渲染html代码
        renderHTML: function(){
            var comEffects = $AI.getConfig().ComEffect;
            var html = "";

            for(var i in comEffects){
                html += "<li class='apItem'>" + i + "</li>";
            }

            this.wrapperEl.innerHTML = html;
        },

        bindEvent: function(){
            var _this = this;
            this.wrapperEl.onclick = function(e){
                var targetEl = e.target;

                if(targetEl.className == "apItem"){
                    var effect = targetEl.innerHTML;

                    _this.layer.clone().ps(effect).replace(_this.imgEl);
                }

            };
        },

        applyStyle: function(mainCss){
            var head = document.getElementsByTagName("head");

            var styleEl = document.createElement("style");
            try{
                styleEl.innerHTML = mainCss;

                head[0].appendChild(styleEl);

            //for badly ie 8-
            }catch(e){
                var div = document.createElement("div");
                div.innerHTML = "&nbsp;<style type='text/css'>" + mainCss + "</style>";

                head[0].appendChild(div);
                head[0].replaceChild(div.getElementsByTagName("style")[0], div);
            }
        },

        watch: function(img){
            var el = typeof img == "string" ? document.querySelector(img) : img;
            this.imgEl = el;

            this.layer = $AI(el);
        },

        //增加处理中提示
        addProcessing: function(){
        }
    };

    //public API
    var ap = function(selector){
        var temp = new P();
        if(selector) temp.appendTo(selector);

        return {
            appendTo: function(selector){
                temp.appendTo(selector);
            },

            watch: function(selector){
                temp.watch(selector);
            }
        };
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
