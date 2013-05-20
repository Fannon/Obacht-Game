/* global socket */
/* jshint devel: true, node: true */

/** Global Obacht Namespace */
var obacht = {};

/**
 * Obacht Game Node.js Multiplayer Server
 *
 * TODO: Version checking -> Version can have gameplay relevance!
 *
 * @author Simon Heimler
 */
obacht.server = {};

//////////////////////////////
// Modules and Variables    //
//////////////////////////////

/** Server Options (imported from options.js) */
obacht.server.options = require('./options');
obacht.server.port = (process.argv[2] ? process.argv[2] : obacht.server.options.defaultPort); // Set Port, use Console Args if available
obacht.server.io = require('socket.io').listen(obacht.server.port); // Start Socket.io

/** Colored Console Output https://github.com/medikoo/cli-color */
var clc = require('cli-color');
var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;
var intern = clc.blackBright;

// Data Structures
var RoomManager = require('./roomManager');
obacht.server.rooms = new RoomManager(9999, obacht.server.io); // Load RoomManager DataStructure


//////////////////////////////
// Socket.io Configuration  //
//////////////////////////////

obacht.server.io.enable('browser client minification'); // send minified client
obacht.server.io.enable('browser client etag'); // apply etag caching logic based on version number
obacht.server.io.enable('browser client gzip'); // gzip the file
obacht.server.io.set('log level', 1); // reduce logging


//////////////////////////////
// Comminication            //
//////////////////////////////

obacht.server.io.sockets.on('connection', function(socket) {
    "use strict";

    /** Current Sockets PlayerID */
    socket.pid = socket.id;
    /** Current Sockets Room PIN */
    socket.pin = false;

    /**
     * New Player connects to Server
     * Sends ID back so that the client knows it's successful connected
     */
    socket.emit('connected', {
        pid: socket.id
    });
    console.log(notice('+++ NEW REMOTE CONNECTION'));

    /**
     * Connection Failed
     */
    socket.on('connect_failed', function(){
        socket.emit('connected', {
            pid: socket.id,
            error: 'Connection to Server failed!'
        });
        console.log(error('!!! REMOTE CONNECTION FAILED'));
    });

    /**
     * New Room Request
     * Draws new private PIN (closed Room) and sends it back to Client
     */
    socket.on('new_room', function(roomDetail) {

        var pin = obacht.server.rooms.getNewPin();

        roomDetail.players = []; // Set Players to empty Array (No Player joined yet)
        roomDetail.pin = pin;

        obacht.server.rooms.addRoom(pin, roomDetail);
        socket.emit('room_detail', roomDetail);

        console.log('--> Client requested new Room PIN #' + pin);

    });

    /**
     * Join Room Request
     */
    socket.on('join_room', function(room_detail) {

        // Leave old Room if connected to one
        if (socket.pin) {
            obacht.server.rooms.leaveRoom(socket.pin, socket.pid);
            socket.leave(socket.pin);
            console.log('--> Client leaves Room #' + socket.pin);
        }
        socket.pin = room_detail.pin;

        var roomDetail = obacht.server.rooms.joinRoom(socket.pin, socket.pid, room_detail.closed);
        socket.join(socket.pin);
        socket.broadcast.to(socket.pin).emit('room_detail', roomDetail);

    });

    /**
     * Leave Room Player is currently connected
     */
    socket.on('leave_room', function() {
        if (socket.pin) {
            socket.broadcast.to(socket.pin).emit('player_left');
            obacht.server.rooms.leaveRoom(socket.pin, socket.pid);
            socket.leave(socket.pin);
            socket.pin = false;

            console.log('--> Client leaves Room #' + socket.pin);
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

        socket.emit('room_invite', {pin: pin});

    });

    /**
     * Player gives Ready Signal (ready to play)
     *
     * If both Players are ready, sending a 'game_ready' Signal: The Game can be started now
     */
    socket.on('player_ready', function() {

        if (socket.pin) {
            var roomDetail = obacht.server.rooms.playerReady(socket.pin, socket.pid);

            if (roomDetail && roomDetail.playersReady.length === 2) {
                console.log(intern('--- Game Ready in Room #' + socket.pin));
                obacht.server.io.sockets['in'](socket.pin).emit('game_ready');
            }
        } else {
            console.log(warn('--- Player cannot be ready - is not in a Game yet'));
        }
    });

    /**
     * Redirects Player Status Informations (Health) to other Player
     */
    socket.on('player_status', function(player_status){
        socket.broadcast.to(socket.pin).emit('player_status', player_status);
    });

    /**
     * Broadcast to other Players in Room Request
     */
    socket.on('player_action', function(data) {
        console.log('<-> Player Action "' + data.type + '" in Room #' + socket.pin);
        socket.broadcast.to(socket.pin).emit('player_action', data);
    });

    /**
     * Get all open Rooms Request
     * (Debugging Function)
     */
    socket.on('get_rooms', function() {
        socket.emit('get_rooms', obacht.server.rooms.getRoomsDebug());
        console.log('<-- Sent current rooms Information');
    });

    /**
     * Client disconnect Event
     */
    socket.on('disconnect', function() {
        // Rooms are automatically leaved and pruned
        if (socket.pin) {
            // Tell other Player that his Opponent has left
            obacht.server.rooms.leaveRoom(socket.pin, socket.pid);
            socket.broadcast.to(socket.pin).emit('player_left');
            socket.leave(socket.pin);
            console.log(warn('--- Player left Room due to disconnect'));
        }
        console.log('--- DISCONNECT FROM REMOTE');
    });

});
