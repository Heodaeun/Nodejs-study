var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {  
  res.render('images');  // 루트 페이지로 접속시 images.pug 렌더링
});

var now = 1; 
var total;

fs.readdir('./public/images', function(err, files){
	total = files.length;
	console.log('total: ', total);
});


io.on('connection', function(socket){  // 웹페이지에 접속했을 때
	console.log('now: ', now, ',total: ', total);

	socket.emit('connect', now, total);
	// io.to(socket.id).emit('connect', 1);
	// io.sockets.emit('connect', now, total);
	console.log('user connected: ', socket.id);      

	
	socket.on('disconnect', function(){   // 웹페이지 접속이 끊어졌을 때
		console.log('user disconnected: '+ socket.id);
	});


	socket.on('back', function(page){	// 이전 페이지를 눌렀을 때
		now = page--;

	});

	socket.on('next', function(page){	// 다음 페이지를 눌렀을 때
		now = page++;

	});



	// socket.on('send message', function(name, text){  // 메세지를 보냈을 때 - 3 
	// 	var msg = name + ' : ' + text;
	// 	socket.name = name;
	// 	console.log(msg);
	// 	io.emit('receive message', msg);
	// });
});

http.listen(3000, function(){ 
	console.log('server on..');
});