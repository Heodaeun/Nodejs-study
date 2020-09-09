var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('chat'); //루트 페이지로 접속시 chat.pug 렌더링함
});

var count = 1;

io.on('connection', function(socket){   
    // (1) 채팅방에 접속했을 때 (웹 페이지 접속시 자동으로 이벤트 실행)
    console.log('user connected: ', socket.id); //사용자 id
    var name = "익명" + count++;
    socket.name = name; //익명n
    io.to(socket.id).emit('create name', name); //'create name'이벤트를 발생시켜 클라이언트에게 전송
    //io.to(socket.id).emit : 서버가 해당 socket id에만 이벤트를 전달함
    io.emit('new_connect', name);   //io.emit : 사용자 전부에게 전달

    // (2) 채팅방 접속이 끊어졌을 때
    socket.on('disconnect', function() {
        //서버 콘솔에 나간 사용자를 찍음
        console.log('user disconnected: '+ socket.id + ' ' + socket.name);
        io.emit('new_disconnect', name);    //to.emit : 사용자 전부에게 전달
    });

    // (3) 메시지를 보냈을 때 - data(name, text) 받음
    socket.on('send message', function(name, text){
        var msg = name + ' : ' + text;
        //닉네임을 바꿨을 때
        if(name != socket.name) 
            io.emit('change_name', socket.name, name);
        socket.name = name;
        console.log(msg);
        io.emit('receive message', msg);    //msg(name : text)데이터를 클라이언트로 'receive message'이벤트를 보냄
    });
})

http.listen(3000, function(){   //3000번 포트로 서버 연결
    console.log('server on..');
})
