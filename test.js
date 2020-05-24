const fs = require("fs");
var now = new Date()
var nowStr = now.getFullYear()+'-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes()
fs.writeFile('./error.txt','-' + nowStr + '\n',{flag:'a',encoding:'utf-8',mode:'0666'},function(){

})