var result1 = new Boolean();
var result2 = true;

typeof result1;
// "object"
typeof result1.valueOf();
// "boolean"

console.log(Boolean("test"));
// true
console.log(Boolean(""));
// false
console.log(Boolean({}));
// true