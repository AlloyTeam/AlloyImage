java -jar compiler.jar js\combined\alloyimage.js --js_output_file=js\combined\temp.js
del js\combined\alloyimage.js
rename js\combined\temp.js alloyimage.js
del js\combined\temp.js