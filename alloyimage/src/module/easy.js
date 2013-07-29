/**
 * @author: Bin Wang
 * @description:    腐蚀 
 *
 */
;(function(Ps){

    window[Ps].module("easy",function(P){

        var M = {
            getFun: function(fun){
                var Effects = {
                    softenFace: function(){//美肤
                        var _this = this.clone();
                        return  _this.add(
                            this.act("高斯模糊",10),"滤色"
                        ).act("亮度",-10,5);
                    },
                    sketch: function(){//素描
                        var _this = this.clone();
                        return this.add(
                            _this.act("反色").act("高斯模糊",8), "颜色减淡"
                        ).act("toGray").act("锐化",1);
                    },
                    softEnhancement: function(){//自然增强
                      return this.act("曲线",[0,190,255],[0,229,255]);
                    },
                    purpleStyle: function(){
                        var _this = this.clone();
                        return this.add(
                            _this.act("高斯模糊",3), "正片叠底" ,"RG"
                        );
                        
                    },
                    soften: function(){
                        var _this = this.clone();
                        return this.add(
                            _this.act("高斯模糊",6), "变暗"
                        );
                    },
                    vintage: function(){//复古
                        var _this = this.clone();
                        return this.act("灰度处理").add(
                            window[Ps](this.canvas.width,this.canvas.height,"#808080").act("添加杂色").act("高斯模糊",4).act("色相/饱和度调节",32,19,0,true),"叠加"
                        );
                    },
                    gray: function(){//黑白
                        return this.act("灰度处理");
                    },
                    lomo: function(){//仿lomo
                        var m = this.clone().add(
                            this.clone() , "滤色"
                        ).add(
                            this.clone() , "柔光"
                        );

                        return m.add(
                            this.clone().act("反色") , "正常","20%","B"
                        ).act("暗角", 6, 200);
                        
                    },
                    strongEnhancement: function(){
                        return this.clone().add(
                            this.clone().act("曲线",[0,50,255],[0,234,255]), "柔光"
                        );
                    },
                    strongGray: function(){//高对比 灰白
                        return this.act("灰度处理").act("曲线",[0,61,69,212,255],[0,111,176,237,255]);
                    },
                    lightGray: function(){
                            return this.act("灰度处理").act("曲线",[0,60,142,194,255],[0,194,240,247,255])
                    },
                    warmAutumn: function(){
                        var m = this.clone().act("色相/饱和度调节",36,47,8,true).act("暗角", 6, 150);
                        return this.add(
                            m, "叠加"
                        );
                    },

                    //木雕的效果
                    carveStyle: function(){
                        var layerClone = this.clone().act("马赛克").act("查找边缘").act("浮雕效果");
                        return this.add(
                            layerClone, "线性光"
                        );
                    },

                    //粗糙
                    rough: function(){
                       return this.add(

                           window[Ps](this.canvas.width, this.canvas.height, "#000").act("喷点").act("反色").act("浮雕效果")
                           ,"叠加"
                       );
                    }
                };

                return Effects[fun];
            }
        };

        return M;

    });

})("psLib");
