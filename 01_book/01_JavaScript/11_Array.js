var array1 = [1, 2, 3];
var array2 = new Array(1, 2);
array2.push(3);
// 3
var array3 = new Array(3); 
array3;
// [undefined × 3]

typeof array1;
// "object"

array1.toString();
// "1,2,3"

array1.valueOf();
// [1, 2, 3]

array1.length;
// 3

array1[1];
// 2

array1.length = 5;
// 5

array1;
// [1, 2, 3, undefined × 2]

console.log(array2.push("new1"));
// 4

console.log(array2.push("new2"));
// 5

array2;
// [1, 2, 3, "new1", "new2"]

array2.pop();
// "new2"
console.log(array2);
// [1, 2, 3, "new1"]

array3 = new Array(4, 2, 1, 3, 0);
// [4, 2, 1, 3, 0]

console.log(array3.sort());
// [0, 1, 2, 3, 4]