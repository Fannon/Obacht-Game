var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });

  // Empfängt Daten und sendet sie wieder zurück
  // Client misst die Zeit die dafür benötigt wurde
  socket.on('pingPongTest', function (data) {
    console.log('Ping');
    socket.emit('pingPongTestResponse', {'pingData': data });
  });

  io.sockets.on('broadcastTest', function (socket) {
  socket.broadcast.emit('user connected');
});

});