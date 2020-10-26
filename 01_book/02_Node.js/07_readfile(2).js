// main.js
var fs = require('fs');
 
var data = 'fs.writeFile test';
 
fs.writeFile('text1.txt', data, 'utf8', function(err) {
    console.log('비동기적 파일 쓰기 완료');
});
 
 
fs.writeFileSync('text2.txt', data, 'utf8');
console.log('동기적 파일 쓰기 완료');