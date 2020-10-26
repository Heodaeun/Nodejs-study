function sum(a, b) { 
	var c = a + b;
	return c; 
}

var add = sum;
typeof add;
//"function"

add(1,2);
// 3

var student = {
	name : 'goorm',
	age : 20
}

console.log(student.name);

delete student.name;
// true

console.log(student.name);
//undefined

delete student;
// false

delete not_exist;
// true

console.log(student.age);