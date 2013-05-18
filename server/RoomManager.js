/* global module */
/* jshint devel:true, node: true */

var _ = require('underscore');
var Backbone = require('backbone');

/**
 * Room DataStructure for the Server
 *
 * TODO: Make this into an Collection of Room Objects
 *
 * @author Simon Heimler
 *
 * @type {object}
 */
var RoomManager = function(maxRooms, io) {
    "use strict";


    /////////////////////////////
    // Variables               //
    /////////////////////////////

    this.maxRooms = maxRooms;
    this.io = io; // Socket.io Loop Through


    /////////////////////////////
    // Collections & Models    //
    /////////////////////////////

    // Room Model
    this.RoomModel = Backbone.Model.extend({
        defaults: {
            pin: undefined,
            theme: 'random',
            options: {},
            players: [],
            playersReady: []
        },
        initialize: function(){
            console.log("--- New RoomModel created");
        }
    });

    // New RoomCollection Instance
    this.rooms = new Backbone.Collection([], {
        model: this.RoomModel
    });

};

/**
 * Adds a new Room
 *
 * If Room already exists, returns false
 *
 * @param {Number} pin
 * @param {object} roomDetail
 */
RoomManager.prototype.addRoom = function(pin, roomDetail) {
    "use strict";

    var room = this.getRoom(pin);

    if (room) {
        console.log('--- addRoom(): Room aldready exists');
    } else {
        roomDetail.pin = pin;

        this.rooms.add(roomDetail);

        console.log('--- addRoom(): Room added');
    }
};

/**
 * Remove Room, if exists
 *
 * @param pin
 */
RoomManager.prototype.removeRoom = function(pin) {
    "use strict";

    var room = this.getRoom(pin);
    if (room) {
        console.log('--- removeRoom(): Room Removed');
        this.rooms.remove(room);
    } else {
        console.log('--- removeRoom(): Room did not exist');
    }
};

/**
 * Gets a Room by PIN
 *
 * @param pin
 */
RoomManager.prototype.getRoom = function(pin) {
    "use strict";
    return this.rooms.findWhere({pin: pin});
};

/**
 * Gets all Rooms (Debugging)
 */
RoomManager.prototype.getRoomsDebug = function() {
    "use strict";
    console.log('--- getRoomsDebug();');
    return this.rooms.toJSON();
};

/**
 * Sets the player Ready
 *
 * @param pin
 * @param pid
 * @returns {*}
 */
RoomManager.prototype.playerReady = function(pin, pid) {
    "use strict";

    var room = this.getRoom(pin);
    var playersReady = room.attributes.playersReady;

    if (playersReady.length > 2) {
        console.log('!!! ERROR: More than 2 Players cannot be ready!');
        return false;
    } else {
        room.set({
            playersReady: _.union(playersReady, [pid])
        });
        return room.attributes;
    }
};

/**
 * Player joins a Room
 *
 * @param {Number} pin Room PIN
 * @param {String} pid Player ID
 *
 * @return {*} RoomModel if successfull, false if room already full
 */
RoomManager.prototype.joinRoom = function(pin, pid) {
    "use strict";

    var room = this.getRoom(pin);
    console.dir(room);

    var currentPlayers = room.attributes.players;

    if (currentPlayers.length > 2) {
        console.log('!!! Room Already full!');
        return false;
    } else {
        room.set({
            players: _.union(currentPlayers, [pid])
        });
        return room.attributes;
    }

};

/**
 * Player leaves a Room
 *
 * Removes Player Id from RoomDetail players and playersReady
 *
 * @param {Number} pin Room PIN
 * @param {String} pid Player ID
 */
RoomManager.prototype.leaveRoom = function(pin, pid) {
    "use strict";

    var room = this.getRoom(pin);

    if (room) {
        console.log('--> Player leaves Room #' + pin);

        room.set({
            players: _.without(room.attributes.players, pid),
            playersReady: _.without(room.attributes.playersReady, pid)
        });

        // If no Players left, remove the room
        if (room.attributes.players.length < 1) {
            this.removeRoom(pin);
        }

        return room.attributes;

    } else {
        return false;
    }
};

/**
 * Generates a Random PIN
 * Checks if it is already in use. If it is, draws a new one.
 *
 * @return {number} PIN
 */
RoomManager.prototype.getNewPin = function() {
    "use strict";
    var pin = Math.ceil(Math.random() * this.maxRooms);

    if (!this.getRoom(pin)) {
        return pin;
    } else {
        return this.getNewPin();
    }
};

/**
 * Finds a Match
 *
 * Looks for a Game with just one Player waiting for another
 *
 * TODO: Refactor this into Room Data Structure
 * TODO: Just BruteForce right now, not very performant
 * TODO: Randomize it (?)
 *
 * @return {number} PIN for Room, false if no Room open
 */
RoomManager.prototype.findMatch = function() {
    "use strict";

//    console.log('room length: ' +  this.rooms.length);
//    var randomPin = Math.ceil(Math.random() * this.rooms.length);
//    console.log('Random Pin: ' +  randomPin);
//    console.dir(this.rooms.at(randomPin));
//
//    if (this.rooms[randomPin]) {
//        console.log('--- Match found: Room #' + randomPin);
//        return randomPin;
//    } else {
//        console.log('--- No Match found ' + randomPin);
//        return 0; // No Match found, return 0 to indicate that client has to create a room by itself
//    }

    for (var pin = 1; pin < this.maxRooms; pin++) {
        if(this.io.sockets.manager.rooms['/' + pin]) {
            if(this.io.sockets.manager.rooms['/' + pin].length === 1) { // Rooms with just 1 Player
                console.log('--- Match found: Room #' + pin);
                return pin;
            }
        }
    }
    return 0; // No Match found
};

module.exports = RoomManager;
