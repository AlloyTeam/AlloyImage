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
