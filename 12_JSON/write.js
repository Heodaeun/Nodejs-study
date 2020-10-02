const fs = require('fs');

const book = {
    title: 'Ego is the Enemy',
    author: 'Ryan Holiday'
}

const bookJSON = JSON.stringify(book)

// JSON 파일 만들기
fs.writeFileSync('first-json.json', bookJSON)