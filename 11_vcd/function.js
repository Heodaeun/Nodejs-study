function a (input) {

    const fs = require('fs');

    var dataBuffer = fs.readFileSync('WaveDrom.json');
    var dataJSON = dataBuffer.toString();
    var WaveJSON = JSON.parse(dataJSON);


    fs.writeFileSync('WaveJSON.json', JSON.stringify(WaveJSON));    // 파일 저장
};

export { a };

