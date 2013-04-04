// Konfiguration
var ip = "192.168.2.100";
var port = 8080;

// Variablen und Datenstrukturen
var demo = {}; // Global Namespace
demo.pingPongTestData = [];

// Socket.io
var socket = io.connect('http://' + ip + ':' + port);

socket.on('servermessage', function (data) {
    var html = '<div class="label label-success">' + data.msg + '</div>';
    $('#servermessages').append(html);
});


//////////////////////////////////
// PingPong Test /////////////////
//////////////////////////////////
//
socket.on('pingPongTestResponse', function (data) {

    // Daten berechnen
    demo.pingPongEnd = new Date().getTime();
    var time = demo.pingPongEnd - demo.pingPongStart;
    demo.pingPongTestData.push(time);

    var sum = demo.pingPongTestData.reduce(function(a, b) {return a + b;});
    var avg = sum / demo.pingPongTestData.length;
    var max = Math.max.apply(null, demo.pingPongTestData);
    var min = Math.min.apply(null, demo.pingPongTestData);

    // Daten ausgeben
    $('#pingPongAvg').text(avg + 'ms, ');
    $('#pingPongMax').text(max + 'ms, ');
    $('#pingPongMin').text(min + 'ms, ');
    $('#pingPong').append(time + 'ms, ');

    // console.dir(demo.pingPongTestData);
});

pingPongTest = function() {

    data = {
        test: "Drei Chinesen mit dem Kontrabass saßen auf der Straße und erzählten sich was. Da kam die Polizei, ei was ist denn das? Drei Chinesen mit dem Kontrabass.",
        x: 2.4,
        y: 2.5,
        z: 3.1
    };

    demo.pingPongStart = new Date().getTime();

    socket.emit('pingPongTest', data);
};
//////////////////////////////////
// PingPong Test /////////////////
//////////////////////////////////
//
socket.on('pingPongTestResponse', function (data) {

    // Daten berechnen
    demo.pingPongEnd = new Date().getTime();
    var time = demo.pingPongEnd - demo.pingPongStart;
    demo.pingPongTestData.push(time);

    var sum = demo.pingPongTestData.reduce(function(a, b) {return a + b;});
    var avg = sum / demo.pingPongTestData.length;
    var max = Math.max.apply(null, demo.pingPongTestData);
    var min = Math.min.apply(null, demo.pingPongTestData);

    // Daten ausgeben
    $('#pingPongAvg').text(avg + 'ms, ');
    $('#pingPongMax').text(max + 'ms, ');
    $('#pingPongMin').text(min + 'ms, ');
    $('#pingPong').append(time + 'ms, ');

    // console.dir(demo.pingPongTestData);
});

broadcastTest = function() {

    data = {
        data: {'action': 'jump'},
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
    };

    demo.broadcastStart = new Date().getTime();

    socket.emit('broadcastTest', data);
};