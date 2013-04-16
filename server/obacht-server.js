/**
 * Obacht Game Node.js Multiplayer Server
 *
 * @author Simon Heimler
 */


//////////////////////////////
// Modules and Variables    //
//////////////////////////////

var gameserver = {}; // Global Namespace
var port = (process.argv[2] ? process.argv[2] : 8080); // Use Console Argument if there

var io = require('socket.io').listen(port);


//////////////////////////////
// Configuration            //
//////////////////////////////

io.enable('browser client minification'); // send minified client
io.enable('browser client etag'); // apply etag caching logic based on version number
io.enable('browser client gzip'); // gzip the file
io.set('log level', 1); // reduce logging


//////////////////////////////
// Comminication            //
//////////////////////////////

io.sockets.on('connection', function(socket) {

    console.log('+++ NEW REMOTE CONNECTION');

    socket.emit('connected', true);

    // Client requests a new Room, enters it and gets the PIN for it
    socket.on('new_room', function() {
        var pin = Math.floor(Math.random()*9999);
        socket.join(pin);
        socket.emit('room_pin', pin);
        console.log('--> Client requested new Room #' + pin);
    });

    // Clients sends PIN and joins the Room if not full
    socket.on('join_room', function(pin) {

        console.log(io.sockets.clients(pin));

        if (io.sockets.clients(pin).length < 2) {
            socket.join(pin);
            socket.emit('room_pin', pin);
            console.log('--> Client joined Room #' + pin);
        } else {
            socket.emit('room_pin', false);
            console.log('--> Client tryed to join full Room #' + pin);
        }

    });

    // Debug: Get all open Rooms
    socket.on('broadcast', function(data) {
        console.log('<-> Broadcasting Game Data in Room #' + data.room);
        socket.broadcast.to(data.room).emit('game_data', data);
    });


    // Debug: Get all open Rooms
    socket.on('get_rooms', function() {
        socket.emit('get_rooms', io.sockets.manager.rooms);
        console.log('<-- Sent current rooms Information');
    });

    // Client disconnects
    socket.on('disconnect', function() {
        // Rooms are automatically leaved and pruned
        console.log('--- DISCONNECT FROM REMOTE');
    });

});
