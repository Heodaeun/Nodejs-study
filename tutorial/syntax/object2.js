// array object

// var i = if(true){console.log(1);} //ERROR

// var w = while(true){console.log(1)};  //ERROR


// function
var f = function() {
  console.log(1+1);
  console.log(1+2);
}
// console.log(f);
// f();

//배열의 원소로써 함수가 존재할 수 있음
var a = [f];  //[f]: 함수f가 담긴 배열
a[0](); //2 3


var o = {
  func: f
} //func: 객체의 속성(property)
o.func(); //2 3 //o.func() == f
