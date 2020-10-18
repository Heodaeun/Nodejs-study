const fs = require('fs');

var WaveJSON = { signal : [] };
var nameJSON = {};

data = fs.readFileSync('out.vcd', 'utf-8');
lines = data.split('\n');   //각 줄이 배열로 들어가 있는 형태

check = false;
check2 = false;

var this_num, old_num = -1;
array_ = [];    //wave에 .을 추가하기 위해 변경되었는지 체크하는 배열 (변경되면 1, 아니면 0)

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
            // insert_wave(0);
            var find_name = this_line.slice(-1);
       
           for(i in WaveJSON.signal){  //i : n번째
               j = WaveJSON.signal[i]; //j : i번째 JSON Data
               if(j.name == nameJSON[find_name]){
                   var waveData = this_line.slice(0, -1);
                   waveData = waveData.split(" ").join("");    //공백 제거
                   WaveJSON.signal[i].wave = waveData;
                }
            }
        }

    // 3. #number
    }else if(this_line.slice(0,1) == '#' && old_num == -1){ //#처음num 인 경우, (array_없음)
        console.log(this_line)
        old_num = this_line.slice(1, -1);
        num = this_num - old_num;

        check2 = true;

    }else if(check2 == true){
        if(this_line.slice(0,1) == '#'){    //처음이 아닌 #number인 경우,

            this_num = this_line.slice(1);  //this_num = #"number"
            num = this_num - old_num;

            console.log(array_)
            console.log(this_line.slice(1))
            

            for(k in array_){   //k = n번째
                n = array_[k];  //n = 1 or null
                if(n == null){
                    WaveJSON.signal[k].wave += '.' * num;
                }
            }

            array_ = new Array(WaveJSON.signal.length); // 모두 null [ <n empty items> ] (초기화)

        }else{  // wave값인 경우,
            // insert_wave(1);
            var find_name = this_line.slice(-1);
       
           for(i in WaveJSON.signal){  //i : n번째
               j = WaveJSON.signal[i]; //j : i번째 JSON Data
               if(j.name == nameJSON[find_name]){
                   var waveData = this_line.slice(0, -1);
                   waveData = waveData.split(" ").join("");    //공백 제거
                   WaveJSON.signal[i].wave += waveData;
       
                //    array_[i] = 1;
                array_[i] = waveData;
               }
           }
        }
    }
}


function insert_wave(check){
    var find_name = this_line.slice(-1);
     array_ = [];

    for(i in WaveJSON.signal){  //i : n번째
        j = WaveJSON.signal[i]; //j : i번째 JSON Data
        if(j.name == nameJSON[find_name]){
            var waveData = this_line.slice(0, -1);
            waveData = waveData.split(" ").join("");    //공백 제거
            check = 0 ? WaveJSON.signal[i].wave = waveData
                     : WaveJSON.signal[i].wave += waveData;

            array_[i] = 1;
        }else{
            array_[i] = 0;
        }  
    }
    console.log(array_)
    for(k in array_){
        n = array_[k];
        if(n == 0){
            check = 0 ? null : WaveJSON.signal[k].wave += '.';
        }
    }
}

// console.log(nameJSON);
console.log(WaveJSON);

fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));    // 파일 저장
