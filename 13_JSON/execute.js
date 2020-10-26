const book = {
    title: 'Ego is the Enemy',
    author: 'Ryan Holiday'
}

// JSON 출력하기
const bookJSON = JSON.stringify(book);
console.log(bookJSON);

// author에 해당하는 값만 출력하기
const parsedData = JSON.parse(bookJSON);
console.log(parsedData.author);

