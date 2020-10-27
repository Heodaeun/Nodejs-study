// import { WaveJSON } from './parsing.js';
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

// read json file
var dataBuffer = fs.readFileSync('WaveDrom.json');
var dataJSON = dataBuffer.toString();
var WaveJSON = JSON.parse(dataJSON);

// read html file
var head = fs.readFileSync('public/head.html', 'utf8');
var foot = fs.readFileSync('public/foot.html', 'utf8');

var html = head + JSON.stringify(WaveJSON) + foot;
fs.writeFileSync('public/index.html', html);    //파일 저장

app.get('/', function(req, res){
    res.send('root');
})

io.once('connection', (socket) => {
    console.log("a user connected: ", socket.id); //show a log as a new client connects.
    console.log('WaveJSON: ', WaveJSON);
    io.emit('send_WaveDrom', WaveJSON);
    console.log('send wave');

    socket.on('first', () => {
        console.log('init');
        io.emit('send_WaveJSON', WaveJSON);
        console.log('send');
    });
    
    
    // input wavedrom data
    rl.on('line', function(line){
        input = line.split(' ');
        console.log('input: ', input);

        var exist = false;  // json 속에 입력한 name이 있는지 없는지 확인하는 변수

        // (1) 삭제
        if(input[0] == 'delete'){ 
            for(i in WaveJSON.signal){
                if(WaveJSON.signal[i].name == input[1]){
                    delete WaveJSON.signal[i];
                    break;
                }
            }
            WaveJSON.signal = WaveJSON.signal.filter(function(x) { return x != null }); // null 삭제
        }else{
            for(i in WaveJSON.signal){  // json속에 name이 있는지 확인
            // (2) 추가
                if(WaveJSON.signal[i].name == input[0]){ // name이 있을 경우
                    WaveJSON.signal[i].wave += input[1]; //해당 name에 입력한 wave추가
                    exist = true;
                    break;
                }
            }

            // (3) 생성
            if(exist == false){ // json에 입력한 name이 없을 경우
                WaveJSON['signal'].push({"name":input[0], "wave":input[1]});
            }
        }
        fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));    // 파일 저장
        console.log(WaveJSON);

        // fs.writeFileSync('public/index2.html', JSON.stringify(html));    // 파일 저장

        io.emit('send_WaveDrom', WaveJSON);
    });

    // slicing wave data
    socket.on('button', (from, to) => {
        console.log('button is pushed');
        console.log('from: ', from, ', to: ', to);

        for(i=0; i < WaveJSON.signal.length; i++){
            console.log(WaveJSON.signal[i].wave);
            wave = WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1);
            console.log('-> slicing: ', wave);
            WaveJSON.signal[i].wave = wave;
            console.log(WaveJSON);
        }
        
        fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));

        io.emit('reload');
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});
