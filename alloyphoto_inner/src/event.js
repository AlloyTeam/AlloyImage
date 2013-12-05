 /**
 * @author DorsyWang(Bin Wang)
 * @email honghu91@hotmail.com
 * @description event JS
 */
;(function(PName){
    window[PName].module("event", function(P){
        //全局变量
        var mouseDownFlag = 0;

        return {
            init: function(){
                this.bindGlobalEvent();
                this.bindWatchQueue();
                this.bindClickEvent();
                this.bindScrollBarEvent();
            },

            //绑定全局事件
            bindGlobalEvent: function(){
                document.body.addEventListener("mouseup", function(e){
                }, false);
            },

            bindWatchQueue: function(){
                var queue = P.watchQueue;
                for(var i in queue){
                    this.bindEle(queue[i]);
                }

                P.view.el.apWrapper.addEventListener("mouseover", function(){
                    P.status.onEl = this;

                    P.status.visible = 1;
                    P.view.checkStatus();

                }, false);

                P.view.el.apWrapper.addEventListener("mouseout", function(){
                    P.status.onEl = null;

                    P.status.visible = 0;
                    P.view.checkStatus();

                }, false);
            },

            //绑定监听元素的方法
            bindEle: function(el){
                el.addEventListener("mouseover", this.mouseoverFunc, false);
                el.addEventListener("mouseout", this.mouseoutFunc, false);
            },

            //解绑事件
            unbindEle: function(el){
                el.removeEventListener("mouseover", this.mouseoverFunc, false);
            },

            //绑定点击事件的处理
            bindClickEvent: function(){
                document.body.addEventListener("click", function(e){
                    var target = e.target;
                    var currImg = P.status.currImg;

                    //点击的effect Items
                    switch(target.parentid){
                        case "apEffect":
                            P.view.showLoading();

                            setTimeout(function(){

                                var effect = target.id;
                                //检查是否存在原来图像的副本

                                if(currImg){
                                    if(P.old[currImg]){
                                    }else{
                                        P.old[currImg] = $AI(P.watchQueue[currImg]);
                                    }

                                    //做效果处理
                                    P.old[currImg].clone().ps(effect).replace(P.watchQueue[currImg]);

                                    P.view.hideLoading();
                                }
                            }, 10);

                        break;
                    }

                    switch(target.className){
                        case "apLogo":
                            window.open(P.config.alloyPhotoLink, "_blank");
                        break;

                        //点击ok时候的操作
                        case "apOperBoxOK": 
                            P.status.originImg.cancel();
                            P.view.hideOperBox();
                        break;

                        case "apOperBoxCancel":
                            P.status.originImg.cancel().replace(P.watchQueue[currImg]);
                            P.view.hideOperBox();
                        break;
                    }

                    //点击id菜单 效果
                    switch(target.id){
                        case "apDownload":
                            var currImg = P.status.currImg;
                            $AI(P.watchQueue[currImg]).saveFile();
                        break;

                        //调节色相
                        case "setHSI":
                            P.status.currOperation = "setHSI";
                            //保存一副原始图像
                            P.status.originImg = $AI(P.watchQueue[P.status.currImg]);
                            //P.status.originImg.show();

                            P.view.renderSetSHIScrollContent();

                            P.view.showOperBox();
                        break;

                        case "brightness":
                            P.status.currOperation = "brightness";
                            P.status.originImg = $AI(P.watchQueue[P.status.currImg]);
                            P.view.renderSetBrightnessContent();
                            P.view.showOperBox();
                        break;

                        case "rotate90":
                            var img = P.watchQueue[P.status.currImg];
                            $AI(img).rotate(40).replace(img);
                        break;

                        case "apClip":
                            P.view.showClipEl();
                        break;

                        case "apAbout":
                            window.open(P.config.alloyPhotoLink, "_blank");
                        break;

                        case "apUpload":
                            var func = P.completeFunc;
                            var img = P.watchQueue[P.status.currImg];
                            func($AI(img).save());
                        break;

                    }
                }, false);
            },

            mouseoverFunc: function(e){
                var _this = P.event;

                var position = P.utils.getElePosition(this);
                var width = this.width;
                var height = this.height;

                //设置toolbar的位置
                P.view.setToolBarPosition(position);
                P.view.setLoadingPosition(position, width, height);

                P.status.visible = 1;

                //设置状态对象
                P.status.currImg = this._apOnlyId;

                P.view.checkStatus();
            },

            mouseoutFunc: function(e){
                var _this = P.event;

                P.status.visible = 0;

                setTimeout(function(){
                    P.view.checkStatus();
                }, 500);
            },

            //绑定scrollBarEvent
            bindScrollBarEvent: function(width){
                var scrollMouseDown = 0;

                var originX = 0, originY = 0, originLeft = 0; originTop = 0;

                var width = width || 160;
                var scrollElWidth = scrollElWidth || 30;
                var currPoint = 0.5;

                var scrollEl, leftEl, rightEl;

                var originImg;

                document.body.addEventListener("mousedown", function(e){
                    var target = e.target;
                    if(target.className == "apBarScrollEl"){
                        scrollMouseDown = 1;

                        scrollEl = target;

                        leftEl = scrollEl.parentNode.childNodes[0];
                        rightEl = scrollEl.parentNode.childNodes[2];
                        
                        console.log(mouseDownFlag, scrollMouseDown);

                        originX = e.pageX;
                        originY = e.pageY;

                        originLeft = target.offsetLeft;
                        originTop = target.offsetTop;
                    }

                    e.preventDefault();
                }, false);

                document.body.addEventListener("mouseup", function(e){
                    if(scrollMouseDown){
                        var id = scrollEl.id;
                        var currImg = P.status.currImg;

                        //当前操作为色调的处理
                        if(P.status.currOperation == "setHSI"){
                            if(id == "apH"){
                                P.status.toolBarValue.setHSI[0] = currPoint;
                            }else if(id == "apS"){
                                P.status.toolBarValue.setHSI[1] = currPoint;
                            }else if(id == "apI"){
                                P.status.toolBarValue.setHSI[2] = currPoint;
                            }

                            scrollMouseDown = 0;

                            var toolBarValue = P.status.toolBarValue.setHSI;
                            var H = toolBarValue[0];
                            var S = toolBarValue[1];
                            var I = toolBarValue[2];

                            //换算成正常的值
                            H = (H - 0.5) * 360;
                            S = (S - 0.5) * 100;
                            I = (I - 0.5) * 100;

                            //originImg = $AI(P.watchQueue[currImg]);
                            P.status.originImg.view("setHSI", H, S, I).replace(P.watchQueue[currImg]);

                        //对brightness的处理
                        }else if(P.status.currOperation == "brightness"){
                            if(id == "apB"){
                                P.status.toolBarValue.brightness[0] = currPoint;
                            }else if(id == "apD"){
                                P.status.toolBarValue.brightness[1] = currPoint;
                            }

                            var toolBarValue = P.status.toolBarValue.brightness;

                            var B = toolBarValue[0];
                            var D = toolBarValue[1];

                            B = (B - 0.5) * 100;
                            D = (D - 0.5) * 100;

                            P.status.originImg.view("brightness", B, D).replace(P.watchQueue[currImg]);
                        }
                    }

                    scrollMouseDown = 0;
                }, false);


                document.body.addEventListener("mousemove", function(e){
                    var targetEl = e.target;
                    if(scrollMouseDown){
                        var x = e.pageX;
                        var y = e.pageY;

                        var dx = x - originX;
                        var dy = y - originY;

                        var left = originLeft + dx;
                        var top = originTop + dy;

                        currPoint = (left + scrollElWidth / 2) / width;
                        if(currPoint > 1 || currPoint < 0) return;

                        scrollEl.style.left = left + "px";
                        //scrollEl.style.top = top + "px";

                        //设置左右宽度
                        leftEl.style.width = width * currPoint + "px";
                        rightEl.style.width = width * (1 - currPoint) + "px";
                        
                        e.preventDefault();
                    }

                }, false);
            }
        };

    });
})("alloyphoto")
