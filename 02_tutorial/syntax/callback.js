// function a(){
//   console.log('A');
// }

//익명함수 (함수가 값임)
var a = function (){
  console.log('A');
  // var fs = require('fs');
  // fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
  //   console.log(result);
  });
}

//함수가 끝났으니 다음 일을 하세요! 알려줌
//callback : a가 가리키는 함수를 가짐
function slowfunc(callback){  //엄청 느리게 동작하는 함수
  console.log('1');
  callback(); //console.log('A')가 실행됨
  console.log('2')
}

slowfunc(a);
