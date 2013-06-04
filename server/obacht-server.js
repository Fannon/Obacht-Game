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
obacht.server.io.set('heartbeat timeout', 12);
obacht.server.io.set('heartbeat interval', 5);


//////////////////////////////
// Comminication            //
//////////////////////////////

/**
 * New Player connects to Server
 * @event
 */
obacht.server.io.sockets.on('connection', function(socket) {
    "use strict";

    /** Current Sockets PlayerID */
    socket.pid = socket.id;
    /** Current Sockets Room PIN */
    socket.pin = false;

    /**
     * New Player connects to Server
     * Sends ID back so that the client knows it's successful connected
     * @event
     */
    socket.emit('connected', {
        pid: socket.id
    });
    log.info('+++ New Player connects to Server (' + obacht.server.io.sockets.clients().length + ' TOTAL)');

    /**
     * Connection Failed
     * @event
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
     * @event
     */
    socket.on('new_room', function(data) {

        socket.pin = false;
        var pin = obacht.server.rooms.getNewPin(data.closed);

        data.pin = pin;

        obacht.server.rooms.addRoom(pin, data);
        socket.emit('room_invite', {
            pin: pin,
            closed: data.closed
        });

        if (data.friend) {
            log.info('New Room Invite for a Friend');
            obacht.server.io.sockets.socket(data.friend).emit('room_invite', {
                pin: pin,
                closed: data.closed
            });
        }

        log.debug('--> Player requested new Room PIN #' + pin);

    });

    /**
     * Join Room Request
     * @event
     */
    socket.on('join_room', function(roomDetail) {

        // Leave old Room if connected to one
        if (socket.pin) {
            obacht.server.leaveRoomHelper(socket);
        }

        var room = obacht.server.rooms.joinRoom(socket, roomDetail.pin, roomDetail.closed);

        // Room sucessfully joined
        if (room.pin) {
            socket.pin = room.pin;
            socket.join(roomDetail.pin);
            obacht.server.io.sockets['in'](roomDetail.pin).emit('room_detail', room);
        }

        // Room couldn't be joined, return message
        if (room.msg) {
            socket.emit('message', room);
        }

    });

    /**
     * Leave Room Player is currently connected
     * @event
     */
    socket.on('leave_room', function() {
        obacht.server.leaveRoomHelper(socket);
    });

    /**
     * Find Match
     * Looks for Player waiting for another Player
     * If none available, return 0 -> Player will create a new Game
     * @event
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
     * If both Players are ready, sending a 'game_ready' Signal: The Game can be started now
     * @event
     */
    socket.on('player_ready', function() {
        if (socket.pin) {
            var roomDetail = obacht.server.rooms.playerReady(socket);

            if (roomDetail && roomDetail.creatingPlayerReady && roomDetail.joiningPlayerReady) {
                log.debug('--- Game Ready in Room #' + socket.pin);
                obacht.server.io.sockets['in'](socket.pin).emit('game_ready');
            }
        } else {
            log.warn('--- Player cannot be ready - is not in a Game yet', socket);
        }
    });

    /**
     * Redirects Player Status Informations (Health) to other Player
     * If a player dies (0 Lifes) it will send a game_over Event
     * @event
     */
    socket.on('player_status', function(player_status){
        if (socket.pin) {
            obacht.server.rooms.playerStatus(socket, player_status);
            if (player_status.health < 1) {
                obacht.server.gameoverHelper(socket, 'player_dead');
            }
        } else {
            log.warn('!!! Cannot send Player Status while not connected to a Game!', socket);
        }
    });

    /**
     * Broadcast Player Action to other Player in Room
     * @event
     */
    socket.on('player_action', function(data) {
        if (socket.pin) {
            log.debug('<-> Player Action "' + data.action + '" in Room #' + socket.pin);
            socket.broadcast.to(socket.pin).emit('player_action', data);
        } else {
            log.warn('!!! Cannot send Player Action while not connected to a Game!', socket);
        }
    });

    /**
     * Broadcast Bonus to both Players
     * @event
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
     * Broadcast thrown Trap to other Players
     * @event
     */
    socket.on('trap', function(data) {
        if (socket.pin) {
            log.debug('<-> Broadcasting Trap "' + data.type + '" in Room #' + socket.pin);
            obacht.server.io.sockets['in'](socket.pin).emit('trap', data);
        } else {
            log.warn('!!! Cannot broadcast Trap while not connected to a Game!', socket);
        }
    });

    /**
     * Check/Compare ReactionTimes between two Player.
     * @event
     */
    socket.on('check_reactiontime', function(data) {
        if (socket.pin) {
            log.debug('<-> Checking Reactiontime in Room #' + socket.pin);

            var result = obacht.server.rooms.checkReactiontime(socket, data);

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
     * @event
     */
    socket.on('get_rooms', function() {
        socket.emit('get_rooms', obacht.server.rooms.getRoomsDebug());
        log.debug('<-- DEBUG: Sent current Rooms Information');
    });

    /**
     * Player disconnect Event
     * @event
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
//    var room = obacht.server.rooms.getRoom(socket.pin);
    if (socket.pin) {
        log.debug('--> Player leaves Room #' + socket.pin);
        obacht.server.rooms.leaveRoom(socket);
        this.gameoverHelper(socket, 'player_left');
        socket.leave(socket.pin);
        socket.pin = false;
    } else {
        log.warn('!!! Tried to leave Room, but player was not in a room', socket);
    }
};

/**
 * Helper Function to send Game Over to both Players
 *
 * @param {Object} socket Current Socket PassThrough
 * @param {String} reason Reason for GameOver (player_dead || player_left)
 */
obacht.server.gameoverHelper = function(socket, reason) {
    "use strict";
    log.debug('--- Game Over in Room #' + socket.pin);
    obacht.server.io.sockets['in'](socket.pin).emit('game_over', {
        reason: reason,
        pid: socket.pid
    });
    obacht.server.rooms.removeRoom(socket.pin);
    socket.pin = false;
};
