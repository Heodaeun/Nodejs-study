const fs = require('fs');

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
        console.log("초기값 설정")
        this_num = Number(this_line.slice(1));
        num = this_num - old_num;

        check = true;

    }else if(check == true){
        if(this_line.slice(0,1) == '#' || this_line == ''){    //#0이 아닌 경우, (this_line == '' 마지막인 경우)
            
            console.log('this_num: ', this_num);
            console.log(array_)
            console.log('old_num : ', old_num);
            console.log('num: ', num);
            rpt = ".".repeat(num);

            for(k in array_){   //k = array_의 n번째
                n = array_[k];  //n = array_의 k번째 data
                if(typeof(n) == 'number'){  //n이 0인 경우(값에 변화가 없는 경우)
                    console.log(rpt);
                    WaveJSON.signal[k].wave += rpt;
                }else{
                    rpt2 = ".".repeat(num - 1) + n;
                    console.log(rpt2);
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
            waveData = waveData.split(" ").join("");    //공백 제거

            array_[i] = waveData;

            ck == 1 ? WaveJSON.signal[i].data += wave_name : null;

            // console.log('waveData: ', waveData)
            // console.log('wave_name: ', wave_name)
        }
    }
}


// console.log(nameJSON);
console.log(WaveJSON);

fs.writeFileSync('total_WaveJSON.json', JSON.stringify(WaveJSON));    // 파일 저장
