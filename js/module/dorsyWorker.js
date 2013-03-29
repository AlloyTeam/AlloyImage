/* * @author: Bin Wang
 * @description: Main worker
 *
 * */
;(function(Ps){

    window[Ps].module("dorsyWorker",function(P){
        //等待时间
        var WAITING_SECONDS = 200;

        var M = function(aiObj){
            //static private single
            var worker = new Worker("js/combined/alloyImage.js?" + (new Date()));

            var workerObj = {
                //等待处理的队列
                queue: [],
                //开始进入多线程
                startWorker: function(){
                    //console.log("startWorker");
                    this.shiftAction();
                },

                //从队列中取出一个动作来处理
                shiftAction: function(){
                    var action = this.queue.shift(), _this = this;

                    //如果没有了,等待100ms再次检查, 如果还没有,表明队列中无新增处理动作, readyOK
                    if(! action){
                        setTimeout(function(){
                            action = _this.queue.shift();

                            if(! action){
                                aiObj.notify("readyStateOK");
                                //console.log("readyStateOK");
                            }

                        }, WAITING_SECONDS);

                        return;
                    }

                    //此处理为动作
                    if(action[0] == "act"){

                        //向worker发消息
                        worker.postMessage(["act", action[1], aiObj.imgData, action[2]]);

                    //为添加要检查添加的图层是否处理完成
                    }else if(action[0] == "add"){
                        //console.log("add");

                        checkReadyState();

                        function checkReadyState(){

                            //完成
                            if(action[1].readyState){
                                
                                //构造参数
                                var params = [
                                        aiObj.imgData,
                                        action[1].imgData,
                                    ].concat(
                                        action.slice(2)
                                    );
                                 
                                worker.postMessage(["add", params]);

                            //如果没有完成则不断检查是否完成,期间可以做其他的动作,但处理暂时中止
                            }else{
                                setTimeout(function(){
                                    checkReadyState();
                                }, WAITING_SECONDS);
                            }
                        }
                    }else if(action[0] == "show"){
                        aiObj.show(action[1], action[2], 1);
                        this.shiftAction();

                    //遇到回调出现
                    }else if(action[0] == "complete"){
                        //console.log("complete trigger");
                        action[1] && action[1]();
                    }
                },

                //worker回调监听
                callback: function(data){
                    //console.log("callback");
                    aiObj.imgData = data;
                    this.shiftAction();
                }
            };

            //收到消息后再从队列中检查然后进行处理
            worker.onmessage = function(e){
                //console.log("onmessage");
                workerObj.callback(e.data);
            };

            return workerObj;
        };

        return M;

    });

})("psLib");

