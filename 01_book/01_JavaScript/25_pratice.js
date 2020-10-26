// Run by Node.js

const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var f = function(a){
	return a * a;
};

rl.on("line", function(line) {
	console.log(f(line));
	rl.close();
}).on("close", function() {
	process.exit();
});