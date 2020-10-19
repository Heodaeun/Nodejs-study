console.log('hi');

var wavedrom = {
    waveJSON: null,
    socket: null,

    init: function(socket){
        socket = io();

        socket.on('connect', function() {
            console.log('connected');
        });


        socket.on('send_WaveDrom', function(WaveJSON){
            $('#page').text(WaveJSON.signal[0].wave);

            this.waveJSON = WaveJSON;


            console.log("this : ", this.waveJSON);
            document.body.innerHTML = document.body.innerHTML + "<script type='WaveDrom'>" + this.waveJSON + "</script>";
            document.body.innerHTML = document.body.innerHTML + '<script type="WaveDrom"> { signal : [{ name :"a", wave :"1...."}]}</script>';
            console.log(document.body.innerHTML);

            document.body.onload = "WaveDrom.ProcessAll()";
            
        });
    },

    // waveJSON을 클릭했을 때
    clicked: function(){

    }
};

$(document).ready(function () {
    wavedrom.init();
});


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

