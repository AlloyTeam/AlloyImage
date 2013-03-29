(function(){
   var MsgBox = function(title, msg, inhtml){

      //初始化参数
      this.width = "500px";
      this.height = "300px";
      this.title = title;
      this.msg = msg;
      this.i = 0;
      this.inhtml = inhtml;

      this.init = function(){

        this.i ++;

        var html = "<div class='commonmsgbox'><div class='title'>";
        html += this.title;
        html += "</div><div class='msgclose'>关闭</div><div class='commonmsg'>";
        html += this.msg;
        html += "</div><div class='content'>";  
        html += this.inhtml;
        html += "</div></div>";

        if(this.i == 1) $(".wrapper").append(html);
        else $(".commonmsgbox").replaceWith(html);

        $(".commonmsgbox").css({width:this.width,height:this.height,display:"none"});

        var msgtop = (document.documentElement.clientHeight - parseInt($(".commonmsgbox").css("height")))/2;
        var msgleft = (document.documentElement.clientWidth > 1003) ? (document.documentElement.clientWidth - parseInt($(".commonmsgbox").css("width"))) / 2 : (1003 - parseInt($(".commonmsgbox").css("width"))) / 2;

        $(".commonmsgbox").css({"top":msgtop + "px","left":msgleft + "px"});
        $(".commonmsgbox .title").css("width",$(".commonmsgbox").css("width"));

        var _this = this;

        $(".commonmsgbox .msgclose").click(function(){
            _this.hide();
        });
      };

      this.show = function(){
        $(".commonmsgbox").slideDown("fast");
      };

      this.hide = function(){
        this.inhtml = "";
        $(".commonmsgbox").html("");
        $(".commonmsgbox").slideUp("fast");
      };

      this.close = this.hide;
    };

    var msg = new MsgBox("AlloyPhoto","","");

    //曲线
    var Curve = {
        dotX: [],
        dotY: [],
        canvas: null,
        f: null,

        //初始化
        init: function(wrapper){
            this.dorsyMath = AlloyImage.dorsyMath();

            var canvas = document.createElement("canvas");
            canvas.width = "400";
            canvas.height = "200";
            wrapper.append(canvas);

            this.canvas = canvas;

            //绑定事件
            this.eventAtt();
        },

        //画曲线
        draw: function(){

            //获得langrange插值函数
            var f = this.dorsyMath.lagrange(this.dotX, this.dotY);
            var ctx = this.canvas.getContext("2d");

            var width = this.canvas.width;
            var height = this.canvas.height;
            ctx.clearRect(0, 0, width, height);

            for(var i = 0; i <this.dotX.length; i ++){
                var dx = this.dotX[i] / 255 * width;
                var dy = (1 - this.dotY[i] / 255) * height;
                ctx.beginPath();
                ctx.arc(dx, dy,5,0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }

            ctx.beginPath();

            for(var i = 0; i < 256; i ++){
                var x = i / 255 * width;
                var y = height - f(i) / 255 * height;

                y = y > height ? height : y;
                y = y < 0 ? 0 : y;

                ctx.lineTo(x,y);
            }

            ctx.stroke();
            ctx.closePath();
            
            this.f = f;

            var func = this.func || function(){};

            func(this.dotX, this.dotY);
        },

        setPoint: function(dotX, dotY){
            this.dotX = dotX;
            this.dotY = dotY;
            this.draw();
        },

        setObserver: function(func){
            this.func = func;
        },

        eventAtt: function(){
            var _this = this;

            //标记在曲线上
            var lineOnFlag = 0,relate = null;

            this.canvas.onmousemove = function(e){
                var relate2 = null;
                var dx = e.offsetX || e.pageX;
                var dy = e.offsetY || e.pageY;
                var x = dx / _this.canvas.width * 255;
                var y = (1 - dy / _this.canvas.height) * 255;
                var delta = _this.f(x) - y;

                if(Math.abs(delta) < 9){
                    for(var i = 0; i < _this.dotX.length; i ++){
                        var delta = x - _this.dotX[i];

                        this.style.cursor = "pointer";

                        if(Math.abs(delta) < 9){
                            relate2 = true;
                            break;
                        }
                    }

                }else{
                    this.style.cursor = "auto";
                }
            };

            this.canvas.onmousedown = function(e){

                var dx = e.offsetX || e.pageX;
                var dy = e.offsetY || e.pageY;
                var x = dx / _this.canvas.width * 255;
                var y = (1 - dy / _this.canvas.height) * 255;
                var delta = _this.f(x) - y;

                if(Math.abs(delta) < 9){
                    lineOnFlag = 1;

                    for(var i = 0; i < _this.dotX.length; i ++){
                        var delta = x - _this.dotX[i];

                        if(Math.abs(delta) < 9){
                            relate = i;
                            break;
                        }
                    }
                }
            };

            this.canvas.onmouseup = function(e){
                if(lineOnFlag){
                    lineOnFlag = 0;

                    var dx = e.offsetX || e.pageX;
                    var dy = e.offsetY || e.pageY;
                    var x = dx / _this.canvas.width * 255;
                    var y = (1 - dy / _this.canvas.height) * 255;   

                    if(relate){
                        _this.dotX[relate] = x;
                        _this.dotY[relate] = y;
                    }else{
                        _this.dotX.push(x);
                        _this.dotY.push(y);
                    }

                    _this.draw();
                    
                    relate = null;
                }
            };
        }
    };

    //对滑动bar的事件处理对象
    var Bar = {
        observer: [],

        notify: function(target){
            var value = parseInt(target.parent().find(".dMsg").text());

            for(var i = 0; i < this.observer.length; i ++){

               if(target.parent().attr("id") == this.observer[i][0]){
                    this.observer[i][1](value);
               }

            }
        },

        addObserver: function(targetId, func){
            this.observer.push([targetId, func]);
        }
    };

    var COM_MODEL = [
        "正常", "颜色减淡", "变暗", "变亮", "正片叠底", "滤色", "叠加", "强光", "差值", "排除", "点光", "颜色加深", "线性加深", "线性减淡", "柔光", "亮光", "线性光", "实色混合"
    ];

    var COM_HTML_MODEL = "<select class='commodel'>";

    for(var i = 0; i < COM_MODEL.length; i ++){
        COM_HTML_MODEL += "<option value='" + COM_MODEL[i] + "'>" + COM_MODEL[i] + "</option>";
    }

    COM_HTML_MODEL += "</select>";

    //图层的命名计数
    var layerCount = 0;
    var Main = {
        layers: [],

        //主画布
        ps: null,

        layers: [],

        currLayer: [],

        //打开文件
        openFile: function(fileUrl){

            var reader = new FileReader();
            var _this = this;

            reader.readAsDataURL(fileUrl);

            reader.onload = function(){
                msg.close();

                var img = new Image();
                img.src = this.result;
                img.onload = function(){
                    _this.addImage(img);
                };

            };
        
        },
        addImage: function(img){

            var psObj = AlloyImage(img);

            if(!(this.ps)){
                this.ps = AlloyImage(parseInt(img.width),parseInt(img.height),"rgba(255,255,255,0)");

                $(".left").css({width:img.width,height:img.height});
                $(".openFile").html("画布区");
            }

            this.layers.push(psObj);

            //添加一个图层
            this.ps.addLayer(psObj);

            //设置当前图层
            this.currLayer = [this.layers.length - 1];
            
            //向面板添加一个图层
            this.addLayer();
            this.draw();
        },

        //监听 Q+ rpc传来的文件做处理
        recieveImg:function(){
            var _this = this;
            /*
           RpcMgr.recive( 'fdeee', function( data ){

                    if ( data.music_name === 'mm' ){
                            this.notice({"msg": data.music_name + " succ"});
                    }else{
                            this.notice({"msg": data.music_name + " fail"});
                    }

                    _this.notifer = this;
                  var imgUrl = data.imgUrl;

                  if(imgUrl){
                    var img = new Image();
                    img.src = imgUrl;

                    img.onload = function(){
                        _this.addImage(img);
                    };
                  }

                                                
            });
            */
        },

        //向图层面板添加一个图层
        addLayer: function(){
           var html = "<div class='lItem'><span class='layerName'>图层" + (++ layerCount) + "</span> 混合模式" + COM_HTML_MODEL + "</div>"; 
           $(".layer").prepend(html);

           this.showCurrLayer();
        },

        //交换两个图层的位置  在layers数组中的位置交换，
        swap: function(a, b){
            this.ps.swap(a, b);

            var temp = this.layers[a];
            this.layers[a] = this.layers[b];
            this.layers[b] = temp;
            
            //交换图层名字  只交换图层的名称和混合模式，图层的order始终保持从下到上的顺序，始终与数组中位置对应
            var A = $(".lItem:eq(" + (this.layers.length - a - 1) + ")");
            var B = $(".lItem:eq(" + (this.layers.length - b - 1) + ")");
            var htmlA= A.html();
            var selectA = A.find("select").val();
            var selectB = B.find("select").val();

            A.html(B.html());
            A.find("select option[value='" + selectB + "']").attr("selected","selected");
            B.html(htmlA);
            B.find("select option[value='" + selectA + "']").attr("selected","selected");

        },

        attachE: function(){
            /*
             * @description:事件处理
             *
             * */

            var _this = this;

            //上传文件处理
            $("#upFile").change(function(e){
                msg.title = "读取文件";
                msg.msg = "正在读取文件...";
                msg.inhtml = "<img src='style/image/03.gif' />";
                msg.init();
                msg.show();

                _this.openFile(e.target.files[0]);
            });

            $("#new").click(function(){
                msg.title = "新建";
                msg.msg = "新建立一个图层";
                msg.inhtml = "宽度：<input type='number' id='newWidth' value='800' />px 高度：<input type='number' id='newHeight' value='600'/>px<br />填充颜色<input type='text' id='newColor' value='rgba(255,255,255,0)' /><input type='button' id='confirmNew' value='确定' />";
                msg.init();
                msg.show();
            });

            $("#confirmNew").live("click",function(){

                var width = $("#newWidth").val();
                var height = $("#newHeight").val();
                var color = $("#newColor").val();
                msg.hide();

                var psObj = AlloyImage(width,height,color);
                if(!(_this.ps)){
                    _this.ps = AlloyImage(width,height,"rgba(255,255,255,0)");
                    $(".left").css({width:width + "px", height:height + "px"});
                    $(".openFile").html("画布区");
                }

                _this.layers.push(psObj);

                //添加一个图层
                _this.ps.addLayer(psObj);

                //设置当前图层
                _this.currLayer = [_this.layers.length - 1];

                //向面板添加一个图层
                _this.addLayer();

                _this.draw();

            });

            $("#modify").click(function(){

                $(".pItem").hide("fast");
                $("#upFile").hide();
                $(".modifyItem").css("display","block");
                $(".back").show();

            });

            $("#lj").click(function(){
                $(".pItem").each(function(i){

                    if(i == 3) $(this).hide("fast",function(){
                        $(".ljItem").css("display","block");
                    });
                    else $(this).hide();

                });

                $("#upFile").hide();
                $(".back").show();
            });

            $("#saveFile").click(function(){
                var data = _this.ps.save();
                var img = new Image();
                img.src = data;
                $(".painting").html(img);
                alert("图片已经输出成功，请右键点击图片，另存为图片即可保存");
                /*
                try{
                    _this.notifer.notice({"msg": data});
                }catch(e){
                    alert(e.message);
                }
                */
            });

            $(".ljItem").click(function(){
                var text = $(this).text();

                for(var i = 0;i < _this.currLayer.length;i ++){
                    _this.layers[_this.currLayer[i]].act(text);
                }

                _this.draw();
            });

            $(".back").click(function(){
                $(".pItem").show("fast");
                $("#upFile").show();
                $(".subItem").hide();
                $(this).hide();
            });
            $("#modi_b").click(function(){

                msg.title = "亮度/对比度调节";
                msg.msg = "请滑动调节";
                msg.inhtml = "亮　度:<div id='dBar1' class='dBar' rangeMin='-50' rangeMax='50'><a draggable='false' href='#'></a><div class='dMsg'>0</div></div><br />";
                msg.inhtml += "对比度:<div id='dBar2' class='dBar' rangeMin='-50' rangeMax='50'><a draggable='false' href='#'></a><div class='dMsg'>0</div></div>";
                msg.inhtml += "<div class='dView'><button id='excute'>确定</button><button id='cancel'>取消</button></div>";
                msg.init();
                msg.show();

                Bar.addObserver("dBar1",function(value){
                    var value2 = parseInt($("#dBar2 .dMsg").text());
                    for(var i = 0;i < _this.currLayer.length;i ++){
                        _this.layers[_this.currLayer[i]].view("亮度",value,value2);
                    }
                    _this.draw();
                });

                Bar.addObserver("dBar2",function(value){
                    var value1 = parseInt($("#dBar1 .dMsg").text());
                    for(var i = 0;i < _this.currLayer.length;i ++){
                        _this.layers[_this.currLayer[i]].view("亮度",value1,value);
                    }
                    _this.draw();
                });
        });

            $("#modi_HSI").click(function(){

                msg.title = "色相/饱和度调节";
                msg.msg = "请滑动调节";
                msg.inhtml = "色　相:<div id='dBar1' class='dBar' rangeMin='-180' rangeMax='180'><a draggable='false' href='#'></a><div class='dMsg'>0</div></div><br />";
                msg.inhtml += "饱和度:<div id='dBar2' class='dBar' rangeMin='-50' rangeMax='50'><a draggable='false' href='#'></a><div class='dMsg'>0</div></div><br />";
                msg.inhtml += "明　度:<div id='dBar3' class='dBar' rangeMin='-50' rangeMax='50'><a draggable='false' href='#'></a><div class='dMsg'>0</div></div><br /><input type='checkbox' value='true' id='isColored' />着色";
                msg.inhtml += "<div class='dView'><button id='excute'>确定</button><button id='cancel'>取消</button></div>";
                msg.init();
                msg.show();

                Bar.addObserver("dBar1",function(value){
                    var value2 = parseInt($("#dBar2 .dMsg").text());
                    var value3 = parseInt($("#dBar3 .dMsg").text());
                    var isChecked = $("#isColored").attr("checked");
                    for(var i = 0;i < _this.currLayer.length;i ++){
                        _this.layers[_this.currLayer[i]].view("色相/饱和度调节",value,value2,value3,isChecked);
                    }
                    _this.draw();
                });

                Bar.addObserver("dBar2",function(value){
                    var value1 = parseInt($("#dBar1 .dMsg").text());
                    var value3 = parseInt($("#dBar3 .dMsg").text());
                    var isChecked = $("#isColored").attr("checked");
                    for(var i = 0;i < _this.currLayer.length;i ++){
                        _this.layers[_this.currLayer[i]].view("色相/饱和度调节",value1,value,value3,isChecked);
                    }
                    _this.draw();
                });

                Bar.addObserver("dBar3",function(value){
                    var value1 = parseInt($("#dBar1 .dMsg").text());
                    var value2 = parseInt($("#dBar2 .dMsg").text());
                    var isChecked = $("#isColored").attr("checked");
                    for(var i = 0;i < _this.currLayer.length;i ++){
                        _this.layers[_this.currLayer[i]].view("色相/饱和度调节",value1,value2,value,isChecked);
                    }
                    _this.draw();
                });
            });

        $("#curve").live("click", function(){
           msg.title = "曲线";
           msg.msg = "请点击或调节节点";
           msg.height = "400px";
           msg.inhtml = "<div id='curveAlter' style=''></div><div class='dView'><button id='excute'>确定</button><button id='cancel'>取消</button></div>";
           msg.init();
           msg.show();
           
           Curve.init($("#curveAlter"));
           Curve.setPoint([0,255],[0,255]);
           Curve.setObserver(function(dotX,dotY){
                for(var i = 0;i < _this.currLayer.length;i ++){
                        _this.layers[_this.currLayer[i]].view("曲线",dotX,dotY);
                }
                _this.draw();
           });

        });

        $("#excute").live("click",function(){

            for(var i = 0;i < _this.currLayer.length;i ++){
                _this.layers[_this.currLayer[i]].excute();
            }

            _this.draw();
            msg.hide();
        });

        $("#cancel").live("click",function(){

            for(var i = 0;i < _this.currLayer.length;i ++){
                _this.layers[_this.currLayer[i]].cancel();
            }

            _this.draw();
            msg.hide();
        });

        $(".msgclose").live("click",function(){
            for(var i = 0;i < _this.currLayer.length;i ++){
                _this.layers[_this.currLayer[i]].cancel();
            }

            _this.draw();
            msg.hide();
        });

        var flagM1 = 0, flagD1 = 0;//滑动bar标记
        var orginOffsetX = 0;
        var clientX = 0, offsetX = 0, dTarget;

        $(".dBar a").live("mousedown",function(e){
            flagM1 = 1;
            clientX = e.clientX;
            offsetX = parseInt($(this).css("left"));
            dTarget = $(this);
        });

        $(document).bind("mousemove",function(e){
            if(flagM1){
                
                //拖拽开始
                flagD1 = 1;
                var dx = e.clientX - clientX; 
                var currLeft = offsetX + dx;
                var circleWidth = parseInt(dTarget.css("width")) / 2;
                var parentWidth = parseInt(dTarget.parent().css("width")) - circleWidth;

                if(currLeft > parentWidth) currLeft = parentWidth;
                if(currLeft < -circleWidth) currLeft = - circleWidth;
                dTarget.css("left",currLeft + "px");

                var rangeMin = parseFloat(dTarget.parent().attr("rangeMin")) || 0;
                var rangeMax = parseFloat(dTarget.parent().attr("rangeMax")) || 0;
                var percent = (currLeft + circleWidth) / parentWidth;
                var nowRange = (rangeMin + (rangeMax - rangeMin) * percent).toFixed(0);

                dTarget.parent().find(".dMsg").text(nowRange);
            }
        });

        //图层面板被点击时
        $(".lItem").live("click",function(){
            var order = _this.layers.length - 1 - $(".lItem").index(this);

            if(flagK){
                _this.currLayer.push(order);
            }else{
                _this.currLayer = [order];
            }

            _this.showCurrLayer();
        });

        //混合模式改变时处理程序
        $(".commodel").live("change",function(){
            var comModel = $(this).val();
            for(var i = 0;i < _this.currLayer.length;i ++){
                _this.ps.layers[_this.currLayer[i]][1] = comModel;
            }
            _this.draw();
        });

        var flagK = 0,flagM = 0,flagD = 0;//flagK 标记key alt flagM标记 Mouse flagD标记拖拽事件
        var dx = [],dy = [];

        $(document).keydown(function(e){
            if(e.keyCode == 17){
                flagK = 1;
                $(".left").css("cursor","move");
            }
        }).keyup(function(e){
            if(e.keyCode == 17){
                flagK = 0;
                $(".left").css("cursor","auto");
            }
        }).mouseup(function(e){
            flagM = 0;
            flagM1 = 0;
            if(flagD) {
                _this.draw();
                flagD = 0;//标记拖拽结束
            }
            if(flagD1){//滑动bar拖拽结束
                Bar.notify(dTarget);
                flagD1 = 0;
            }
        });

        $(".painting").get(0).onmousedown = function(e){
                var offsetX = e.offsetX ? e.offsetX : e.layerX;
                    var offsetY = e.offsetY ? e.offsetY : e.layerY;

                    for(var i = 0;i < _this.currLayer.length;i ++){
                        var lDx = _this.ps.layers[_this.currLayer[i]][2] || 0;
                        var lDy = _this.ps.layers[_this.currLayer[i]][3] || 0;
                        dx[i] = offsetX - lDx; 
                        dy[i] = offsetY - lDy; 
                    }

                    flagM = 1;

            };
            
            $(".painting").get(0).onmousemove = function(e){
                    if(flagK && flagM){
                        var offsetX = e.offsetX ? e.offsetX : e.layerX;
                        var offsetY = e.offsetY ? e.offsetY : e.layerY;

                        for(var i = 0;i < _this.currLayer.length;i ++){
                            _this.ps.layers[_this.currLayer[i]][2] = offsetX - dx[i];
                            _this.ps.layers[_this.currLayer[i]][3] = offsetY - dy[i];
                        }
                        _this.draw(true);
                        flagD = 1;//标记拖拽发生
                    }
            };

            $("#copy").click(function(){

                for(var i = 0,n = _this.currLayer.length;i < n;i ++){
                    var newLayer = _this.layers[_this.currLayer[i]].clone();
                    _this.ps.addLayer(newLayer);
                    _this.layers.push(newLayer);
                    _this.addLayer();
                }
                _this.currLayer = [_this.layers.length - 1];
                _this.showCurrLayer();
                _this.draw();

            });

            $("#up").click(function(){

                var desSort = function(x,y){ return x > y ? -1 : 1;};
                _this.currLayer.sort(desSort);

                var temp = [];
                for(var i = 0,n = _this.currLayer.length;i < n;i ++){
                    var nowOrder = parseInt(_this.currLayer[i]);
                    if(nowOrder < _this.layers.length - 1){
                        _this.swap(nowOrder,nowOrder + 1);
                        temp.push(nowOrder + 1);
                    }else return;
                }
                _this.currLayer = temp[0] ? temp : _this.currLayer;
                _this.showCurrLayer();
                _this.draw();
            });

            $("#down").click(function(){

                _this.currLayer.sort();

                var temp = [];
                for(var i = 0,n = _this.currLayer.length;i < n;i ++){
                    var nowOrder = parseInt(_this.currLayer[i]);
                    if(nowOrder >= 1){
                        _this.swap(nowOrder,nowOrder - 1);
                        temp.push(String(nowOrder - 1));
                    }else return;
                }
                _this.currLayer = temp[0] ? temp : _this.currLayer;
                _this.showCurrLayer();
                _this.draw();
            });

            $("#delete").click(function(){
                if(!confirm("确实要删除图层么？")) return;

                _this.ps.deleteLayers(_this.currLayer);
                for(var i = 0;i < _this.currLayer.length;i ++){
                    $(".lItem").eq(_this.layers.length - 1 - _this.currLayer[i]).remove();
                }
                _this.layers = _this.layers.del(_this.currLayer);

                var curr = _this.layers.length - 1;
                if(curr > -1){
                    _this.currLayer = [curr];
                }else{
                    _this.currLayer = [];
                }

                _this.showCurrLayer();
                _this.draw();
            });

            window.onwebkitanimationend = function(e){
                e.target.style.display = "none";
            };
        },

        init: function(){
            this.addInputFile();
            this.recieveImg();
            this.attachE();
        },

        addInputFile: function(){
            var html = "<input type='file' id='upFile' style='' />";
            $(".panel").append(html);
        },

        draw: function(isFast){
                //显示主画布
                this.ps.show(".painting",isFast);

                //重绘直方图
                this.ps.drawRect();
        },

        //显示当前操作或选中的图层
        showCurrLayer: function(){
            $(".lItem").removeClass("blueStyle");

            for(var i = 0;i < this.currLayer.length;i ++){
               $(".lItem:eq(" + (this.layers.length - 1 - this.currLayer[i]) + ")").addClass("blueStyle");
            }
        }
    };

    Main.init();

})();
