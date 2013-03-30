<?php
$isCom = $_GET['c'];

$files = scandir("js/module/");
$contents = file_get_contents("js/alloyimage.base.js");
foreach($files as $file){
    if(preg_match("/[^\.]+\.js$/",$file)){
        $contents .= file_get_contents("js/module/".$file);
    }
}
$wfile = fopen("js/combined/alloyimage.js","w+");
if(fwrite($wfile,$contents)){
    echo "combined OK <br />";
    if($isCom == "c"){
        if($m = exec("mm")){
            echo "Compile Completed";
        }else{
            (shell_exec("`java -jar compiler.jar js\combined\alloyimage.js --js_output_file=js\combined\alloyimage2.js`"));
            echo "<span style='color:red'>error occured with compiling</span>";
        }
    }else
        echo "combined with non-compile OK";
}
