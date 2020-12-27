const {performance} = require('perf_hooks');

const express = require('express');
const readline = require('readline');
const fs = require('fs');
const app = express();

var server = app.listen(4000, () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port 4000...");
});

var io = require('socket.io')(server); //Bind socket.io to our express server.
app.use(express.static('public')); //Send index.html page on GET /


// read vcd file
data = fs.readFileSync('out.vcd', 'utf-8');
lines = data.split('\n');   //각 줄이 배열로 들어가 있는 형태

// #number이 500을 넘기는지 확인
var TENto1 = false;
for (var line = 0; line < lines.length; line++){
    if(lines[line] == '#200'){
        TENto1 = true;
    }
}

// parsing vcd filel to WaveJSON
var WaveJSON      = { signal : [], foot : { tock: 0 } };
var part_WaveJSON = { signal : [], foot : { tock: 0 } };
var nameJSON = {};  // 모든 {char : id}이 든 JSON 형태

var check = false;  //#number check
var this_num, old_num = -1, num;
var this_line;
var wave_name;    //wave_name: WaveJSON의 data에 들어갈 데이터(wave가 b로 시작할 경우)
var waveData;   // waveData: WaveJSON의 wave에 들어갈 데이터

var array_ = [];    //wave에 .을 추가하기 위해 변경되었는지 체크하는 배열 (변경되면 waveData, 아니면 0)

var old_from = 0;   //사용자가 이전에 입력한 from 값을 저장하는 변수

function Parsing_WaveJSON(){

    console.log('TENto1 : ', TENto1);

    for (var line = 0; line < lines.length; line++) {   //한 줄씩 차례대로 읽음
        this_line = lines[line];    //한 줄 읽음
    
        // 1. $var
        if(this_line.slice(0, 4) == '$var'){
            var var_line = this_line.split(' ');
            var char = var_line[3];
            var id = var_line[4];
            
            nameJSON[char] = id;
            WaveJSON['signal'].push({"name" : id, "wave" : '', "data" : ''}); //WaveJSON에 var 저장
            part_WaveJSON['signal'].push({"name" : id, "wave" : '', "data" : ''}); //WaveJSON에 var 저장
    
        // 2. #number
        }else if(this_line == "#0"){ //#초기값 설정 (array_가 없음)
            this_num = Number(this_line.slice(1));
            num = this_num - old_num;
    
            check = true;   // 이후로, read data
    
        }else if(check == true){    //#0이 아닌 경우
            readNumber();   //total WaveJSON은 공통적으로 생성

            // #number >= 300
            // if(TENto1 == true){
            //     if(this_line.slice(0,1) == '#' || this_line == ''){    //#number인 경우 + 마지막인 경우
            //         if(this_line.slice(-1) % 10 == 0 || this_line == ''){  //10의 배수인 경우 + 마지막인 경우
            //             console.log('array: ', array_);
            //             ////채우는 중
            //         }
            //     }else{  //wave인 경우
            //         this_line.slice(0,1) == '$' ? null : insertWaveJSONData(part_WaveJSON);
            //     }
            // }
        }
    }
    // 파일 저장
    fs.writeFileSync('WaveJSON.json', JSON.stringify(WaveJSON)); 
    console.log('part: ', part_WaveJSON);
    // fs.writeFileSync('part_WaveJSON.json', JSON.stringify(part_WaveJSON)); 


}


function readNumber(){
    var number = this_line.slice(-1);

    if(this_line.slice(0,1) == '#' || this_line == ''){    //#number인 경우 (this_line == '' 마지막인 경우)
        var rpt = ".".repeat(num);

        for(k in array_){   //k = array_의 n번째 (=signal[k])
            n = array_[k];  //n = array_의 k번째 data

            if(typeof(n) == 'number'){  //n(data)이 0인 경우 (=값에 변화가 없는 경우)
                WaveJSON.signal[k].wave += rpt; // 생략된 number 수만큼 '.'추가
                ////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////
                if(TENto1 == true && number % 10 == 0){ // number 10의 단위로 저장함
                    var len = WaveJSON.signal[k].wave.length;   // WaveJSON에서 최근 값을 탐색

                    while(WaveJSON.signal[k].wave[len] == '.'){
                        // console.log(WaveJSON.signal[k].wave[--len]);
                    }
                    // console.log('\n');
                }
            
                // (TENto1 == true) && (number % 10 == 0) ? checkWaveisDot(part_WaveJSON, number, number+1) : null;
                ////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////
            }else{  // n = '0' or '1' or '2'
                rpt2 = ".".repeat(num - 1) + n;
                WaveJSON.signal[k].wave += rpt2;
                (TENto1 == true) && (number % 10 == 0) ? part_WaveJSON.signal[k].wave += n : null;
            }
        }
        array_ = new Array(); // 모두 null [ <n empty items> ] (초기화)

        for(i=0; i<WaveJSON.signal.length; i++){
            array_[i] = 0;  // 값을 모두 0으로 채움
        }

        // 값 변경
        old_num = this_num;
        this_num = this_line == '' ? old_num + 1 : Number(this_line.slice(1));  //this_num = #"number"
        num = this_num - old_num;

    }else{  // wave값인 경우,
        this_line.slice(0,1) == '$' ? null : insertWaveJSONData(WaveJSON);
    }
}


function insertWaveJSONData(JSON){
    // b로 시작하는 경우
    if(this_line.slice(0,1) == 'b' || this_line.slice(0,1) == 'B'){
        binary = this_line.slice(1,-2);
        wave_name = parseInt(binary, 2).toString(16); // 2진수 -> 16진수

        insertWaveData(1, JSON);
    //0 or 1 or .인 경우
    }else{        
        insertWaveData(0, JSON);
    }
}

function insertWaveData(ck, JSON){
    find_name = this_line.slice(-1);

    for(i in JSON.signal){  //i : n번째
        j = JSON.signal[i]; //j : i번째 JSON Data
        if(j.name == nameJSON[find_name]){

            waveData = ck == 0 ? this_line.slice(0,-1) : '2'; //waveData
            waveData = waveData.split(" ").join("");    //공백 제거
            array_[i] = waveData;

            ck == 1 ? JSON.signal[i].data += wave_name + ' ' : null;
        }
    }
}

function checkWaveisDot(JSON, from, to){    //from부터 to까지 WaveJSON을 slice함.
    for(i = 0; i < JSON.signal.length; i++){ // WaveJSON.signal[i]을 차례대로 읽음
        var tmp_wave = JSON.signal[i].wave[from];
        // console.log('\n\ninit wave: ', WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1));
    
        tmp = from;
    
        // (1) wave[from]이 '.''인 경우
        if(tmp_wave == '.'){
            while(tmp_wave == '.' && tmp > -1){
                tmp_wave = WaveJSON.signal[i].wave[--tmp];
            }
            ChangeData(1, tmp_wave, from, to);
    
            WaveJSON.signal[i].wave = WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1);
            JSON.signal[i].wave = WaveJSON.signal[i].wave.replace('.', tmp_wave);
            // console.log('slicing: ', WaveJSON.signal[i]);
    
        // (2) wave[from]이 '.'이 아닌 경우
        }else{
            ChangeData(0, tmp_wave, from, to);
            JSON.signal[i].wave = WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1);
        }
    }
}

function ChangeData(chk, tmp_wave, from, to){   //chk=0 : wave = 0 or 1 or 2 / chk=1: wave = '.'
    // WaveJSON.signal[i].data 변경하는 코드
    if(tmp_wave == '2'){
        var order = 0;
        var data = '';
        for(l = 0; l < from; l++){
            if(WaveJSON.signal[i].wave[l] == '2'){
                order += 2;
            }
        }
        // console.log('order: ', order);
        // console.log('order data: ', WaveJSON.signal[i].data[order]);
        chk == 0 ? null : order = order-2;
        data += WaveJSON.signal[i].data[order] + ' ';

        for(l = from; l <= to; l++){
            // console.log('l: ',l);
            // console.log(WaveJSON.signal[i].wave[l]);

            if(WaveJSON.signal[i].wave[l] == '2'){
                // console.log('==2');
                order += 2;
                data += WaveJSON.signal[i].data[order] + ' ';
            }
        }
        WaveJSON.signal[i].data = data;
        // WaveJSON.foot.tock = from;
    }
}


var start = performance.now();
console.log("시작한 시간: ",start);

Parsing_WaveJSON();

io.on('connection', (socket) => {

    console.log("a user connected: ", socket.id); //show a log as a new client connects.
    // console.log('WaveJSON: ', WaveJSON);


    // read html file
    var head = fs.readFileSync('public/head.html', 'utf8');
    var foot = fs.readFileSync('public/foot.html', 'utf8');
    var html = head + JSON.stringify(WaveJSON) + foot;
    fs.writeFileSync('public/index.html', html);    //파일 저장

    // slicing wave data
    socket.on('send_button', (from, to) => {
        console.log('button is pushed. (from: ', from, ', to: ', to, ')');
        var new_from = parseInt(from);
        from = parseInt(from) - old_from;
        to = parseInt(to) - old_from;
        
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////

        for(i = 0; i < WaveJSON.signal.length; i++){ // WaveJSON.signal[i]을 차례대로 읽음
            var tmp_wave = WaveJSON.signal[i].wave[from];
            // console.log('\n\ninit wave: ', WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1));

            tmp = from;

            checkWaveisDot(WaveJSON, from, to);
        }
        
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////

        WaveJSON.foot.tock = new_from;
        // console.log('wavejson: ', WaveJSON);
        fs.writeFileSync('sliced_WaveJSON.json', JSON.stringify(WaveJSON));

        html = head + JSON.stringify(WaveJSON) + foot;
        fs.writeFileSync('public/index.html', html);    // 파일 저장

        io.emit('reload');

        old_from = from;
    });


    socket.on('reset_button', () => {
        old_from = 0;

        // fs.readFile(TENto1 == true ? 'part_WaveJSON.json' : 'WaveJSON.json', 'utf8', function (err, data) {
        fs.readFile('WaveJSON.json', 'utf8', function (err, data) {
            if(err) throw err;
            WaveJSON = JSON.parse(data);
            
            html = head + JSON.stringify(WaveJSON) + foot;
            fs.writeFileSync('public/index.html', html);    //파일 저장

            io.emit('reload');
        });
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


elapsed = performance.now();
console.log("소요된 시간: milliseconds" , elapsed - start);

