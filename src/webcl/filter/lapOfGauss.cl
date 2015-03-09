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

