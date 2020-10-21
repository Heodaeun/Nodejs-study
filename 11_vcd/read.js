const fs = require('fs');

var WaveJSON = { signal : [] };
var nameJSON = {};

data = fs.readFileSync('out.vcd', 'utf-8');
lines = data.split('\n');   //각 줄이 배열로 들어가 있는 형태

check = false;
check2 = false;

var this_num, old_num = -1;
var this_line;
var wave_name, waveData;

array_ = [];    //wave에 .을 추가하기 위해 변경되었는지 체크하는 배열 (변경되면 1, 아니면 0)

for (var line = 0; line < lines.length; line++) {
    this_line = lines[line];

    // 1. $var
    if(this_line.slice(0, 4) == '$var'){
        var var_line = this_line.split(' ');
        var char = var_line[3];
        var id = var_line[4];
        
        nameJSON[char] = id;
        WaveJSON['signal'].push({"name" : id});

    // 2. $dumpvars (초기값)
    }else if(this_line == '$dumpvars'){
        console.log('초기값 설정');
        check = true;

    }else if(check == true){
        if(this_line == "$end"){    // $end가 나오기 전까지 계속 반복
            console.log('초기값 끝');
            check = false;
        }else{
            insertWaveJSONData();
        }

    // 3. #number
    }else if(this_line.slice(0,1) == '#' && old_num == -1){ //#처음num 인 경우, (array_없음)
        old_num = this_line.slice(1);

        check2 = true;

    }else if(check2 == true){
        if(this_line.slice(0,1) == '#' || this_line == ''){    //처음이 아닌 #number인 경우,
            old_num = this_num;
            this_num = this_line.slice(1);  //this_num = #"number"
            num = this_num - old_num;

            // console.log(array_)
            console.log('num: ',this_num)

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
            insertWaveJSONData();
        }
    }
}

function insertWaveJSONData(){
    // b로 시작하는 경우
    if(this_line.slice(0,1) == 'b' || this_line.slice(0,1) == 'B'){

        binary = this_line.slice(1,-2);
        wave_name = parseInt(binary, 2).toString(16); // 2진수 -> 16진수

        insertWaveData(1);
    }else{
        //0 or 1 or .인 경우
        insertWaveData(0);
    }
}


function insertWaveData(ck){
    find_name = this_line.slice(-1);

    for(i in WaveJSON.signal){  //i : n번째
        j = WaveJSON.signal[i]; //j : i번째 JSON Data
        if(j.name == nameJSON[find_name]){

             waveData = ck == 0 ? this_line.slice(0,-1) : '2'; //waveData
            //  console.log(waveData);
             waveData = waveData.split(" ").join("");    //공백 제거
             WaveJSON.signal[i].wave += waveData;
             console.log('waveData: ',waveData)

             array_[i] = 1;

             ck == 1 ? WaveJSON.signal[i].data += wave_name : null;
             console.log('wave_name: ',wave_name)
        }
    }
}


// console.log(nameJSON);
console.log(WaveJSON);

fs.writeFileSync('total_WaveJSON.json', JSON.stringify(WaveJSON));    // 파일 저장
