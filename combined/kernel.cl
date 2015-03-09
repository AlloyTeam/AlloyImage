__kernel void darkCorner(
            __global float* io,
            const    int    width,
            const    int    height,
            const    int    r,
            const    int    lastlevel)
{
    uint ix = get_global_id(0);
    uint iy = get_global_id(1);
    uint reali = iy * width + ix;
    float4 temp = (float4)(io[reali * 4], io[reali * 4 + 1], io[reali * 4 + 2], io[reali * 4 + 3]); 
    float2 middlePoint = (float2)(width * 2 / 3.0, height / 2.0);
    float2 currPoint = (float2)(ix, iy);

    float maxdistance = length(middlePoint);
    float startdistance = maxdistance * (1 - r / 10.0);
    float dis = distance(currPoint, middlePoint);

    float currbilv = (dis - startdistance) / (maxdistance - startdistance);
    if (currbilv < 0) return;

    /* according to js version f(currBilv, 0 , 0.02, 0.3, 1)*/
    float bilv = 3 * 0.02 * currbilv * (1 - currbilv) * (1 - currbilv)
                 + 3 * 0.3 * currbilv * currbilv * (1 - currbilv) 
                 + currbilv * currbilv * currbilv;
    temp -= bilv * lastlevel * temp / 255;
    io[reali * 4] = temp.x;
    io[reali * 4 + 1] = temp.y;
    io[reali * 4 + 2] = temp.z;
}
__kernel void embossment(
__global float*  output,
const    uint    width,
const    uint    height,
__global float*  input)
{
    uint ix = get_global_id(0);
    uint iy = get_global_id(1);
    uint i = (iy * width + ix) * 4;

    if (i >= 0 && i < (width * height * 4 - 4)) {
        int row = iy;
        int col = ix;
        int A = ((row - 1) *  width + (col - 1)) * 4;
        int G = (row + 1) * width * 4 + (col + 1) * 4;
        if (row == 0 || col == 0 || row + 1 >= height || col + 1 >= width)
            return;
        output[i+0] = input[A+0] - input[G+0] + 127.5;
        output[i+1] = input[A+1] - input[G+1] + 127.5;
        output[i+2] = input[A+2] - input[G+2] + 127.5;
        //output[i+4] = input[i+4];
    }
}


__kernel void gaussBlurX(
    __global float* io,
    const    int    width,
    const    int    height,
    const    int    radius,
    const    float  sigma,
    __global  float* gaussMatrix,
    __global float* backup)
{
    int ix = get_global_id(0);
    int iy = get_global_id(1);
    int i = (iy * width + ix) * 4;
    int ii;
    int k;
    float gaussSum = 0;
    float r = 0; float g = 0; float b = 0; float a = 0;
    for(int j = -radius; j <= radius; j++) {
        k = ix + j;
        if (k >= 0 && k < width) {
            ii = (iy * width + k) * 4;
            r += backup[ii] * gaussMatrix[j + radius];
            g += backup[ii + 1] * gaussMatrix[j + radius];
            b += backup[ii + 2] * gaussMatrix[j + radius];
            gaussSum += gaussMatrix[j + radius];
        }
    }
    io[i] = r / gaussSum;
    io[i + 1] = g / gaussSum;
    io[i + 2] = b / gaussSum;
}
__kernel void gaussBlurY(
    __global float* io,
    const    int    width,
    const    int    height,
    const    int    radius,
    const    float  sigma,
    __global  float* gaussMatrix,
    __global float* backup)
{
    int ix = get_global_id(0);
    int iy = get_global_id(1);
    int i = (iy * width + ix) * 4;
    int ii;
    int k;
    float gaussSum = 0;
    float r = 0; float g = 0; float b = 0; float a = 0;

    for(int j = -radius; j <= radius; j++) {
        k = iy + j;
        if(k >= 0 && k < height) {
          ii = (k * width + ix) * 4;
          r += backup[ii] * gaussMatrix[j + radius];
          g += backup[ii + 1] * gaussMatrix[j + radius];
          b += backup[ii + 2] * gaussMatrix[j + radius];
          gaussSum += gaussMatrix[j + radius];
        }

    }
    io[i] = r / gaussSum;
    io[i + 1] = g / gaussSum;
    io[i + 2] = b / gaussSum;

}
__kernel void borderline(
            __global float* io,
            const    int    width,
            const    int    height,
            const    int    start,
            __global int*   template,
            __global float* backup)
{
    int ix = get_global_id(0);
    int iy = get_global_id(1);
    int realI = (iy * width + ix) * 4; 

    if (ix == 0 || iy == 0 || ix == width-1 || iy == height-1) {
        // take 256 as undefined in the JavaScript.
        io[realI + 0] = 256;
        io[realI + 1] = 256;
        io[realI + 2] = 256;
        io[realI + 3] = 256;
        return;
    }

    if (ix >= width || iy >= height)
        return;

    // 3 means R,G,B; 9 means (2*start+1)*(2*start+1)
    float pixelArr[3*9] = {0};
    for(int k = start;k <= -start;k ++){
        int currRow = iy + k;
        for(int kk = start;kk <= -start;kk ++){
            int currCol = ix + kk;
            int currI = (currRow * width + currCol) * 4;
            for(int j = 0;j < 3;j ++){
                int tempI = currI + j;
                if (tempI <= (width*height - 1)*4) {
                    int index = (k - start) * (2 * (-start) + 1) + (kk - start);
                    pixelArr[j*9 + index] = backup[tempI];
                }
            }
        }
    }           
   
    for (int j = 0; j < 3; j++) {
        io[realI + j] = 0;
        for (int i = 0; i < 9; i ++) {
            io[realI + j] +=  pixelArr[j*9 + i] * template[i];
        }
    }
    io[realI + 3] = 256;
}

float getLk(float x, int k, __global float* xArr, int num)
{
    float omigaXk = 1;
    float omigaX = 1;
    for(int i = 0; i < num; i++) {
        if (i != k) {
            omigaXk *= xArr[k] - xArr[i];
            omigaX *= x - xArr[i];
        }
    }
    float lk = omigaX / omigaXk;
    return lk;
}

float lagrange(__global float* xArr, __global float* yArr, float x, int num)
{
    float L = 0;
    for (int k = 0; k < num; k++) {
        float lk = getLk(x, k, xArr, num);
        L += yArr[k] * lk;
    }
    return L;
}


__kernel void curve (
    __global  float* input,
    const     int    width,
    const     int    height,
    __global  float* arg0,
    __global  float* arg1,
    __global  int*   indexOfArr,
    const     int    num)
{
    int ix = get_global_id(0);
    int iy = get_global_id(1);
    int realI = iy * width + ix;
    
    
    for(int j = 0; j < 3; j++) {
        if (indexOfArr[j] == 0) continue;
        input[realI * 4 + j] = lagrange(arg0, arg1, input[realI * 4 + j], num);
    }

}
__constant float PI = 3.141592653589793;

/*void RGBToHSI(float R, float G, float B, float4* hsiObj) {
   float theta = ((R - G  + R - B) / 2.0) / sqrt((R - G) * (R - G) + (R - B) * (G - B)) || 0;
   hsiObj.x = B > G ? (2 * PI - theta) : theta;
   float S, I;

   if (R + G + B > 0) {
        hsiObj.y = 1 - 3 * min(min(R,G),B) / (R + G + B);    
   } else {
        hsiObj.y = 0;
   }

   hsiObj.z = (R + G + B) / 3;
   if (hsiObj.x > 2 * PI) hsiObj.x = 2 * PI;
   if (hsiObj < 0) hsiObj.x = 0;
}

void func(float4* hsiObj, int rColor, float arg0, float arg1, float arg2, 
          float arg3, __global int* indexOf, int color) {
    if (!indexOf[color] ) return;

    if(arg3) {
        (*hsiObj).x = arg0;
        (*hsiObj).y = arg1;
        (*hsiObj).z += arg2;        
    } else {
        (*hsiObj).x += arg0;
        (*hsiObj).y += arg1;
        (*hsiObj).z += arg2;
    }
}

float HSIToRGB(float4 hsiObj) {
   float4 rgbObj;
   if(hsiObj.x< 0) {
        hsiObj.x = fmod(hsiObj.x, 2 * PI);
        hsiObj.x += 2 * PI;   
    } else {
        hsiObj.x = fmod(hsiObj.x, 2 * PI);
    }

    if (hsiObj.x <= PI * 2 / 3) {
        rgbObj.z = hsiObj.z * (1 - hsiObj.y);
        rgbObj.x = hsiObj.z * (1 + hsiObj.y * cos(hsiObj.x) / cos(PI/3 - hsiObj.x));
        rgbObj.y = 3 * hsiObj.z - (rgbObj.x + rgbObj.z);
    } else if (hsiObj.x <= PI * 4/3) {
        hsiObj.x = hsiObj.x - PI * 2 / 3;

        rgbObj.x = hsiObj.z * (1 - hsiObj.y);
        rgbObj.y = hsiObj.z * (1 + hsiObj.y * cos(hsiObj.x) / cos(PI / 3 - hsiObj.x));
        rgbObj.z = 3 * hsiObj.z - (rgbObj.y + rgbObj.x);
    } else {
      hsiObj.x = hsiObj.x - PI * 4 / 3;
      
      rgbObj.y = hsiObj.z * (1 - hsiObj.y);
      rgbObj.z = hsiObj.z * (1 + hsiObj.y * cos(hsiObj.x) / cos(PI / 3 - hsiObj.x));
      rgbObj.x = 3 * hsiObj.z - (rgbObj.y + rgbObj.z);
    } 
    return rgbObj;
}*/

__kernel void setHSI(
    __global float* ioBuffer,
    const    int    width,
    const    int    height,
    const    float    arg0,
    const    float    arg1,
    const    float    arg2,
    const    int      arg3,
    __global int*     indexOf)
{
    int ix = get_global_id(0);
    int iy = get_global_id(1);
    int i = (iy * width + ix) * 4;


    float d30 = PI / 6;
    float d60 = PI / 3;

    if(i>= 0 && i < width * height * 4){
        /* RGBToHSI */
        float4 hsiObj;
        float R = ioBuffer[i];
        float G = ioBuffer[i + 1];
        float B = ioBuffer[i + 2];
        float theta = ((R - G  + R - B) / 2.0) / sqrt((R - G) * (R - G) + (R - B) * (G - B)) || 0;
        theta = acos(theta);
        hsiObj.x = B > G ? (2 * PI - theta) : theta;
        if (R + G + B > 0) {
            hsiObj.y = 1 - 3 * min(min(R,G),B) / (R + G + B);    
        } else {
            hsiObj.y = 0;
        }

        hsiObj.z = (R + G + B) / 3;
        if (hsiObj.x > 2 * PI) hsiObj.x = 2 * PI;
        if (hsiObj.x < 0) hsiObj.x = 0;
        /* EndOf RGBToHSI */
        
        float h = hsiObj.x + d30;
        int color = floor(h / d60);

        
        /* func */
        if (!indexOf[color % 6] ) return;
        if(arg3) {
            hsiObj.x = arg0;
            hsiObj.y = arg1;
            hsiObj.z += arg2;        
        } else {
            hsiObj.x += arg0;
            hsiObj.y += arg1;
            hsiObj.z += arg2;
        }
        /* EndOf func */

        if(hsiObj.y > 1) hsiObj.y = 1;
        if (hsiObj.y < 0) hsiObj.y = 0;

        /* HSIToRGB */
        float4 rgbObj;
        if(hsiObj.x< 0) {
            hsiObj.x = fmod(hsiObj.x, 2 * PI);
            hsiObj.x += 2 * PI;   
        } else {
            hsiObj.x = fmod(hsiObj.x, 2 * PI);
        }

        if (hsiObj.x <= PI * 2 / 3) {
            rgbObj.z = hsiObj.z * (1 - hsiObj.y);
            rgbObj.x = hsiObj.z * (1 + hsiObj.y * cos(hsiObj.x) / cos(PI/3 - hsiObj.x));
            rgbObj.y = 3 * hsiObj.z - (rgbObj.x + rgbObj.z);
        } else if (hsiObj.x <= PI * 4/3) {
            hsiObj.x = hsiObj.x - PI * 2 / 3;

            rgbObj.x = hsiObj.z * (1 - hsiObj.y);
            rgbObj.y = hsiObj.z * (1 + hsiObj.y * cos(hsiObj.x) / cos(PI / 3 - hsiObj.x));
            rgbObj.z = 3 * hsiObj.z - (rgbObj.y + rgbObj.x);
        } else {
          hsiObj.x = hsiObj.x - PI * 4 / 3;
          
          rgbObj.y = hsiObj.z * (1 - hsiObj.y);
          rgbObj.z = hsiObj.z * (1 + hsiObj.y * cos(hsiObj.x) / cos(PI / 3 - hsiObj.x));
          rgbObj.x = 3 * hsiObj.z - (rgbObj.y + rgbObj.z);
        } 
        /* EndOf func */

        ioBuffer[i] = rgbObj.x;
        ioBuffer[i + 1] = rgbObj.y;
        ioBuffer[i + 2] = rgbObj.z;

    }
}
