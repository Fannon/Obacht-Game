/* global require, socket, process */
/* jshint strict: false, devel: true */

/**
 * Obacht Game Node.js Multiplayer Server
 *
 * @author Simon Heimler
 */


//////////////////////////////
// Modules and Variables    //
//////////////////////////////

var obacht = {}; // Global Namespace
obacht.server = {};
obacht.server.options = require('./options'); // Load Options
obacht.server.port = (process.argv[2] ? process.argv[2] : obacht.server.options.defaultPort); // Set Port, use Console Args if available
obacht.server.io = require('socket.io').listen(obacht.server.port); // Start Socket.io

// Data Structures
var RoomCollection = require('./roomCollection');
obacht.server.rooms = new RoomCollection(9999, obacht.server.io); // Load RoomCollection DataStructure

//////////////////////////////
// Configuration            //
//////////////////////////////

obacht.server.io.enable('browser client minification'); // send minified client
obacht.server.io.enable('browser client etag'); // apply etag caching logic based on version number
obacht.server.io.enable('browser client gzip'); // gzip the file
obacht.server.io.set('log level', 1); // reduce logging


//////////////////////////////
// Comminication            //
//////////////////////////////

obacht.server.io.sockets.on('connection', function(socket) {

    /**
     * New Player connects to Server
     * Sends ID back so that the client knows it's successful connected
     */
    socket.emit('connected', {
        pid: socket.id
    });
    console.log('+++ NEW REMOTE CONNECTION');


    /**
     * Connection to Server fails
     */
    socket.on('connect_failed', function(){
        socket.emit('connected', {
            pid: socket.id,
            error: 'Connection to Server failed!'
        });
        console.log('!!! REMOTE CONNECTION FAILED');
    });


    /**
     * New Room Request
     * Draws new private PIN (closed Room) and sends it back to Client
     */
    socket.on('new_room', function(room) {
        var pin = obacht.server.rooms.getNewPin();
        console.log(pin);
        var room_detail =  {
            pin: pin,
            closed: room.closed,
            players: [],  // No Players yet
            theme: room.theme,
            options: room.options
        };

        socket.emit('room_detail', room_detail);
        console.log('--> Client requested new Room PIN #' + pin);
    });

    /**
     * Join Room Request
     */
    socket.on('join_room', function(newRoom) {

        // Leave old Room if connected to one
        if (socket.pin) {
            console.log('--> Client leaves Room #' + socket.pin);
            socket.leave(socket.pin);
        }

        // Bind PIN to Client, use private PIN if room is closed
        if (newRoom.closed === true) {
            // Private Room which cannot be joined with Random Games
            socket.pin = 'P-' + newRoom.pin;
        } else {
            socket.pin = newRoom.pin;
        }

        // Create Return Object
        var room_detail =  {
            pin: newRoom.pin,
            closed: newRoom.closed,
            players: obacht.server.io.sockets.clients,
            theme: newRoom.theme,
            options: newRoom.options
        };

        if (obacht.server.io.sockets.clients(newRoom.pin).length < obacht.server.options.maxRooms) {
            // Room available: 0 or 1 Player
            socket.join(socket.pin);
            socket.broadcast.to(socket.pin).emit('room_detail', room_detail);
            console.log('--> Client joined Room #' + socket.pin);
        } else {
            // Room is full: >= 2 Player
            room_detail.error = 'Client tryed to join full Room #';
            socket.emit('room_detail', room_detail);
            console.log('--> Client tryed to join full Room #' + socket.pin);
        }

    });


    /**
     * Find Match
     * Looks for Player waiting for another Player
     * If none available, return 0 -> Client will create a new Game
     */
    socket.on('find_match', function() {

        console.log('--> Client request new Match');

        // If still in Room, leave it
        if (socket.pin) {
            socket.leave(socket.pin);
        }

        var pin = obacht.server.rooms.findMatch();
        var players = [];
        if (obacht.server.io.sockets.manager.rooms.hasOwnProperty('/' + pin)) {
            players = obacht.server.io.sockets.manager.rooms['/' + pin];
        }

        // Create Return Object
        var room_detail =  {
            pin: pin,
            players: players,
            closed: false
        };

        socket.emit('room_detail', room_detail);

    });


    /**
     * Leave Room currently connected
     * (Debugging Function)
     */
    socket.on('leave_room', function() {
        if (socket.pin) {
            console.log('--> Client leaves Room #' + socket.pin);
            socket.leave(socket.pin);
        }
    });


    /**
     * Broadcast to other Players in Room Request
     */
    socket.on('player_action', function(data) {
        console.log('<-> Player Action "' + data.type + '" in Room #' + socket.pin);
        socket.broadcast.to(socket.pin).emit('hurdle', data);
    });


    /**
     * Get all open Rooms Request
     * (Debugging Function)
     */
    socket.on('get_rooms', function() {
        socket.emit('get_rooms', obacht.server.io.sockets.manager.rooms);
        console.log('<-- Sent current rooms Information');
    });


    /**
     * Client disconnect Event
     */
    socket.on('disconnect', function() {
        // Rooms are automatically leaved and pruned
        console.log('--- DISCONNECT FROM REMOTE');
    });

});
