/**
 * AlloyImage Define Module
 * Just Like requireJS, but for js library
 * @author dorsywang
 */
;(function(){
    //define modules
    var mainPort = 'AlloyImage';
    var __definePools__ = {};

    //checking if modules ready;
    var checkReady = function(name){
        if(__definePools__[name]){
            var modules = __definePools__[name].modules;

            var readyModule = [];
            modules.map(function(item, index){
                var itemObject = checkReady(item);
                if(itemObject){
                    readyModule.push(itemObject);
                }else{
                }
            });

            if(readyModule.length == modules.length){
                return __definePools__[name].func.apply(null, readyModule);
            }
        }else{
        }

    };

    //AI define method, just like common define method;
    var AIDefine = function(name, modules, func){
        __definePools__[name] = {
            func: func,
            modules: modules
        };

        checkReady(mainPort);
    };

    //Global Object: AlloyImage Or $AI;
    window.$AI = window.AlloyImage = AlloyImage = $AI = function(){};

    //AI export method, just like common export method;
    var AIExport = {
        put: function(name, obj){
            if(name === ""){
                for(var i in  obj){
                    $AI[i] = obj[i];
                }
            }else{
                $AI[name] = obj;
            }
        },

        external: function(name, obj){
            window[name] = obj;
        }
    };

    AIExport.external('AIExport', AIExport);
    AIExport.external('AIDefine', AIDefine);

})();
