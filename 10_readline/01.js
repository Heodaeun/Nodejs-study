//node.js 입력 받기 기본 형태
//한 줄 입력 받기

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("line", function(line){
    console.log("Hello !", line);
}).on("close", function(){
    process.exit();
});

