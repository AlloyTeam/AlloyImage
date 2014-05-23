/**
 * AlloyImage util module
 * @author dorsywang From Tencent AlloyTeam
 */

AIDefine('util', [], function(){
    var Util = {
        getDevice: function(){
            var device;

            if(window.navigator){
                var ua = window.navigator.userAgent;

                if(/Android|android/.test(ua)){
                    device = 'android';
                }else if(/iPhone|iPad|iPod/.test(ua)){
                    device = 'ios';
                }else{
                    device = 'other';
                }
            }else{
                device = "sandBox";
            }

            return function(){
                return device;
            };
        }()
    };

    return Util;
});
