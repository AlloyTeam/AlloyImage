;(function(){
    var EffectFactory = {
        init: function(){
            this.View.init();
            this.Event.init();
        }
    };

    var runtimePanelEl;
    EffectFactory.View = {
        init: function(){
            this.getRuntimePanel();
        },
        getRuntimePanel: function(){
            return runtimePanelEl || function(){
                var runtimePanel = $(".runtimePanel");
                var el = {
                    close: function(){
                        runtimePanel.css("top", - runtimePanel.height() + "px");

                        return this;
                    },
                    show: function(){
                        runtimePanel.css("top", "20px");

                        return this;
                    },
                    title: function(title){
                        $(".runtimePanel .title").html(title);

                        return this;
                    }
                };

                var width = $("body").width() - 100;
                var height = $("body").height() - 40;
                runtimePanel.css({"margin-left": - width / 2 + "px", "top": - height + "px", "width": width + "px", "height": height});

                $(".close").click(function(){
                    el.close();
                });

                runtimePanelEl = el;
                return el;
            }();
        }
    };

    EffectFactory.Model = {
    };

    EffectFactory.Event = {
        init: function(){
            var _this = EffectFactory;

            $(".effectsFactory li").live("click", function(e){
                _this.View.getRuntimePanel().show().title("OK");

                e.preventDefault();
                e.stopPropagation();
            });
        }
    };

    $(function(){
        EffectFactory.init();
    });
})();
