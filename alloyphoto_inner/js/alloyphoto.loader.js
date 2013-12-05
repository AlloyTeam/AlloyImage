var file = [
    "alloyphoto.base",
    "utils",
    "view",
    "event",
    "css"
];

for(var i = 0; i < file.length; i ++){
    document.write("<script type='text/javascript' src='../src/" + file[i] + ".js'></script>");
}
