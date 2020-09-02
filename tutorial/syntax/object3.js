// var v1 = 'v1';
// // 10,000 codes
// v1 = 'egoing';
// var v2 = 'v2';


var o = {
  v1: 'v1',
  v2: 'v2',
  f1: function (){
    console.log(this.v1);
  },
  function f2(){
    console.log(this.v2);
  }
};

o.f1(); //v1
o.f2(); //v2
