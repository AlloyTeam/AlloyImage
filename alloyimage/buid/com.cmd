java -jar compiler.jar ..\combined\alloyimage.js --js_output_file=..\combined\temp.js
del ..\combined\alloyimage.js
rename ..\combined\temp.js alloyimage.js
del ..\combined\temp.js
