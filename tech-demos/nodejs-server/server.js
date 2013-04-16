var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {

  socket.emit('servermessage', { msg: 'Erfolgreich verbunden' });

  // Empfängt Daten und sendet sie wieder zurück
  // Client misst die Zeit die dafür benötigt wurde
  socket.on('pingPongTest', function (data) {
    console.log('Ping');
    socket.emit('pingPongTestResponse', {'pingData': data });
  });

  socket.on('broadcastTest', function (data) {
    data.x = -data.x;
    data.y = -data.y;
    data.z = -data.z;

    console.log('Broadcast');
    socket.broadcast.emit('BroadcastTestResponse', data);
  });

});
