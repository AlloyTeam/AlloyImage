#!/bin/sh

root_path="../"
combined_path="../combined"
cl_files=`find $root_path -name "kernel.cl"`
if [ -n "$cl_files" ]; then
#find $root_path -name "kernel.cl" | xargs  rm
rm $cl_files
fi
find $root_path -name "*.cl" | xargs cat > $combined_path/kernel.bak
mv $combined_path/kernel.bak $combined_path/kernel.cl
