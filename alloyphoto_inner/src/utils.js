 /**
 * @author DorsyWang(Bin Wang)
 * @email honghu91@hotmail.com
 * @description utils JS
 */
;(function(PName){
    window[PName].module("utils", function(P){
        return {

            //请求JS
            requireJS: function(path, callback){
                var scriptLoader = document.createElement("script");

                scriptLoader.src = path;
                scriptLoader.onload = function(){
                    callback && callback();
                };

                scriptLoader.onerror = function(){
                    console.log("alloyimage文件加载失败");
                };

                document.body.appendChild(scriptLoader);
            },

            //检查alloyimage是否存在
            checkAIFile: function(callback){
                //存在alloyimage文件
                if(window.$AI){
                    //$AI.useWorker(
                    callback && callback();
                }else{
                    var path = P.config.aiPath || P.config.aiDefaultPath;
                    this.requireJS(path, callback);
                }
            },

            createElement: function(elType, elAtrr, parentNode){
                var el = document.createElement(elType);

                for(var i in elAtrr){
                    el[i] = elAtrr[i];
                }

                parentNode && parentNode.appendChild(el);

                return el;
            },

            getElePosition: function(el){
                 var ua = navigator.userAgent.toLowerCase();
                 var isOpera = (ua.indexOf('opera') != -1);
                 var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
                 if(el.parentNode === null || el.style.display == 'none'){
                   return false;
                 }      

                var parent = null;
                var pos = [];     
                var box;     
                if(el.getBoundingClientRect){    //ie 
                   box = el.getBoundingClientRect();
                   var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                   var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                   return {x:box.left + scrollLeft, y:box.top + scrollTop};
                }else if(document.getBoxObjectFor){    // gecko
                  box = document.getBoxObjectFor(el); 
                  var borderLeft = (el.style.borderLeftWidth)?parseInt(el.style.borderLeftWidth):0; 
                  var borderTop = (el.style.borderTopWidth)?parseInt(el.style.borderTopWidth):0; 
                  pos = [box.x - borderLeft, box.y - borderTop];
                 }else{    // safari & opera    

                   pos = [el.offsetLeft, el.offsetTop];  
                   parent = el.offsetParent;     
                   if (parent != el) { 
                   while (parent) {  
                        pos[0] += parent.offsetLeft; 
                        pos[1] += parent.offsetTop; 
                        parent = parent.offsetParent;
                    }  
                  }   
                  if (ua.indexOf('opera') != -1 || ( ua.indexOf('safari') != -1 && el.style.position == 'absolute' )) { 
                       pos[0] -= document.body.offsetLeft;
                        pos[1] -= document.body.offsetTop;         
                  }    
                }              
                if (el.parentNode) { 
                    parent = el.parentNode;
                } else {
                     parent = null;
                }

                 while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
                   pos[0] -= parent.scrollLeft;
                   pos[1] -= parent.scrollTop;
                   if (parent.parentNode) {
                    parent = parent.parentNode;
                   } else {
                    parent = null;
                   }
                 }

                 return {x:pos[0], y:pos[1]};
            },

            addClass: function(el, className){
                ! new RegExp(" ?" + className).test(el.className) && (el.className += " " + className);
            },

            removeClass: function(el, className){
                el.className = el.className.replace(new RegExp(" ?" + className), "");
            },

            css: function(el, attr){
                if(el.style[attr]){
                    return el.style[attr];
                }else{
                    return getComputedStyle(el).getPropertyValue(attr);
                }
            }

        };
    });
})("alloyphoto");
