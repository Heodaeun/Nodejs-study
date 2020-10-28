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


// parsing json file
var WaveJSON = { signal : [] };
var nameJSON = {};  // 모든 {char : id}이 든 JSON 형태

data = fs.readFileSync('out.vcd', 'utf-8');
lines = data.split('\n');   //각 줄이 배열로 들어가 있는 형태


check = false;  //#number check

var this_num, old_num = -1, num;
var this_line;
var wave_name;    //wave_name: WaveJSON의 data에 들어갈 데이터(wave가 b로 시작할 경우)
var waveData;   // waveData: WaveJSON의 wave에 들어갈 데이터

array_ = [];    //wave에 .을 추가하기 위해 변경되었는지 체크하는 배열 (변경되면 waveData, 아니면 0)

for (var line = 0; line < lines.length; line++) {   //한 줄씩 차례대로 읽음
    this_line = lines[line];    //한 줄 읽음

    // 1. $var
    if(this_line.slice(0, 4) == '$var'){
        var var_line = this_line.split(' ');
        var char = var_line[3];
        var id = var_line[4];
        
        nameJSON[char] = id;
        WaveJSON['signal'].push({"name" : id, "wave" : '', "data" : ''}); //WaveJSON에 var 저장

    // 2. #number
    }else if(this_line == "#0"){ //#초기값 설정 (array_가 없음)
        this_num = Number(this_line.slice(1));
        num = this_num - old_num;

        check = true;

    }else if(check == true){
        if(this_line.slice(0,1) == '#' || this_line == ''){    //#0이 아닌 경우, (this_line == '' 마지막인 경우)
            rpt = ".".repeat(num);

            for(k in array_){   //k = array_의 n번째
                n = array_[k];  //n = array_의 k번째 data

                // old_wave = WaveJSON.signal[k].wave.slice(WaveJSON.signal[k].wave.length - 1);

                if(typeof(n) == 'number'){  //n이 0인 경우(값에 변화가 없는 경우)
                    // console.log(rpt);
                    WaveJSON.signal[k].wave += rpt;
                    // WaveJSON.signal[k].wave += old_wave.repeat(num);
                }else{
                    rpt2 = ".".repeat(num - 1) + n;
                    // rpt2 = old_wave.repeat(num - 1) + n;
                    // console.log(rpt2);
                    // if(old_wave == '2'){
                        // old_data = WaveJSON.signal[k].data.slice(WaveJSON.signal[k].data.length - 1);
                        // rpt_data = old_data.repeat(num - 1) + n;
                        // WaveJSON.signal[k].data += rpt_data + ' ';
                    // }
                    WaveJSON.signal[k].wave += rpt2;
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
            this_line.slice(0,1) == '$' ? null : insertWaveJSONData();
        }
    }
}

function insertWaveJSONData(){
    // b로 시작하는 경우
    if(this_line.slice(0,1) == 'b' || this_line.slice(0,1) == 'B'){
        binary = this_line.slice(1,-2);
        wave_name = parseInt(binary, 2).toString(16); // 2진수 -> 16진수

        insertWaveData(1);
    //0 or 1 or .인 경우
    }else{        
        insertWaveData(0);
    }
}

function insertWaveData(ck){
    find_name = this_line.slice(-1);

    for(i in WaveJSON.signal){  //i : n번째
        j = WaveJSON.signal[i]; //j : i번째 JSON Data
        if(j.name == nameJSON[find_name]){

            waveData = ck == 0 ? this_line.slice(0,-1) : '2'; //waveData
            waveData = waveData.split(" ").join("");    //공백 제거
            array_[i] = waveData;

            ck == 1 ? WaveJSON.signal[i].data += wave_name + ' ' : null;
        }
    }
}
fs.writeFileSync('WaveJSON.json', JSON.stringify(WaveJSON));    // 파일 저장


io.on('connection', (socket) => {

    console.log("a user connected: ", socket.id); //show a log as a new client connects.
    console.log('WaveJSON: ', WaveJSON);

    
    // read html file
    var head = fs.readFileSync('public/head.html', 'utf8');
    var foot = fs.readFileSync('public/foot.html', 'utf8');

    var html = head + JSON.stringify(WaveJSON) + foot;
    fs.writeFileSync('public/index.html', html);    //파일 저장
    

    // input wavedrom data
    // rl.on('line', function(line){
    //     input = line.split(' ');
    //     console.log('input: ', input);

    //     var exist = false;  // json 속에 입력한 name이 있는지 없는지 확인하는 변수

    //     // (1) 삭제
    //     if(input[0] == 'delete'){ 
    //         for(i in WaveJSON.signal){
    //             if(WaveJSON.signal[i].name == input[1]){
    //                 delete WaveJSON.signal[i];
    //                 break;
    //             }
    //         }
    //         WaveJSON.signal = WaveJSON.signal.filter(function(x) { return x != null }); // null 삭제
    //     }else{
    //         for(i in WaveJSON.signal){  // json속에 name이 있는지 확인
    //         // (2) 추가
    //             if(WaveJSON.signal[i].name == input[0]){ // name이 있을 경우
    //                 WaveJSON.signal[i].wave += input[1]; //해당 name에 입력한 wave추가
    //                 exist = true;
    //                 break;
    //             }
    //         }

    //         // (3) 생성
    //         if(exist == false){ // json에 입력한 name이 없을 경우
    //             WaveJSON['signal'].push({"name":input[0], "wave":input[1]});
    //         }
    //     }
    //     fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));    // 파일 저장
    //     console.log(WaveJSON);

    //     html = head + JSON.stringify(WaveJSON) + foot;
    //     fs.writeFileSync('public/index2.html', JSON.stringify(html));    // 파일 저장
    // });



    // slicing wave data
    socket.on('button', (from, to) => {
        console.log('button is pushed');
        console.log('from: ', from, ', to: ', to);

        for(i=0; i < WaveJSON.signal.length; i++){
            console.log(WaveJSON.signal[i].wave);
            wave = WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1);
            console.log('-> slicing: ', wave);
            WaveJSON.signal[i].wave = wave;
        }
        console.log(WaveJSON);
        fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));

        html = head + JSON.stringify(WaveJSON) + foot;
        fs.writeFileSync('public/index2.html', JSON.stringify(html));    // 파일 저장

        io.emit('reload');
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});
