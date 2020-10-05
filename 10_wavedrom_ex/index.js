const express = require('express');
const readline = require('readline');
const fs = require('fs');
const rl = readline.Interface({
    input: process.stdin,
    output: process.stdout
});

const app = express();
var server = app.listen(4000, () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port 4000...");
})

var io = require('socket.io')(server); //Bind socket.io to our express server.
app.use(express.static('public')); //Send index.html page on GET /

io.once('connection', (socket) => {
    console.log("a user connected: ", socket.id); //show a log as a new client connects.

    rl.on('line', function(line){
        console.log('line: ', line);
        input = line.split(' ');
        console.log('input: ', input);

        //json 읽어오기
        var dataBuffer = fs.readFileSync('WaveDrom.json');
        var dataJSON = dataBuffer.toString();
        var drom = JSON.parse(dataJSON);

        var exist = false;  // json 속에 입력한 name이 있는지 없는지 확인하는 변수

        // (1) 삭제
        if(input[0] == 'delete'){ 
            for(i in drom.signal){
                if(drom.signal[i].name == input[1]){
                    delete drom.signal[i];
                    break;
                }
            }
            drom.signal = drom.signal.filter(function(x) { return x != null }); // null 삭제
        }else{
            for(i in drom.signal){  // json 속에 name이 있는지 확인
            // (2) 추가
                if(drom.signal[i].name == input[0]){ // name이 있을 경우
                    drom.signal[i].wave += input[1]; //해당 name에 입력한 wave추가
                    exist = true;
                    break;
                }
            }
            // (3) 생성
            if(exist == false){ // json에 입력한 name이 없을 경우
                drom['signal'].push({"name":input[0], "wave":input[1]});
            }
        }

        fs.writeFileSync('WaveDrom.json', JSON.stringify(drom));    // 파일 저장
        console.log(drom);

        io.emit('send_WaveDrom', drom);

        // wave += line;
        // console.log('wave: ', wave + socket.id);
        // input = line.split(' ');
        // io.emit('sendWave', wave);
        // io.emit('sendWave', line);
        // line = '';
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});
