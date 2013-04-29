/* global require, socket, process */
/* jshint strict: false */

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

    socket.emit('connected', true);
    console.log('+++ NEW REMOTE CONNECTION');

    /**
     * New Room Request
     */
    socket.on('new_room', function() {
        var pin = 'P' + getNewPin(); // Private Room
        socket.emit('new_room_pin', pin);
        console.log('--> Client requested new Room PIN #' + pin);
    });

    /**
     * Join Room Request
     */
    socket.on('join_room', function(pin) {

        // Leave old Room and join new one
        if (socket.room) {
            console.log('--> Client leaves Room #' + socket.room);
            socket.leave(socket.room);
        }
        socket.room = pin;

        if (io.sockets.clients(pin).length < gameServer.maxPlayers) {
            socket.join(pin);
            socket.emit('room_pin', pin);
            console.log('--> Client joined Room #' + pin);
        } else {
            socket.emit('room_pin', false);
            console.log('--> Client tryed to join full Room #' + pin);
        }

    });

    /**
     * Find Match Request
     */
    socket.on('find_match', function() {

        console.log('--> Client request new Match');

        if (socket.room) {
            socket.leave(socket.room);
        }

        var pin = findMatch();

        if (pin) {
            socket.emit('new_room_pin', pin);
        } else {
            socket.emit('no_match_found');
        }
    });

    /**
     * Leave Room Request
     */
    socket.on('leave_room', function() {
        if (socket.room) {
            socket.leave(socket.room);
        }
    });

    /**
     * Broadcast to other Players in Room Request
     */
    socket.on('player_move', function(data) {
        console.log('<-> Broadcasting Player Movement in Room #' + socket.room);
        socket.broadcast.to(socket.room).emit('player_move', data);
    });

    /**
     * Broadcast to other Players in Room Request
     */
    socket.on('thrown_hurdle', function(data) {

        console.log('<-> Processing Incoming Hurdle in Room #' + socket.room);

        // TODO: process data, coordinates and hurdle type
        // Check if action is valid and generate return data

        // Broadcast to all Players in the room
        io.sockets.in(socket.room).emit('hurdle', data);
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
function getNewPin() {

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
 *
 * @return {integer} PIN for Room, false if no Room open
 */
function findMatch() {

    for (var pin = 0; pin < gameServer.maxPin; pin++) {
        if(io.sockets.manager.rooms['/' + pin]) {
            if(io.sockets.manager.rooms['/' + pin].length === 1) {
                console.log('### Match found: Room #' + pin);
                return pin;
            }
        }
    }

    return false;
}

/**
 * Randomly generates Items
 */
function throwBonus() {
    // TODO: Generates Random Items for both players
}

/**
 * Randomly generates Hurdles
 */
function throwTrap() {
    // TODO: Generates Random Hurdles for both players
}

//////////////////////////////
// Helper Functions         //
//////////////////////////////
