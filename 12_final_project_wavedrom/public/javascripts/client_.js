var socket = io();


var wavedrom = {
    socket: null,

    init: function(socket){
        console.log('connected');

        // socket.emit('first');
        // console.log('wavevJSON: ', waveJSON);
    },
};

$(document).ready(function () {
    wavedrom.init();
});



$("#send").on('click', function(e){
    from = document.getElementById("from").value;
    to = document.getElementById("to").value;
    console.log('from: ', from, ', to: ', to);

    socket.emit('button', from, to);
});

socket.on('reload', () => {
    window.location.reload();
    wavedrom.init();
});