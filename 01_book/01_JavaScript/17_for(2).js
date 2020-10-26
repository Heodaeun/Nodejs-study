var a = ['a', 'b', 'c', 'x', 'y', 'z'];
var result = '';

for (var i in a) {
	result += 'index:'+ i + ', value:'+ a[i] + '\n'; 
}

console.log(result);

// "index:0, value:a
// index:1, value:b
// index:2, value:c
// index:3, value:x
// index:4, value:y
// index:5, value:z"