// Konfiguration
var serverUrl = "http://obacht.informatik.hs-augsburg.de:8080";
var port = 8080;

// Variablen und Datenstrukturen
var demo = {}; // Global Namespace
demo.pingPongTestData = [];
demo.broadcastTestData = [];

// Socket.io
var socket = io.connect(serverUrl);

socket.on('servermessage', function (data) {
    var html = '<div class="label label-success">' + data.msg + '</div> ';
    $('#servermessages').append(html);
});


//////////////////////////////////
// PingPong Test /////////////////
//////////////////////////////////

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
        x: Math.random() * 1280,
        y: Math.random() * 720,
        z: Math.random(),
        time: new Date().getTime()
    };

    demo.pingPongStart = new Date().getTime();

    socket.emit('pingPongTest', data);
};


//////////////////////////////////
// Broadcast Test /////////////////
//////////////////////////////////

socket.on('BroadcastTestResponse', function (data) {

    console.log('Broadcasting INPUT');
    console.dir(data);

    // Daten berechnen
    // ACHTUNG: Uhrzeiten müssen auf den Geräten absolut synchronisiert sein!
    // Am besten am selben Gerät über externen Server testen
    demo.broadcastEnd = new Date().getTime();
    var time = new Date().getTime() - data.time;
    demo.broadcastTestData.push(time);

    var sum = demo.broadcastTestData.reduce(function(a, b) {return a + b;});
    var avg = sum / demo.broadcastTestData.length;
    var max = Math.max.apply(null, demo.broadcastTestData);
    var min = Math.min.apply(null, demo.broadcastTestData);

    // Gegner Daten ausgeben
    $('#opponentX').text(data.x);
    $('#opponentY').text(data.y);
    $('#opponentZ').text(data.z);
    $('#opponentData').text(JSON.stringify(data.data));
    $('#opponentTime').html(JSON.stringify(data.time) + ' <span class="text-error">-' + time + 'ms</span>');

    $('#broadcastAvg').text(avg + 'ms, ');
    $('#broadcastMax').text(max + 'ms, ');
    $('#broadcastMin').text(min + 'ms, ');
    $('#broadcast').append(time + 'ms, ');

    // console.dir(demo.pingPongTestData);
});

broadcastTest = function() {

    data = {
        data: {'action': 'jump'},
        x: Math.random() * 1280,
        y: Math.random() * 720,
        z: Math.random(),
        time: new Date().getTime()
    };

    // Eigene Daten ausgeben
    $('#myX').text(data.x);
    $('#myY').text(data.y);
    $('#myZ').text(data.z);
    $('#myData').text(JSON.stringify(data.data));

    demo.broadcastStart = new Date().getTime();

    socket.emit('broadcastTest', data);
};
