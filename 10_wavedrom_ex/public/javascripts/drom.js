// var page = document.getElementById('page');
// page.innerText = "hi";

// var hw = document.getElementById('hw');
// hw.addEventListener('click', function(){
//     page.innerText = "bye";
// });


// require('../index.js');

// const express = require('express');
// const app = express();
// const fs = require('fs');
// read json file
// const fs = fs();


console.log('hi');

socket = io();

socket.on('send_WaveDrom', function(WaveJSON){
    console.log(WaveJSON);
});

// var script = document.createElement("script");
// script.innerText = {"signal":[{"name":"a","wave":"pb10"}]};
// var head = document.getElementsByTagName('head')[0];
// head.appendChild(script);


// window.location.reload();



// var drom = document.getElementById('drom');
// drom.innerText = '{ signal : [{ name: "clk",  wave: "p......" }]}';



// var dataBuffer = fs.readFileSync('WaveDrom.json');
// var dataJSON = dataBuffer.toString();
// var drom = JSON.parse(dataJSON);

// console.log('drom.js: ', drom);
// var ref = document.getElementsByTagName('script')[0],
// script = document.createElement('script');

// script.setAttribute('type', "WaveDrom");
// script.setAttribute('id', 'problem');
// script.innerHTML = s;
// ref.parentNode.insertBefore(script, ref);
// $('#page').text(drom.signal[0].wave);

