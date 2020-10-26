console.log('hi');

// var socket = io();
// var waveJSON;

// socket.on('send_WaveJSON', function(WaveJSON){
//     $('#page').text(WaveJSON.signal[0].wave);
//     waveJSON = WaveJSON;
// });

// //waveJSON 클릭했을 때
// $('#click').on('click', function(e){
//     console.log('clicked');
//     socket.emit('click');
// })

var waveJSON = "{signal : []}";

var wavedrom = {
    socket: null,

    init: function(socket){
        socket = io();

        // console.log('waveJSON: ', waveJSON);

        document.body.innerHTML = document.body.innerHTML + "<script type='WaveDrom'>" + waveJSON + "</script>";
        document.body.innerHTML = document.body.innerHTML + '<script type="WaveDrom"> { signal : [{ name :"a", wave :"1...."}]}</script>';
        document.body.innerHTML = document.body.innerHTML + '<script type="WaveDrom"> { signal : [{ name :"b", wave :"1...."}]}</script>';

        // console.log(document.body.innerHTML);

        socket.on('connect', function() {
            console.log('connected');
            socket.emit('initial');
        });

        socket.on('send_WaveDrom', function(WaveJSON){
            console.log('send_waveDrom start');
            console.log(WaveJSON);

            this.waveJSON = WaveJSON;

            // $('#page').text(WaveJSON.signal[0].wave);

            // console.log("this.waveJSON : ", this.waveJSON);
            // document.body.innerHTML = document.body.innerHTML + "<script type='WaveDrom'>" + this.waveJSON + "</script>";
            // document.body.innerHTML = document.body.innerHTML + '<script type="WaveDrom"> { signal : [{ name :"b", wave :"1...."}]}</script>';
            // // console.log(document.body.innerHTML);

            // document.body.onload = "WaveDrom.ProcessAll()";

            // $("body").load(window.location.href + "body");

        //     $('script').each(function(){
        //         if($(this).attr('src') == 'http://wavedrom.com/wavedrom.min.js' ){
        //             var old_scr = $(this).attr('scr');
        //             $(this).attr('scr', '');
        //             setTimeout(function(){ $(this).attr('scr', old_scr + '?' + new Date()); }, 250);
        //         }
        //     })
        // $("http://wavedrom.com/wavedrom.min.js").off();
        $.getScript("javascripts/wavedrom.js")
            .done(function(){
            console.log('success to load js file');
            }).fail(function(){
                console.log('fail to load js file');
            });
        });
    },

    // waveJSON을 클릭했을 때
    clicked: function(){
        var socket = io();

        console.log('clicked');
        socket.emit('click');

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

