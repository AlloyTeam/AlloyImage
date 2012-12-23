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
      }
      this.hide = function(){
        $(".commonmsgbox").slideUp("fast");
      }
    }
        return new MsgBox("选择学校","请选择学校","dfsf");
