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


