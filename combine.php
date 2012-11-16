<?php
define(BASEDIR,"js\\module\\");
$fileName = scandir(BASEDIR);
//print_r($fileName);
$fileContext = file_get_contents("js\\psLib.js");
$com_file = fopen("js\\combined\\psLib_com.js","w");
if(fwrite($com_file,$fileContext)){
    echo "OK<br />";
}else echo "Error<br />";
$whiteSpace = "\n\n";
foreach($fileName as $val){
    //fwrite($com_file,$whiteSpace);

    $jsPreg = "|[^\.]*\.js$|";
    if(preg_match($jsPreg,$val)){
        $fileContext = file_get_contents(BASEDIR.$val);
        if(fwrite($com_file,$fileContext)){
            echo "OK<br />";
        }else echo "Error<br />";
    }

}
fclose($com_file);
