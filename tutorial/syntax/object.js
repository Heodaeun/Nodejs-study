// array
var members = ['egoing', 'k8805', 'hoya'];
var i = 0;
console.log(members[1]);  //k8805
while(i < members.length){
  console.log(`array loop`, members[i]);
  i++;
}

// object
//각 데이터마다 고유한 이름을 부여함
var roles = {
  'programmer': 'egoing',
  'designer': 'k8805',
  'manager': 'hoya'
};
console.log(roles.designer);  //k8805
for(var name in roles){
  console.log(`object=>`, name, `value=>`, roles[name]);
}
