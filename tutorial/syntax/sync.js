//readFile & readFileSync

var fs = require('fs');

//readFileSync(동기) - syntax바깥에서 명령을 줄 것이기 때문에 syntax/sample.txt로 작성함
// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt', 'utf8');
// console.log(result);
// console.log('C');

//readFile(비동기)
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
  console.log(result);
});
console.log('C');
