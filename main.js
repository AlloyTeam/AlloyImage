(function(){
    var MsgBox = function(title,msg,inhtml){
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
      }
      this.show = function(){
        $(".commonmsgbox").slideDown("fast");
      };
      this.hide = function(){
        $(".commonmsgbox").slideUp("fast");
      };
      this.close = this.hide;
    }
    var msg = new MsgBox("AlloyPhoto","","");

    var Bar = {//对滑动bar的事件处理对象
        observer: [],
        notify: function(target){
            var value = parseInt(target.parent().find(".dMsg").text());
            for(var i = 0;i < this.observer.length;i ++){
               if(target.parent().attr("id") == this.observer[i][0]){
                    this.observer[i][1](value);
               }
            }
        },
        addObserver: function(targetId,func){
            this.observer.push([targetId,func]);
        }
    };

    var COM_MODEL = [
    "正常","颜色减淡","变暗","变亮","正片叠底","滤色","叠加","强光","差值","排除","点光","颜色加深","线性加深","线性减淡","柔光","亮光","线性光","实色混合"
    ];

    var COM_HTML_MODEL = "<select class='commodel'>";
    for(var i = 0;i < COM_MODEL.length;i ++){
        COM_HTML_MODEL += "<option value='" + COM_MODEL[i] + "'>" + COM_MODEL[i] + "</option>";
    }
    COM_HTML_MODEL += "</select>";

    var layerCount = 0;//图层的命名计数
    var Main = {
        layers: [],
        ps: null,//主画布
        layers:[],
        currLayer:[],
        openFile: function(fileUrl){//打开文件

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
            var psObj = psLib(img);
            if(!(this.ps)){
                this.ps = psLib(parseInt(img.width),parseInt(img.height),"rgba(255,255,255,0)");
                $(".left").css({width:img.width,height:img.height});
                $(".openFile").html("画布区");
            }

            this.layers.push(psObj);
            this.ps.addLayer(psObj);//添加一个图层
            this.currLayer = [this.layers.length - 1];//设置当前图层

            this.addLayer();//向面板添加一个图层
            this.draw();
        },

        recieveImg:function(){//监听 Q+ rpc传来的文件做处理
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

        addLayer: function(){//向图层面板添加一个图层
           var html = "<div class='lItem'><span class='layerName'>图层" + (++ layerCount) + "</span> 混合模式" + COM_HTML_MODEL + "</div>"; 
           $(".layer").prepend(html);
           this.showCurrLayer();
        },
        
        swap: function(a,b){//交换两个图层的位置  在layers数组中的位置交换，
            this.ps.swap(a,b);

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

            $("#upFile").change(function(e){//上传文件处理
                msg.title = "读取文件";
                msg.msg = "正在读取文件...";
                msg.inhtml = "<img src='images/03.gif' />";
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
                msg.hide();

                var width = $("#newWidth").val();
                var height = $("#newHeight").val();
                var color = $("#newColor").val();

                var psObj = psLib(width,height,color);
                if(!(_this.ps)){
                    _this.ps = psLib(width,height,"rgba(255,255,255,0)");
                    $(".left").css({width:width + "px", height:height + "px"});
                    $(".openFile").html("画布区");
                }

                _this.layers.push(psObj);
                _this.ps.addLayer(psObj);//添加一个图层
                _this.currLayer = [_this.layers.length - 1];//设置当前图层

                _this.addLayer();//向面板添加一个图层
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

        var flagM1 = 0,flagD1 = 0;//滑动bar标记
        var orginOffsetX = 0;
        var clientX = 0,offsetX = 0,dTarget;
        $(".dBar a").live("mousedown",function(e){
            flagM1 = 1;
            clientX = e.clientX;
            offsetX = parseInt($(this).css("left"));
            dTarget = $(this);
        });
        $(document).bind("mousemove",function(e){
            if(flagM1){
                flagD1 = 1;//拖拽开始
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
                this.ps.show(".painting",isFast);//显示主画布
                this.ps.drawRect();//重绘直方图
        },

        showCurrLayer: function(){//显示当前操作或选中的图层
            $(".lItem").removeClass("blueStyle");
            for(var i = 0;i < this.currLayer.length;i ++){
               $(".lItem:eq(" + (this.layers.length - 1 - this.currLayer[i]) + ")").addClass("blueStyle");
            }
        }
    };

    Main.init();

 

})();
