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
