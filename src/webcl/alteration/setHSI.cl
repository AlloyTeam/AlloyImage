/*
Copyright (c) 2014 Intel

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
