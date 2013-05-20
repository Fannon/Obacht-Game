/* global module */
/* jshint devel:true, node: true */

var _ = require('underscore');
var Backbone = require('backbone');

/** Colored Console Output https://github.com/medikoo/cli-color */
var clc = require('cli-color');
var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;
var intern = clc.blackBright;

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
            closed: false,
            theme: 'random',
            options: {},
            players: [],
            playersCount: 0, // Just for convenience
            playersReady: []
        },
        initialize: function(){
            console.log(intern("--- New RoomModel created"));
        },
        update: function() {
            // Update on Array doesn't work, needs new ArrayRefernce
//            console.log(intern("--- RoomModel updated"));
//            this.set({playersCount: this.get("players").length});
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
        return false;
    } else {
        roomDetail.pin = pin;

        this.rooms.add(roomDetail);

        console.log('--- addRoom(): Room added');
        return true;
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
        console.log(intern('--- removeRoom(): Room Removed'));
        this.rooms.remove(room);
    } else {
        console.log(intern('--- removeRoom(): Room did not exist'));
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
 * @param {Number} pin
 * @param {String} pid
 *
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
        console.log(intern('--- Player ready in Room #' + pin));
        return room.attributes;
    }
};

/**
 * Player joins a Room
 *
 * @param {Number} pin Room PIN
 * @param {String} pid Player ID
 * @param {Boolean} isClosed
 *
 * @return {*} RoomModel if successfull, false if room already full
 */
RoomManager.prototype.joinRoom = function(pin, pid, isClosed) {
    "use strict";

    var room = this.getRoom(pin);

    if (room && room.attributes.players.length > 2) {
        console.log(error('!!! Room Already full! #' + pin));
        return false;
    } else if (room && room.attributes.closed === isClosed) {
        room.set({
            players: _.union(room.attributes.players, [pid]),
            playersCount: room.attributes.players.length + 1
        });
        console.log('--> Client joined Room #' + pin);
        return room.attributes;
    } else {
        console.log(error('!!! Could not join Room ') + pin);
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
            playersReady: _.without(room.attributes.playersReady, pid),
            playersCount: room.attributes.players.length + -1
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
 *
 * @return {number} PIN for Room, false if no Room open
 */
RoomManager.prototype.findMatch = function() {
    "use strict";

    var availableRooms = this.rooms.where({
        playersCount: 1,
        closed: false
    });

    if (availableRooms.length > 0) {
        var randomPin = Math.ceil(Math.random() * availableRooms.length) - 1;
        var pin = availableRooms[randomPin].get("pin");
        console.log('--- Match found: Room #' + pin);
        return pin;
    } else {
        console.log(intern('--- No Match found, returning PIN 0'));
        return 0;
    }
};

module.exports = RoomManager;
