//반복문 실행 시간 측정하는 예제

//console객체의 메서드
// - time(label): 시간 측정 시작
// - timeEnd(label) : 시간 측정 종료
console.time('measurement');

var result = '';
for (var i = 1; i <= 100; i++){
  result += i + ' ';
}

console.log('Result:', result);

console.timeEnd('measurement');
