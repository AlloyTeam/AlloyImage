/**
 * @author DorsyWang(Bin Wang)
 * @email honghu91@hotmail.com
 * @description Main JS
 */

;(function(APName){
    var winLoadFlag = 0;
    window.addEventListener("load", function(){
        winLoadFlag = 1;
    }, false);

    //private API
    var P = {
        config: {
            aiPath: null,
            aiDefaultPath: "http://alloyteam.github.io/AlloyPhoto/js/combined/alloyimage.js",
            alloyPhotoLink: "http://alloyteam.github.com/AlloyPhoto/",
            useWorker: 1
        },

        //状态对象
        status: {
            //当前操作的对象
            currImgId: null,
            visible: 0,

            toolBarValue: {
                setHSI: []
            },
            
            //记录一些原始图像
            originImg: null,

            //当前操作的名称
            currOperation: ""
        },

        //记录原始图片信息
        old: {
        },

        //需要监听的元素队列
        watchQueue: {},

        module: function(moduleName, func){
            this[moduleName] = func(this);
        },

        init: function(){
            var _this = this;
            this.utils.checkAIFile(function(){
                if(_this.config.useWorker){
                    //var path = _this.config.aiPath || _this.config.aiDefaultPath; 
                    //$AI.useWorker(path);
                }

                _this.css.init();
                _this.view.init();
                _this.event.init();
            });
        }
    };

    //public API
    var ap = {
        module: function(moduleName, func){
            P.module(moduleName, func);
        },

        setPath: function(path){
            P.config.aiPath = path;
        },

        watch: function(selector){
            var watchEls  = document.querySelectorAll(selector);
            for(var i = 0; i < watchEls.length; i ++){
                var _apOnlyId = "ap" + Math.random();
                watchEls[i]._apOnlyId = _apOnlyId;

                P.watchQueue[_apOnlyId] = watchEls[i];
            }


            if(winLoadFlag){
                P.init();
            }else{
                window.addEventListener("load", function(e){
                    P.init();
                }, false);
            }
        },

        complete: function(func){
            P.completeFunc = func;
        }
    };


    window.$AP = window[APName] = ap;
})("alloyphoto");
