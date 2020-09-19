// 두 수를 공백으로 구분지어 입력받은 후, 합을 구해 출력하는 코드

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = {};

rl.on('line', function(line){
    input = line.split(' ').map((el) => parseInt(el));
    rl.close();
})
.on('close', function() {
    console.log(input[0] + input[1]);
    process.exit();
});
