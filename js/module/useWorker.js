/*
 * @author: Bin Wang
 * @description: worker封装
 *
 * */
;(function(Ps){
    window[Ps].module("useWorker", function(P){

        function slice(arr, start, end){
            return Array.prototype.slice.call(arr, start, end);
        }
        var M = {
            //计算的data   worker的个数 处理使用的func data要求是数组
            //dataList = {
            //  lowerData: lowerData,
            //  upperData: upperData,
            //  length: 100
            //}
            //
            //func = function(lowerData, upperData)
            add: function(data1, data2, method, alpha, dx, dy, channel, width, height, workerNum){
                workerNum = workerNum || 6;
                var length = data1.length;
                var maxCount = length / workerNum;

                var workerListLength = workerNum;

                for(var i = 0; i < workerNum; i ++){
                    var end = parseInt((i + 1) * maxCount);
                    var start = parseInt(end - maxCount);

                    var dataItem1 = slice(data1, start, end + 1);
                    var dataItem2 = slice(data2, start, end + 1);
                    var workerItem = new Worker("js/worker/calculator.js");

                    var workerData = {
                        start: start,
                        end : end,
                        data1: dataItem1,
                        data2: dataItem2,
                        method: method,
                        alpha: alpha,
                        dx: dx,
                        dy: dy,
                        width: width,
                        height:height,
                        channel: channel
                    };


                    workerItem.postMessage(workerData);

                    workerItem.onmessage = function(e){
                        workerListLength --;

                        var pushData = e.data;
                        for(var i = pushData.start; i <= pushData.end; i ++){
                            data1[i] = pushData.data[i - pushData.start];
                        }
                        if(workerListLength == 0){
                            M.complete(data1);
                        }
                    };
                }
            },
            //所有计算成功后
            complete: function(data){
                P.callback && P.callback();
            }
        };

        return M;

    });
})("psLib");
