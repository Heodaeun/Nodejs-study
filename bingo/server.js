var express  = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));    //views 폴더 참조
app.set('view engine', 'pug');  //뷰엔진으로 pug를 사용
app.use(express.static(path.join(__dirname, 'public')));    //파일은 public폴더에서 사용

app.get('/', function(req, res){    //public/javascripts/main.pug
    res.render('main', {title: '온라인 빙고 게임',
    username: req.query.username });
});

// 전역변수로 선언
var users = {}; //접속한 사용자를 저장하는 객체
var user_count = 0; //접속한 사용자의 수
var turn_count = 0; //누구의 차례인지 기록하는 변수

// connection - 웹피이지 접속시 자동으로 실행
io.on('connection', function(socket){
    console.log('user connected : ', socket.id);

    // (1) 사용자가 접속했을 때 (data : username input)
    //(클라이언트 페이지에서 connect이벤트가 발생하면 join으로 데이터를 넘겨줌)
    socket.on('join', function(data){
        var username = data.username;
        socket.username = username; //소켓의 사용자 이름을 설정함

        users[user_count] = {}; //생성
        users[user_count].id = socket.id;   //(ex)b-GdiB1JkWcaY8LiAAAA
        users[user_count].name = username;
        users[user_count].turn = false;
        user_count++;   //user_count는 전역변수

        io.emit('update_users', users, user_count); 
        //새로운 사용자가 접속했으니 클라이언트에게 사용자 목록을 업데이트하게 함
    });

    // (2) 게임 시작버튼을 눌렀을 때
    // data : username
    socket.on('game_start', function(data){
        //braodcast: 자신을 제외한 모든 클라이언트들에게 전송
        socket.broadcast.emit("game_started", data);
        
        users[turn_count].turn = true;  //게임 시작 버튼을 누른 사람이 먼저 시작함

        io.emit("update_users", users); //해당 사용자의 순서를 업데이트함
    });

    // (3) 숫자 선택했을 때
    socket.on('select', function(data){
        socket.broadcast.emit("check_number", data);    //자신을 제외한 클라이언트들에게 전송

        users[turn_count].turn = false; //현재 사용자의 턴을 종료함
        turn_count++;

        if(turn_count >= user_count){
            turn_count = 0; //차례가 한바퀴 돌면 count 초기화
        }
        users[turn_count].turn = true;  //다음 사람 차례 

        io.sockets.emit('update_users', users); 
        //다음 사용자의 순서를 알려주기 위해 이벤트 전송함
    });

    // (4) 접속이 끊어졌을 때
    socket.on('disconnect', function(){
        console.log('user disconnected : ', socket.id, ' ', socket.username);
        for(var i = 0; i < user_count; i++){
            if(users[i].id == socket.id)
                delete uesrs[i];    // 나간 사람의 데이터를 삭제함
        }
        user_count--;
        io.emit('update_users', users, user_count);
        //사용자가 나갔으므로 상대방도 알 수 있도록 유저 리스트를 업데이트함
    });
});

http.listen(3000, function() {
    console.log('server on!');
})