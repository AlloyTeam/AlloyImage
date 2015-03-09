/**
 * Some WebCL functions to help with some common or repeated tasks
 * like get context using CPU or GPU, build program and
 * create commandQueue
 *
 * @author Alexandre Rocha <alerock@gmail.com>
 *         Shaobo Yan <shaobo.yan@intel.com>
 *         Jiajie Hu <jiajie.hu@intel.com>
 *         Junmin Zhu <junmin.zhu@intel.com>
 */
;(function(Ps){

try {
    window[Ps].module("webcl",function(P){
        var debug = true;
        var initialized = false;
        var NO_WebCL_FOUND = "Unfortunately your system does not support WebCL";
        var NO_PLATFORM_FOUND = "No WebCL platform found in your system";
        var NO_DEVICE_FOUND = "No WebCL device found in your system";
        var EXTENSION_NOT_SUPPORTED = "Extension is not supported";
        var INVALID_SEQUENCE = "Context is null, you must create a context " +
                "before call createWebCLProgram";

        /* Global vars */
        var platforms , devices = {cpu:[], gpu:[]};
        /* Global memory objects */
        /*var inputBuffer = null, outputBuffer = null;*/
        /* Global kernels as mapped type */
        //var kernels = {"darkCorner": null};
        /* Global work size */
        var globalThreads = null;

        /* result and image info*/
        var result, originImg, width, height, nRGBA, nBytes;

        var cl;
        if (typeof(webcl) != "undefined") {
            cl = webcl;
        } else if (typeof(WebCL) != "undefined") {
            cl = new WebCL();
        }

        var scripts = document.getElementsByTagName( 'script' );
        var clPath = scripts[scripts.length - 1].src.replace('alloyimage.js', 'kernel.cl');

        /**
         * Load the kernel file and return its content
         *
         * @param {String} filePath - Kernel file (*.cl) path
         * @returns {String} File content
         */
        var loadKernel = function (filePath) {
            var res = null;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", filePath, false);
            xhr.send();
            // HTTP reports success with a 200 status, file protocol reports
            // success with a 0 status
            if (xhr.status === 200 || xhr.status === 0) {
                res = xhr.responseText;
            }
            return res;
        };

        var CLExecutor = function(){
            var context, commandQueue, program = null,
                kernels = {"borderline": null,
                           "darkCorner": null,
                           "curve": null,
                           "embossment": null,
                           "setHSI" : null,
                           "gaussBlurX" : null,
                           "gaussBlurY" : null};
            var ioBuffer, result, globalThreads;
            var buffers = [];
            var executor = {
                init : function(device, src) {
                   context = cl.createContext(device);
                   commandQueue = context.createCommandQueue(device, null);
                   program =  context.createProgram(src);
                   program.build(device, null, null);
                   for (kernelName in kernels) {
                       kernels[kernelName] = program.createKernel(kernelName);
                   }
                    return this;
                },

                initBuffer : function() {
                    if (ioBuffer != null)
                        ioBuffer.release();
                    ioBuffer = context.createBuffer(cl.MEM_READ_WRITE, nBytes,
                                                                 new Float32Array(originImg.data));
                    globalThreads = [width, height];
                    result = new Float32Array(nRGBA);
                    return this;
                },

                run : function(kernelName, args) {
                    kernels[kernelName].setArg(0, ioBuffer);
                    kernels[kernelName].setArg(1, new Int32Array([width]));
                    kernels[kernelName].setArg(2, new Int32Array([height]));
                    for (var i = 0; i < args.length; ++i){
                        kernels[kernelName].setArg(i + 3, args[i]);
                    }
                    commandQueue.enqueueNDRangeKernel(kernels[kernelName], globalThreads.length,[], globalThreads, []);
                    commandQueue.finish();
                    //commandQueue.enqueueReadBuffer(ioBuffer, true, 0 , nBytes, result);
                    return this;
                },

                convertArrayToBuffer: function(arr, type) {
                    switch(type) {
                        case "float":
                            var bytes = Float32Array.BYTES_PER_ELEMENT * arr.length;
                            buffers[buffers.length] = 
                                context.createBuffer(cl.MEM_READ_WRITE, bytes,
                                                     new Float32Array(arr));
                            break;
                        case "int":
                            var bytes = Int32Array.BYTES_PER_ELEMENT * arr.length;
                            buffers[buffers.length] =
                                context.createBuffer(cl.MEM_READ_WRITE, bytes,
                                                     new Int32Array(arr));
                            break;
                    }
                    return buffers[buffers.length -1];
                },

                ioBufferDuplicated: function() {
                    buffers[buffers.length] = 
                        context.createBuffer(cl.MEM_READ_WRITE, nBytes);
                    commandQueue.enqueueCopyBuffer(ioBuffer, 
                                                   buffers[buffers.length - 1],
                                                   0,
                                                   0,
                                                   nBytes);
                    return buffers[buffers.length - 1];
                },

                getResult : function() {
                    commandQueue.enqueueReadBuffer(ioBuffer, true, 0 , nBytes, result);
                    for (var i = 0; i < buffers.length; i ++)
                        buffers[i].release();
                    buffers = [];
                    return result;
                }
            };
            return executor;
        };

        var CLExecutorCPU = null, CLExecutorGPU = null;
        var Executor = null;

        var initCL = function() {
            /**
             * Check if WebCL is available and populate
             * platforms and devices. Type can be Default, CPU or GPU.
             *
             */
            if (cl === undefined) {
                throw new Error(NO_WebCL_FOUND);
            }
            cl.releaseAll();
            platforms = cl.getPlatforms();

            devices["cpu"]= platforms[0].getDevices(cl.DEVICE_TYPE_CPU);
            devices["gpu"] = platforms[0].getDevices(cl.DEVICE_TYPE_GPU);
            var src = loadKernel(clPath);
            if (devices["cpu"].length) {
                try {
                    CLExecutorCPU = new CLExecutor().init(devices["cpu"][0], src);
                } catch (e) {
                    console.log(e);
                    console.log("AI_WARNING: WebCL module failed to initialize CPU device");
                    CLExecutorCPU = null;
                }
            } else
                CLExecutorCPU = null;
            if (devices["gpu"].length) {
                try {
                    CLExecutorGPU = new CLExecutor().init(devices["gpu"][0], src);
                } catch (e) {
                    console.log(e);
                    console.log("AI_WARNING: WebCL module failed to initialize GPU device");
                    CLExecutorGPU = null;
                }
            }
            else
                CLExecutorGPU = null;
        };

        var updateImgInfo = function(imgData) {
            /* Create Buffer of WebCL need bytes in size, and cannot get throug
             * js api but this transfer imgData which from context.getImageData
             * API call and the format of pixel is RGBA and each element stand for
             * values of R or G or B or A, so each element is 8 bytes
             */
            nRGBA = imgData.width * imgData.height * 4;
            nBytes = nRGBA * Float32Array.BYTES_PER_ELEMENT;
            width = imgData.width;
            height = imgData.height;
            originImg = imgData;
        };

        /* API */
        var WebCLCommon = {

            init : function (type) {
                if (!initialized) {
                    initCL();
                    initialized = true;
                }
                switch (type) {
                    case "CPU":
                        if (CLExecutorCPU != null)
                            Executor = CLExecutorCPU;
                        else
                            Executor = null;
                        break;
                    case "GPU":
                        if (CLExecutorGPU != null)
                            Executor = CLExecutorGPU;
                        else
                            Executor = null;
                        break;
                    case "DEFAULT":
                    case "ALL":
                        if (CLExecutorCPU != null)
                            Executor = CLExecutorCPU;
                        else if (CLExecutorGPU != null)
                            Executor = CLExecutorGPU;
                        else
                            Executor = null;
                        break;
                }
                if (Executor == null) {
                    console.log(type + "do not support CL on the device");
                    //throw new Error(NO_DEVICE_FOUND);
                    return false;
                }
                return true;
            },

            loadData : function (imgData) {
                updateImgInfo(imgData);
                Executor.initBuffer();
            },

            run :  function (kernelName, args) {
                Executor.run(kernelName,args);
                return this;
            },

            getResult : function () {
                return Executor.getResult();
            },

            convertArrayToBuffer: function(arr, type) {
                return Executor.convertArrayToBuffer(arr, type);
            },

            ioBufferDuplicated: function() {
                return Executor.ioBufferDuplicated();  
            },

            /**
             * Return a device list according required type
             * ALL, CPU or GPU are valid inputs
             *
             * @returns {WebCLDevice[]} devices
             */
            getDevices : function () {
                return devices;
            },

            getCL : function() {
                return cl;
            },

            /**
             * Return all platforms available
             *
             * @return {WebCLPlatforms[]} platforms
             */
            getPlatforms : function () {
                return platforms;
            },
        };
        return WebCLCommon;
    });
} catch (e) {
    console.log(e);
    console.log("AI_WARNING: failed to initialize WebCL module");
}
})("psLib");
