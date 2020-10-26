// 비동기 이벤트를 이용한 Hello! Node.js!

var EventEmitter = require("events").EventEmitter;

var evt = new EventEmitter();

evt.on("helloNode",  function (str) {
  console.log("Hello! " + str );
});

// setTimeout() : 자바스크립트의 기본 메서드 중 하나. ms단위로 일정 시간이 지나고 나서 특정 함수를 콜백으로 실행시키는 메서드.
setTimeout(function () {
  evt.emit("helloNode", "Node.js!");
}, 3000); //(ms단위) 3초 후 메시지 출력
