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

var gameServer = {
    maxPlayers: 2,
    maxPin: 9999,
    port: (process.argv[2] ? process.argv[2] : 8080) // Use Console Argument if there
};

var io = require('socket.io').listen(gameServer.port);


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
        var pin = getNewPin();
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
    socket.on('join_room', function(roomDetail) {

        // Leave old Room if connected to one
        if (socket.pin) {
            console.log('--> Client leaves Room #' + socket.pin);
            socket.leave(socket.pin);
        }

        // Bind PIN to Client, use private PIN if room is closed
        if (roomDetail.closed) {
            // Private Room which cannot be joined with Random Games
            socket.pin = 'P-' + roomDetail.pin;
        } else {
            socket.pin = roomDetail.pin;
        }

        // Create Return Object
        var room_detail =  {
            pin: roomDetail.pin,
            closed: roomDetail.closed,
            players: io.sockets.clients,
            theme: roomDetail.theme,
            options: roomDetail.options
        };

        if (io.sockets.clients(roomDetail.pin).length < gameServer.maxPlayers) {
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

        var pin = findMatch();

        // Create Return Object
        var room_detail =  {
            pin: pin
        };

        socket.emit('room_detail', room_detail);

    });


    /**
     * Leave Room currently connected
     */
    socket.on('leave_room', function() {
        if (socket.room) {
            console.log('--> Client leaves Room #' + socket.pin);
            socket.leave(socket.room);
        }
    });


    /**
     * Broadcast to other Players in Room Request
     */
    socket.on('player_action', function(data) {

        console.log('<-> Player Action "' + data.type + '" in Room #' + socket.room);

        // Broadcast to all Players in the room
        socket.broadcast.to(socket.room).emit('hurdle', data);
//        io.sockets.in(socket.room).emit('hurdle', data);
    });


    /**
     * Get all open Rooms Request
     */
    socket.on('get_rooms', function() {
        socket.emit('get_rooms', io.sockets.manager.rooms);
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


//////////////////////////////
// GameServer Functions     //
//////////////////////////////

/**
 * Generates a Random PIN
 * Checks if it is already in use. If it is, draws a new one.
 *
 * @return {integer} PIN
 */
function getNewPin(closed) {

    var pin = Math.floor(Math.random() * gameServer.maxPin);

    if (io.sockets.clients(pin).length > 0) {
        console.log('### Room already used, trying again.');
        return getNewPin();
    } else {
        return pin;
    }
}

/**
 * Finds a Match
 *
 * Looks for a Game with just one Player waiting for another
 * TODO: Just BruteForce right now, not very performant
 * TODO: Randomize it (?)
 *
 * @return {number} PIN for Room, false if no Room open
 */
function findMatch() {

    for (var pin = 1; pin < gameServer.maxPin; pin++) {
        if(io.sockets.manager.rooms['/' + pin]) {
            if(io.sockets.manager.rooms['/' + pin].length === 1) { // Rooms with just 1 Player
                console.log('### Match found: Room #' + pin);
                return pin;
            }
        }
    }

    return 0; // No Match found
}

/**
 * Randomly generates Items
 *
 * @param {string} distance
 * @param {number} pid
 * @returns {{type: *, pid: *, distance: *}}
 */
function placeItem(distance, pid) {

    // TODO: Generates Random Items for both players

    var itemTypes = ['small_trap', 'big_trap', 'flying_trap'];
    var type = itemTypes[Math.floor(Math.random()*itemTypes.length)];

    return {
        type: type,
        pid: pid,
        distance: distance
    };
}

/**
 * Randomly generates Hurdles
 */
function placeTrap() {
    // TODO: Generates Random Hurdles for both players
}

//////////////////////////////
// Helper Functions         //
//////////////////////////////
