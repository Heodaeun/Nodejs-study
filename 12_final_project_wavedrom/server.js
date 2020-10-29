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


// read vcd file
data = fs.readFileSync('out.vcd', 'utf-8');
lines = data.split('\n');   //각 줄이 배열로 들어가 있는 형태


// #number이 300을 넘기는지 확인
var TENto1 = false;
for (var line = 0; line < lines.length; line++){
    if(this_line == '#300'){
        
    }
}

// parsing vcd filel to WaveJSON
var WaveJSON = { signal : [], foot : { tock: 0 } };
var nameJSON = {};  // 모든 {char : id}이 든 JSON 형태

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

                if(typeof(n) == 'number'){  //n이 0인 경우(값에 변화가 없는 경우)
                    WaveJSON.signal[k].wave += rpt;
                }else{
                    rpt2 = ".".repeat(num - 1) + n;
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
    // console.log('WaveJSON: ', WaveJSON);


    // read html file
    var head = fs.readFileSync('public/head.html', 'utf8');
    var foot = fs.readFileSync('public/foot.html', 'utf8');

    var html = head + JSON.stringify(WaveJSON) + foot;
    fs.writeFileSync('public/index.html', html);    //파일 저장


    // slicing wave data
    socket.on('button', (from, to) => {
        from = parseInt(from), to = parseInt(to);
        console.log('button is pushed. (from: ', from, ', to: ', to, ')');
        // console.log('from: ', from, ', to: ', to);

        for(i = 0; i < WaveJSON.signal.length; i++){ // wave[from]이 '.'인지 확인
            tmp_wave = WaveJSON.signal[i].wave[from];
            console.log('\n\ninit wave: ', WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1));

            tmp = from;

            // (1) wave[from]이 '.''인 경우
            if(tmp_wave == '.'){
                // tmp = from-1;
                console.log('tmp = from: ',tmp);
                console.log(WaveJSON.signal[i].name, ' wave is .');

                while(tmp_wave == '.' && tmp > -1){
                    tmp_wave = WaveJSON.signal[i].wave[--tmp];

                    console.log('tmp: ',tmp);
                    console.log('tmp_wave: ',tmp_wave);
                }

                WaveJSON.signal[i].wave = WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1);
                WaveJSON.signal[i].wave = WaveJSON.signal[i].wave.replace('.', tmp_wave);
                console.log('slicing: ',WaveJSON.signal[i]);

            // (2) wave[from]이 '.'이 아닌 경우
            }else{
                WaveJSON.signal[i].wave = WaveJSON.signal[i].wave.slice(parseInt(from), parseInt(to)+1);
            }
            
            // WaveJSON.signal[i].data 변경하는 코드
            if(tmp_wave == '2'){
                var order = 0;
                var data = '';
                for(l = 0; l < from; l++){
                    if(WaveJSON.signal[i].wave[l] == '2'){
                        order += 2;
                    }
                }
                console.log('order: ', order);
                console.log('order data: ', WaveJSON.signal[i].data[order]);
                data += WaveJSON.signal[i].data[order] + ' ';

                for(l = from; l <= to; l++){
                    if(WaveJSON.signal[i].wave[l] == '2'){
                        order += 2;
                        data += WaveJSON.signal[i].data[order] + ' ';
                    }
                }
                WaveJSON.signal[i].data = data; 
                WaveJSON.foot.tock = from;
            }
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
