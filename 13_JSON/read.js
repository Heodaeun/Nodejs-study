const fs = require('fs');

// JSON 파일 읽기
const dataBuffer = fs.readFileSync('first-json.json');
const dataJSON = dataBuffer.toString();

console.log(dataJSON);

// title값만 출력하기
const data = JSON.parse(dataJSON);
console.log(data.title);