// main.js
var fs = require('fs');
 
// 파일 읽기(동기적)
try {
	var data = fs.readFileSync('notexist.txt', 'utf8'); // 파일이 없는데 읽으려 함
	console.log(data);
} catch (err) {
    console.log(err);
}