var num = 1;

function foo() {
	var num = 2;
	
	function bar() {
		console.log(num);
	}
	return bar;
}

var baz = foo();
baz();




function f(arg) {
	var n = function() {
		return arg; 
	}
	arg++;
	return n; 
}

var m = f(123); 
console.log(m());