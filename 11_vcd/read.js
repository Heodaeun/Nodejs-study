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
        old_num = this_line.slice(1);

        check2 = true;

    }else if(check2 == true){
        if(this_line.slice(0,1) == '#' || this_line == ''){    //처음이 아닌 #number인 경우,
            old_num = this_num;
            this_num = this_line.slice(1);  //this_num = #"number"
            num = this_num - old_num;

            console.log(array_)
            console.log(this_num)

            if(num > 1){
                for(k in array_){
                    WaveJSON.signal[k].wave += '.' * num;
                }
            }

            for(k in array_){   //k = array_의 n번째
                n = array_[k];  //n = array_의 k번째 data
                if(n == 0){  //n이 0인 경우(값에 변화가 없는 경우)
                    WaveJSON.signal[k].wave += '.';
                }
            }

            array_ = new Array(); // 모두 null [ <n empty items> ] (초기화)
            for(i=0; i<WaveJSON.signal.length; i++){
                array_[i] = 0;
            }


        }else{  // wave값인 경우,
            var find_name = this_line.slice(-1);
       
           for(i in WaveJSON.signal){  //i : n번째
               j = WaveJSON.signal[i]; //j : i번째 JSON Data
               if(j.name == nameJSON[find_name]){
                    var waveData = this_line.slice(0, -1);   //wave data
                    waveData = waveData.split(" ").join("");    //공백 제거
                    WaveJSON.signal[i].wave += waveData;
       
                    array_[i] = 1;
               }
           }
        }
    }
}


// console.log(nameJSON);
console.log(WaveJSON);

fs.writeFileSync('WaveDrom.json', JSON.stringify(WaveJSON));    // 파일 저장
