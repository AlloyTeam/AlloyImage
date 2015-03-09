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
