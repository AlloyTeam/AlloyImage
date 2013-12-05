 /**
 * @author DorsyWang(Bin Wang)
 * @email honghu91@hotmail.com
 * @description css JS
 */
;(function(PName){
    window[PName].module("css", function(P){
        var cssStyle = "\
            .apWrapper{\
                position: absolute;\
                left: 0;\
                top: 0;\
                background: #f9f9f9 url(../img/logoIcon.png) no-repeat 3px 4px;\
                -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\
                height: 38px;\
                width: 37px;\
                border-radius: 4px;\
                font-family: Microsoft Yahei, '宋体';\
                magin: 0;\
                padding: 0;\
                opacity: 0;\
                -webkit-transition: all .3s 0.5s cubic-bezier(.15,.89,.19,.98);\
                -webkit-transition-property: width,opacity;\
                cursor: pointer;\
            }\
            .apWrapper:hover{\
                opacity: 1;\
                -webkit-transition: all 0.3s cubic-bezier(.15,.89,.19,.98);\
                width: 257px;\
            }\
            .apWrapper:hover .apLogo{\
                opacity: 1;\
                -webkit-transition: all 0.3s cubic-bezier(.15,.89,.19,.98);\
            }\
            .apUnhover{\
                opacity: 1;\
                width: 257px;\
            }\
            .apLogo{\
                opacity: 0;\
                position: absolute;\
                left: 50%;\
                top: -14px;\
                font-size: 14px;\
                margin-left: -35px;\
                color: #157dfb;\
                font-weight: bold;\
                -webkit-transition: all 0.3s 0.5s cubic-bezier(.15,.89,.19,.98);\
                text-shadow: \
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff,\
                    0 0 3px #fff, 0 1px 3px #fff, 0 2px 3px #fff, 1px 0 3px #fff, 1px 2px 3px #fff\
                    ;\
            }\
            .apOperBox{\
                width: 257px;\
                position: absolute;\
                top: 37px;\
                display: none;\
                cursor: default;\
                padding: 4px 0 0 0;\
            }\
            .apOperBoxContent{\
                min-height: 100px;\
                -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\
                background: #fff;\
                border-radius: 4px;\
            }\
            .apOperBoxConfirm{\
                background: #e3e7e6;\
                border-radius: 4px;\
                margin-top: 10px;\
            }\
            .apOperBoxCancel, .apOperBoxOK{\
                display: inline-block;\
                width: 128px;\
                text-align: center;\
                margin: 0;\
                padding-top: 5px;\
                padding-bottom: 5px;\
                color: #2181f7;\
                border-top: 1px solid #9da1a0;\
            }\
            .apOperBoxCancel:hover{\
                background: #f6f5f1;\
                border-bottom-left-radius: 4px;\
                font-weight: bold;\
            }\
            .apOperBoxOK:hover{\
                background: #f6f5f1;\
                font-weight: bold;\
                border-bottom-right-radius: 4px;\
            }\
            .apOperBoxCancel{\
                border-right: 1px solid #9da1a0;\
            }\
            .apNav{\
                float:left;\
                margin: 0;\
                height: 38px;\
                line-height: 38px;\
                padding: 0;\
                width: 0;\
                margin-left: 37px;\
                overflow-x: hidden;\
                overflow-y: hidden;\
                -webkit-transition: all 0.3s 0.5s cubic-bezier(.15,.89,.19,.98);\
            }\
            .apWrapper:hover .apNav{\
                -webkit-transition: all 0.3s cubic-bezier(.15,.89,.19,.98);\
                width: 219px;\
            }\
            .apNav:hover{\
                overflow-y: visible;\
                overflow-x: visible;\
            }\
            .apNav > li{\
                display: inline-block;\
                list-style: none;\
                color: #157dfb;\
                margin: 0;\
                padding: 0 5px;\
                position: relative;\
                font-family: HelveticaNeue, '华文细黑', Microsft Yahei, '宋体';\
            }\
            .apNav > li:hover{\
                overflow: visible;\
            }\
            .apNav > li ul{\
                position: absolute;\
                top: 38px;\
                left: 0;\
                margin: 0;\
                padding: 0 0px;\
                line-height: 20px;\
                font-size: 14px;\
                background: #fff;\
                border-radius: 2px;\
                width: 80px;\
                height: 0;\
                overflow: hidden;\
                -webkit-transition: all 0.3s 0.5s cubic-bezier(.15,.89,.19,.98);\
            }\
            .apNav > li:hover ul{\
                opacity: 1;\
                -webkit-transition: all 0.3s 0.5s cubic-bezier(.15,.89,.19,.98);\
            }\
            .apNav > li ul li{\
                list-style: none;\
                -webkit-transition: all .1s ease-in-out;\
                line-height: 25px;\
            }\
            .apNav > li ul li div{\
                margin: 0 10px;\
                tborder-bottom: 1px solid #ccc;\
                color: #555;\
                font-size: 13px;\
                font-family: Microsoft Yahei, '宋体';\
            }\
            .apNav > li ul li:hover{\
                color: #fff;\
                background: #157efb;\
            }\
            .apNav > li ul li:hover div{\
                color: #fff;\
                -webkit-transition: all 0.3s cubic-bezier(.15,.89,.19,.98);\
            }\
            .apShow{\
                opacity: 1;\
            }\
            .apOperBoxContent{\
                background: #f9f9f9;\
            }\
            .apScrollBarWrapper{\
                padding-top: 10px;\
                height: 30px;\
            }\
            .apBarTitle{\
                float: left;\
                margin-left: 8px;\
                height: 30px;\
                line-height: 30px;\
            }\
            .apBarContent{\
                position: relative;\
                float: left;\
                margin-left: 22px;\
            }\
            .apBarLineLeft, .apBarLineRight{\
                display: inline-block;\
                height: 4px;\
            }\
            .apBarLineLeft{\
                width: 100px;\
                background: #167efc;\
            }\
            .apBarScrollEl{\
                width: 30px;\
                height: 30px;\
                border-radius: 28px;\
                background: #fff;\
                display: inline-block;\
                position: absolute;\
                cursor: default;\
                -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);\
            }\
            .apBarLineRight{\
                width: 100px;\
                background: #b5b5b6;\
            }\
            .apClipWrapper{\
                position: absolute;\
                top: 0;\
                left: 0;\
                width: 300px;\
                height: 300px;\
                background: rgba(0, 0, 0, 0.4);\
            }\
            #apLoading{\
                width: 100px;\
                height: 100px;\
                background: #333;\
                opacity: 0.7;\
                position: absolute;\
                left: 0;\
                top: 0;\
                border-radius: 7px;\
                line-height: 100px;\
                text-align: center;\
                color: #ccc;\
                font-family: Microsoft Yahei;\
                display: none;\
            }\
        ";

        return {
            init: function(){
                this.appStyle();
            },

            //应用css样式
            appStyle: function(){
                var head = document.getElementsByTagName("head");

                var styleEl = document.createElement("style");
                styleEl.innerHTML = cssStyle;

                head[0].appendChild(styleEl);
            }

        };
    });
})("alloyphoto")
