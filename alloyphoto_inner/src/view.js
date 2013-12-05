 /**
 * @author DorsyWang(Bin Wang)
 * @email honghu91@hotmail.com
 * @description view JS
 */
;(function(PName){
    window[PName].module("view", function(P){
        var createEl = P.utils.createElement;

        return {
            el: {},

            init: function(){
                this.renderToolBar();
            },

            //初始化时渲染一个toolbar
            renderToolBar: function(){
                
                this.el.apWrapper = createEl("div", {className: "apWrapper"}, document.body);

                //alloyphoto Logo元素
                this.el.apLogo = createEl("div", {className: "apLogo"}, this.el.apWrapper);
                this.el.apLogo.innerHTML = "AlloyPhoto";

                //一级导航
                this.el.apNav = createEl("ul", {className: "apNav"}, this.el.apWrapper);

                //操作框
                this.el.apOperBox = createEl("div", {className: "apOperBox"}, this.el.apWrapper);
                this.el.apOperBoxContent = createEl("div", {className: "apOperBoxContent"}, this.el.apOperBox);
                this.el.apOperBoxScrollBarContent = createEl("div", {className: "apOperBoxScrollBarContent"}, this.el.apOperBoxContent);
                this.el.apOperBoxConfirm = createEl("div", {className: "apOperBoxConfirm"}, this.el.apOperBoxContent);

                //取消 OK
                this.el.apOperBoxCancel = createEl("div", {className: "apOperBoxCancel"}, this.el.apOperBoxConfirm);
                this.el.apOperBoxOK = createEl("div", {className: "apOperBoxOK"}, this.el.apOperBoxConfirm);

                this.el.apOperBoxCancel.innerHTML = "Cancel";
                this.el.apOperBoxOK.innerHTML = "OK";

                //navList
                var navList = [
                    {
                        id: "apEffect",
                        name: "效果",
                        children: []
                    },

                    {
                        id: "apAlteration",
                        name: "调整",
                        children: [
                            {
                                id: "setHSI",
                                name: "色调"
                            },{
                                id: "brightness",
                                name: "亮度"
                            }
                        ]
                    },

                    { 
                        id: "apUpload",
                        name: "上传",
                        children: []
                    },


                    /*
                    {
                        id: "apClip",
                        name: "变换",
                        children: [
                            { id: "rotate90", name: "逆旋90" },
                            { id: "rotate-90", name: "正旋90" },
                            { id: "apClip", name: "裁剪"}
                        ]
                    },

                    {
                        id: "apBorder",
                        name: "相框",
                        children: [{id: "select", name: "选择相框"}, {id: "red", name: "红色相框"}]
                    },
                    */

                    {
                        id: "apDownload",
                        name: "下载",
                        children: []
                    },

                    {
                        id: "apAbout",
                        name: "关于",
                        children: []
                    }
                 ];

                if($AI.getConfig){
                    var ComEffect = $AI.getConfig().ComEffect;
                }else{
                    var ComEffect = { 
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
                }

                var temp = [];
                for(var i in ComEffect){
                    temp.push({
                        id: ComEffect[i],
                        name: i
                    });
                }

                navList[0].children = temp;

                for(var i = 0; i < navList.length; i ++){
                    var item = navList[i];

                    //创建一级菜单
                    this.el[item.id] = createEl("li", {id: item.id}, this.el.apNav);
                    this.el[item.id].innerHTML = item.name;

                    //创建二级菜单
                    var subNavEl = createEl("ul", {}, this.el[item.id]);
                    this.el[item.id].onmouseover = function(){
                        var height = item.children.length * 25;
                        var subEl = subNavEl;
                        return function(){
                            subEl.style.height =  height + "px";
                        };
                    }();

                    this.el[item.id].onmouseout = function(){
                        var subEl = subNavEl;
                        return function(){
                            subEl.style.height =  0;
                        };
                    }();

                    for(var j = 0; j < item.children.length; j ++){
                        var child = item.children[j];

                        var childEl = createEl("li", {}, subNavEl);

                        var attrObj = {
                            id: child.id,
                            parentid: item.id
                        };

                        var innerDiv = createEl("div", attrObj, childEl);
                        innerDiv.innerHTML = child.name;
                    }

                }

                this.renderLoading();
            },

            renderLoading: function(){
                this.el.apLoading = createEl("div", {id: "apLoading"}, document.body);
                this.el.apLoading.innerHTML = "处理中";
            },

            //计算wrapper应该出现的位置
            setToolBarPosition: function(position){
                this.el.apWrapper.style.left = position.x + 15 + "px";
                this.el.apWrapper.style.top = position.y + 15 + "px";
            },

            setLoadingPosition: function(position, w, h){
                var width = parseInt(P.utils.css(this.el.apLoading, "width"));
                var height = parseInt(P.utils.css(this.el.apLoading, "height"));

                var left = parseInt((w - width) / 2);
                var top = parseInt((h - height) / 2);

                this.el.apLoading.style.left = position.x + left + "px";
                this.el.apLoading.style.top = position.y + top + "px";
            },

            hideLoading: function(){
                this.el.apLoading.style.display = "none";
            },

            showLoading: function(){
                this.el.apLoading.style.display = "block";
            },

            //检查状态
            checkStatus: function(){
                if(P.status.visible){
                    this.show();
                }else{
                    this.hide();
                }
            },

            //返回一下滑动bar的方法
            //originPoint 原始的位置 0.5
            //changeCallback 拖动结束的回调
            getScrollBar: function(width, originPoint, name, id, changeCallback){
                var width = width || 200;
                var originPoint = originPoint || 0.5;
                var name = name || "";

                var barEl = document.createElement("div");
                barEl.className = "apScrollBarWrapper";

                var apBarTitle = createEl("div", {className: "apBarTitle"}, barEl);

                var apBarContent = createEl("div", {className: "apBarContent"}, barEl);
                var apBarLineLeft = createEl("div", {className: "apBarLineLeft"}, apBarContent);
                var apBarScrollEl = createEl("div", {className: "apBarScrollEl", id: id}, apBarContent);
                var apBarLineRight = createEl("div", {className: "apBarLineRight"}, apBarContent);

                var scrollElWidth = 30;

                apBarTitle.innerHTML = name;

                //设置位置
                apBarLineLeft.style.width = originPoint * width + "px";
                apBarLineRight.style.width = (1 - originPoint) * width + "px";
                apBarScrollEl.style.left = originPoint * width - scrollElWidth / 2 + "px";

                //P.event.bindScrollBarEvent(name, apBarLineLeft, apBarScrollEl, apBarLineRight, width, scrollElWidth, changeCallback);
                
                return {
                    barEl: barEl
                };
            },

            //渲染色调的操作内容
            renderSetSHIScrollContent: function(callback){
                var content = document.createElement("div");
                var SBar = this.getScrollBar(160, 0.5, "色　相", "apH", callback);
                var HBar = this.getScrollBar(160, 0.5, "饱和度", "apS", callback);
                var IBar = this.getScrollBar(160, 0.5, "明　度", "apI", callback);

                //设置toolbarvalue的初始状态
                P.status.toolBarValue.setHSI = [0.5, 0.5, 0.5];

                content.appendChild(SBar.barEl);
                content.appendChild(HBar.barEl);
                content.appendChild(IBar.barEl);

                this.el.apOperBoxScrollBarContent.innerHTML = "";
                this.el.apOperBoxScrollBarContent.appendChild(content);
            },

            renderSetBrightnessContent: function(callback){
                var content = document.createElement("div");
                var BBar = this.getScrollBar(160, 0.5, "亮　度", "apB", callback);
                var DBar = this.getScrollBar(160, 0.5, "对比度", "apD", callback);

                P.status.toolBarValue.brightness = [0.5, 0.5];

                content.appendChild(BBar.barEl);
                content.appendChild(DBar.barEl);

                this.el.apOperBoxScrollBarContent.innerHTML = "";
                this.el.apOperBoxScrollBarContent.appendChild(content);
            },

            show: function(){
                P.utils.addClass(this.el.apWrapper, "apShow");
            },

            hide: function(){
                P.utils.removeClass(this.el.apWrapper, "apShow");
                //this.hideOperBox();
            },

            //显示二级菜单
            showSubNav: function(parentNode){
                var sub = parentNode.getElementsByTagName("ul");
                sub.length > 0 && (sub[0].style.display = "block");
            },

            hideSubNav: function(parentNode){
                var sub = parentNode.getElementsByTagName("ul");
                sub.length > 0 && (sub[0].style.display = "none");
            
            },

            showOperBox: function(innerEl){
                this.el.apOperBox.style.display = "block";
            },

            hideOperBox: function(){
                this.el.apOperBox.style.display = "none";
            },

            //渲染clip元素
            renderClipEl: function(){
                if(! this.el.apClipWrapper){
                    this.el.apClipWrapper = createEl("div", {className: "apClipWrapper"}, document.body);

                    this.el.apClipControlBottom = createEl("div", {className: "apClipControlBottom"}, this.el.apClipWrapper);
                    this.el.apClipControlRight = createEl("div", {className: "apClipControlRight"}, this.el.apClipWrapper);
                }

                //set 位置与大小
                var currImg = P.watchQueue[P.status.currImg];
                var position = P.utils.getElePosition(currImg);
                this.setClipElPosition(position);

                var width = currImg.width;
                var height = currImg.height;

                this.setClipElStyle({width: width + "px", height: height + "px"});
            },

            //设置clip元素的属性
            setClipElStyle: function(styleObj){

                for(var i in styleObj){
                    this.el.apClipWrapper.style[i] = styleObj[i];
                }
            },

            setClipElPosition: function(pos){
                this.setClipElStyle({left: pos.x + "px", top: pos.y + "px"});
            },

            showClipEl: function(){
                this.renderClipEl();
                this.setClipElStyle({display: "block"});
            },

            hideClipEl: function(){
                this.setClipElStyle({display: "none"});
            }
        };
    });
})("alloyphoto")
