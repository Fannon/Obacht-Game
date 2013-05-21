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
obacht.Logger = require('./Logger');

/** Custom Logger */
var log = new obacht.Logger(obacht.server.options.loglevel);

// Data Structures
var RoomManager = require('./RoomManager');
obacht.server.rooms = new RoomManager(obacht.server.io); // Load RoomManager DataStructure


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
    log.info('+++ New Player connects to Server (' + obacht.server.io.sockets.clients().length + ' TOTAL)');

    /**
     * Connection Failed
     */
    socket.on('connect_failed', function(){
        socket.emit('connected', {
            pid: socket.id,
            error: 'Connection to Server failed!'
        });
        log.error('!!! Remote connection failed!');
    });

    /**
     * New Room Request
     * Draws new private PIN (closed Room) and sends it back to Client
     */
    socket.on('new_room', function(roomDetail) {

        var pin = obacht.server.rooms.getNewPin(roomDetail.closed);

        roomDetail.players = []; // Set Players to empty Array (No Player joined yet)
        roomDetail.pin = pin;

        obacht.server.rooms.addRoom(pin, roomDetail);
        socket.emit('room_invite', {
            pin: pin,
            closed: true
        });

        log.debug('--> Player requested new Room PIN #' + pin);

    });

    /**
     * Join Room Request
     */
    socket.on('join_room', function(roomDetail) {

        // Leave old Room if connected to one
        if (socket.pin) {
            obacht.server.leaveRoomHelper(socket);
        }
        socket.pin = roomDetail.pin;

        var room = obacht.server.rooms.joinRoom(socket.pin, socket.pid, roomDetail.closed);
        if (room) {
            socket.join(socket.pin);
            socket.broadcast.to(socket.pin).emit('room_detail', room);
        }

    });

    /**
     * Leave Room Player is currently connected
     */
    socket.on('leave_room', function() {
        obacht.server.leaveRoomHelper(socket);
    });

    /**
     * Find Match
     * Looks for Player waiting for another Player
     * If none available, return 0 -> Player will create a new Game
     */
    socket.on('find_match', function() {

        log.debug('--> Player request new Match');

        // If still in Room, leave it
        if (socket.pin) {
            obacht.server.leaveRoomHelper(socket);
        }

        var pin = obacht.server.rooms.findMatch();

        socket.emit('room_invite', {
            pin: pin,
            closed: false
        });

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
                log.debug('--- Game Ready in Room #' + socket.pin);
                obacht.server.io.sockets['in'](socket.pin).emit('game_ready');
            }
        } else {
            log.warn('--- Player cannot be ready - is not in a Game yet');
        }
    });

    /**
     * Redirects Player Status Informations (Health) to other Player
     */
    socket.on('player_status', function(player_status){
        if (socket.pin) {
            socket.broadcast.to(socket.pin).emit('player_status', player_status);
        } else {
            log.warn('!!! Cannot send Player Status while not connected to a Game!');
        }
    });

    /**
     * Broadcast to other Players in Room Request
     */
    socket.on('player_action', function(data) {
        if (socket.pin) {
            log.debug('<-> Player Action "' + data.type + '" in Room #' + socket.pin);
            socket.broadcast.to(socket.pin).emit('player_action', data);
        } else {
            log.warn('!!! Cannot send Player Action while not connected to a Game!');
        }
    });

    /**
     * Get all open Rooms Request
     * (Debugging Function)
     */
    socket.on('get_rooms', function() {
        socket.emit('get_rooms', obacht.server.rooms.getRoomsDebug());
        log.debug('<-- DEBUG: Sent current Rooms Information');
    });

    /**
     * Player disconnect Event
     */
    socket.on('disconnect', function() {
        // Rooms are automatically leaved and pruned
        if (socket.pin) {
            // Tell other Player that his Opponent has left
            obacht.server.rooms.leaveRoom(socket.pin, socket.pid);
            socket.broadcast.to(socket.pin).emit('player_left');
            socket.leave(socket.pin);
            log.warn('--- Player left Room due to disconnect');
        }
        log.debug('--- Player disconnect');
    });

});

obacht.server.leaveRoomHelper = function(socket) {
    "use strict";
    if (socket.pin) {
        socket.broadcast.to(socket.pin).emit('player_left');
        obacht.server.rooms.leaveRoom(socket.pin, socket.pid);
        socket.leave(socket.pin);
        socket.pin = false;
        log.debug('--> Player leaves Room #' + socket.pin);
    } else {
        log.warn('!!! Tried to leave Room, but there was none joined');
    }
};
