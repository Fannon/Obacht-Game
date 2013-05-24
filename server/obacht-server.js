/* global socket */
/* jshint devel: true, node: true */

/**
 * Obacht Namespace
 * @namespace
 */
var obacht = {};

/**
 * Obacht Game Node.js Multiplayer Server
 *
 * TODO: Version checking -> Version can have gameplay relevance!
 * TODO: checkReactionTime();
 *
 * @author Simon Heimler
 */
obacht.server = {};

//////////////////////////////
// Modules and Variables    //
//////////////////////////////

/** Server Options (imported from options.js) */
obacht.server.options = require('./options');
/** Connection Port, using Console Arguments if available */
obacht.server.port = (process.argv[2] ? process.argv[2] : obacht.server.options.defaultPort);
/** Socket.io */
obacht.server.io = require('socket.io').listen(obacht.server.port); // Start Socket.io
obacht.Logger = require('./Logger');

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
        log.error('!!! Remote connection failed!', socket);
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
            closed: roomDetail.closed
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
        if (room.pin) {
            socket.join(socket.pin);
            obacht.server.io.sockets['in'](socket.pin).emit('room_detail', room);
        }
        if (room.msg) {
            socket.emit('message', room);
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

            if (roomDetail && roomDetail.creatingPlayerReady && roomDetail.joiningPlayerReady) {
                log.debug('--- Game Ready in Room #' + socket.pin);
                obacht.server.io.sockets['in'](socket.pin).emit('game_ready');
            }
            obacht.server.io.sockets['in'](socket.pin).emit('room_detail', roomDetail);
        } else {
            log.warn('--- Player cannot be ready - is not in a Game yet', socket);
        }
    });

    /**
     * Redirects Player Status Informations (Health) to other Player
     */
    socket.on('player_status', function(player_status){
        if (socket.pin) {
            socket.broadcast.to(socket.pin).emit('player_status', player_status);
        } else {
            log.warn('!!! Cannot send Player Status while not connected to a Game!', socket);
        }
    });

    /**
     * Broadcast Player Action to other Player in Room
     */
    socket.on('player_action', function(data) {
        if (socket.pin) {
            log.debug('<-> Player Action "' + data.type + '" in Room #' + socket.pin);
            socket.broadcast.to(socket.pin).emit('player_action', data);
        } else {
            log.warn('!!! Cannot send Player Action while not connected to a Game!', socket);
        }
    });

    /**
     * Broadcast Bonus to both Players
     */
    socket.on('bonus', function(data) {
        if (socket.pin) {
            log.debug('<-> Broadcasting Bonus "' + data.type + '" in Room #' + socket.pin);
            obacht.server.io.sockets['in'](socket.pin).emit('bonus', data);
        } else {
            log.warn('!!! Cannot broadcast Bonus while not connected to a Game!', socket);
        }
    });

    /**
     * Check/Compare ReactionTimes between two Player.
     * If both committed
     */
    socket.on('check_reactiontime', function(data) {
        if (socket.pin) {
            log.debug('<-> Checking Reactiontime in Room #' + socket.pin);

            var result = obacht.server.rooms.checkReactiontime(socket.pin, socket.pid, data);

            if (result) {
                obacht.server.io.sockets['in'](socket.pin).emit('receive_bonus', result);
            }

        } else {
            log.warn('!!! Cannot check Reactiontime while not connected to a Game!', socket);
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
            obacht.server.leaveRoomHelper(socket);
            log.warn('--- Player left Room due to disconnect', socket);
        }
        log.debug('--- Player disconnect');
    });

});


//////////////////////////////
// Helper Functions         //
//////////////////////////////

/**
 * Helper Function for leaving current Room
 * Sends Notification to other Player, cleans up Data
 *
 * @param  {Object} socket Current Socket PassThrough
 *
 * @memberOf obacht.server
 */
obacht.server.leaveRoomHelper = function(socket) {
    "use strict";
    if (socket.pin) {
        socket.broadcast.to(socket.pin).emit('player_left');
        obacht.server.rooms.leaveRoom(socket.pin, socket.pid);
        socket.leave(socket.pin);
        socket.pin = false;
        log.debug('--> Player leaves Room #' + socket.pin);
    } else {
        log.warn('!!! Tried to leave Room, but there was none joined', socket);
    }
};
