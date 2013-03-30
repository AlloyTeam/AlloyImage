(function(){
    var Main = {
        img: null,
        addEvent: function(selector, eventType, func){
            var proName = "";

            switch(true){
                case /^\./.test(selector) :
                    proName = "className";
                    selector = selector.replace(".", "");
                    break;
                case /^\#/.test(selector) :
                    proName = "id";
                    selector = selector.replace("#", "");
                    break;
                default: 
                    proName = "tagName";
            }

            document.body.addEventListener(eventType,function(e){
                    function check(node){
                        if(! node.parentNode) return;

                        if(node[proName] == selector){
                            func.call(node, e);
                        };
                        check(node.parentNode);
                    }
                    check(e.target);
            }, false);
        },
        eventAtt: function(){
            var _this = this;

            /*
            this.addEvent(".pic","dragstart",function(e){
                var dx = e.offsetX ? e.offsetX : e.layerX;
                var dy = e.offsetY ? e.offsetY : e.layerY;
                e.dataTransfer.setData("dx", dx);
                e.dataTransfer.setData("dy", dy);
            });

            this.addEvent(".pic","drag",function(e){
                e.preventDefault();
            });
            this.addEvent(".picWrapper", "dragover", function(e){
                e.preventDefault();
            });
            this.addEvent(".picWrapper", "drop", function(e){
                var dx = e.dataTransfer.getData("dx");
                var dy = e.dataTransfer.getData("dy");
                var x = e.offsetX ? e.offsetX : e.layerX;
                var y = e.offsetY ? e.offsetY : e.layerY;

                var pic = document.getElementById("pic");
                
                pic.style.left = (x - dx) + "px";
                pic.style.top = (y - dy) + "px";

                
            });
            */

            var clickFlag = 0, dx, dy, left, top;
            this.addEvent(".pic", "mousedown", function(e){
            /*
                dx = e.offsetX ? e.offsetX : e.layerX;
                dy = e.offsetY ? e.offsetY : e.layerY;
                */

                dx = e.clientX;
                dy = e.clientY;

                left = parseInt(pic.style.left);
                top = parseInt(pic.style.top);

                clickFlag = 1;
            });
            this.addEvent(".picWrapper", "mouseup", function(e){
                clickFlag = 0;
            });

            document.getElementById("picWrapper").onmousemove = function(e){
                /*
                    var x = e.offsetX ? e.offsetX : e.layerX;
                    var y = e.offsetY ? e.offsetY : e.layerY;
                    */
                    var x = e.clientX;
                    var y = e.clientY;

                if(clickFlag){
                    var pic = document.getElementById("pic");

                    /*
                    var x = e.offsetX ? e.offsetX : e.layerX;
                    var y = e.offsetY ? e.offsetY : e.layerY;
                    */
                     var x = e.clientX;
                    var y = e.clientY;
  
                    var rLeft = left + (x - dx);
                    var rTop = top + (y - dy);
                    if(rLeft < 0) rLeft = 0;
                    if(rTop < 0) rTop = 0;

                    pic.style.left = rLeft + "px";
                    pic.style.top = rTop + "px";
                }
            };

            this.addEvent(".d_item", "click", function(e){
                var img = this.getElementsByTagName("img")[0];
                var pic = document.getElementById("pic");
                pic.src = img.src;
                pic.onload = function(){
                    _this.initView();
                    _this.img = AlloyImage(this);
                };
            });

            this.addEvent(".button", "click", function(e){
                document.getElementById("open").click();
            });

            this.addEvent(".open", "change", function(e){
                _this.openFile(e.target.files[0]);
            });

            this.addEvent(".imgWrapper", "click", function(e){
                var text = this.childNodes[1].nodeValue.replace("效果","");
                var img = document.getElementById("pic");
                var AP = _this.img.clone();
                if(text == "原图") AP.replace(img);
                else{
                    msgEle.style.display = "block";

                    setTimeout(function(){
                        var t = + new Date();
                        AP.ps(text).replace(img).complete(function(){
                            console.log(text + "：" + (+ new Date() - t) / 1000 + "s");
                            msgEle.style.display = "none";
                        });
                    }, 2);
                }
            });

            document.body.addEventListener("drop", function(e){
                e.preventDefault();
                var fileList = e.dataTransfer.files;
                _this.openFile(fileList[0]);
            },false);

            window.onresize = function(){
                _this.initView();
            };

        },

        init: function(){
            this.initView();
            this.showModel();
            this.eventAtt();

            var _this = this;
            var pic = document.getElementById("pic");
            pic.onload = function(){
               _this.img = AlloyImage(this); 
                _this.initView();
            };
        },

        initView: function(){
                var func = function(){
                    /*
                    var computedStyle = getComputedStyle(document.getElementById("picWrapper"));
                    */
                    var w_width = parseInt(document.body.clientWidth) - 250;
                    var w_height = document.body.clientHeight;
                    var p_width = this.width;
                    var p_height = this.height;

                    var left = (parseInt(w_width) - parseInt(p_width)) / 2;
                    var top = (parseInt(w_height) - parseInt(p_height)) / 2;
                    top = top < 0 ? 0 : top;
                    left = left < 0 ? 0 : left;
                    this.style.left = left + "px";
                    this.style.top = top + "px";
                    msgEle.style.left = (parseInt(w_width) - 100) / 2 + "px";
                    msgEle.style.top = (parseInt(w_height) - 100) / 2 + "px";
                };
                func.call(document.getElementById("pic"));

                var height = document.body.clientHeight;
                var left = document.querySelector(".left");
                var leftHeight = height - 143;
                left.style.height = leftHeight + "px";
        },

        openFile: function(fileUrl){//打开文件

            var reader = new FileReader();
            var _this = this;
            reader.readAsDataURL(fileUrl);
            reader.onload = function(){
                var pic = document.getElementById("pic");
                pic.src = this.result;
                pic.onload = function(){
                    _this.initView();
                    _this.img = AlloyImage(this);
                };
            };
        
        },

        showModel: function(){
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
                "木雕" : "e13",
                "粗糙" : "e14"
            };
            var effectModel = '<li class="e_item"><div class="imgWrapper"><img src="style/image/demo/{pic}.png" alt="" />{effect}</div></li>';
            var html = '<li class="e_item"><div class="imgWrapper"><img src="style/image/demo/e1.jpg" alt="" />原图</div></li>';
            for(var i in EasyReflection){
               html += effectModel.replace("{effect}",i.length < 3 ? i + "效果" : i).replace("{pic}", EasyReflection[i]); 
            }

            document.getElementById("effects").innerHTML = html;
        }

    };
    
    var msgEle;

    window.addEventListener("DOMContentLoaded", function(){
        msgEle = document.getElementById("infoMsg");

        //$AI.useWorker("js/combined/alloyimage.js");
        Main.init();
    }, false);

})();
