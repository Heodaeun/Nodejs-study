// 파일을 읽어서 Hello! Node.js! 출력하기

var fs = require('fs');

fs.readFile('./hello.txt', encoding='utf-8', function(err, data){
  if(err){
    throw err
  }

  console.log(data + "Node.js!");
})
