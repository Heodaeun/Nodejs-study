// 웹서버를 통한 HEllo! Node.js!

var server = require('http'); //모듈 http를 가져옴

server.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Hello node.js!\n");  //출력값
}).listen(3000, 'localhost');

console.log('Server running at http://localhost:3000/');
