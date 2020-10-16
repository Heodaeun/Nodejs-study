const fs = require('fs');

var WaveJSON = { signal : [] };
var nameJSON = {};

data = fs.readFileSync('out.vcd', 'utf-8');
lines = data.split('\n');   //각 줄이 배열로 들어가 있는 형태

check = false;
check2 = false;

for (var line = 0; line < lines.length; line++) {
    var this_line = lines[line];

    // 1. $var
    if(this_line.slice(0, 4) == '$var'){
        var var_line = this_line.split(' ');
        var char = var_line[3];
        var id = var_line[4];
        
        nameJSON[char] = id;
        WaveJSON['signal'].push({"name" : id, "wave" : ""});

    // 2. $dumpvars (초기값)
    }else if(this_line == '$dumpvars'){
        check = true;

    }else if(check == true){
        if(this_line == "$end"){    // $end가 나오기 전까지 계속 반복
            check = false;
        }else{
         
            insert_wave(0);
        }

    // 3. #number
    }else if(this_line.slice(0,1) == '#'){
        check2 = true;

    }else if(check2 == true){
        if(this_line.slice(0,1) != "#"){
            insert_wave(1);
        }
    }
}


function insert_wave(check){
    var find_name = this_line.slice(-1);
    for(i in WaveJSON.signal){  //i : n번째
        j = WaveJSON.signal[i]; //j : i번째 JSON Data
        if(j.name == nameJSON[find_name]){
            var waveData = this_line.slice(0, -1);
            waveData = waveData.split(" ").join("");    //공백 제거
            check = 0 ? WaveJSON.signal[i].wave = waveData
                     : WaveJSON.signal[i].wave += waveData;
        }
    }
}

// console.log(nameJSON);
// console.log(WaveJSON);

fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));    // 파일 저장