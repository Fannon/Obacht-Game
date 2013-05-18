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
            console.log("New RoomModel created");
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
 *
 * @returns {boolean}
 */
RoomManager.prototype.addRoom = function(pin, roomDetail) {
    "use strict";

    var room = this.getRoom(pin);

    if (room) {
        console.log('addRoom(): Room aldready exists');
        return false;
    } else {
        roomDetail.pin = pin;

        this.rooms.add(roomDetail);

        console.log('addRoom(): Room added');
        return room;
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
        console.log('removeRoom(): Room Removed');
        this.rooms.remove(room);
    } else {
        console.log('removeRoom(): Room did not exist');
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
    console.log('getRoomsDebug();');
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
 * Updates Room with new roomDetail Data
 * Keeps old data if not overwritten
 *
 * TODO: Doesn't work
 *
 * @param {Number} pin
 * @param {object} roomDetail
 */
RoomManager.prototype.updateRoom = function(pin, roomDetail) {
    "use strict";

    var room = this.getRoom(pin);

//    var newRoomAttributes = _.extend(room.attributes, roomDetail);
//    room.set(newRoomAttributes);

    console.log('--- Updated Room #' + pin);
    console.dir(room.attributes);

//    return newRoomAttributes;

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
    var currentPlayers = room.attributes.players;

    if (currentPlayers.length > 2) {
        console.log('!!! Room Already full!');
        return false;
    } else {
        room.set({
            players: _.union(currentPlayers, [pid])
        });
        return room;
    }

};

/**
 * Player leaves a Room
 *
 * @param {Number} pin Room PIN
 * @param {String} pid Player ID
 */
RoomManager.prototype.leaveRoom = function(pin, pid) {
    "use strict";

    var room = this.rooms.findWhere({pin: pin});
    var currentPlayers = room.attributes.players;

    room.set({
        players: _.without(currentPlayers, [pid])
    });

    return room;

};

/**
 * Generates a Random PIN
 * Checks if it is already in use. If it is, draws a new one.
 *
 * TODO: Refactor this into Room Data Structure
 *
 * @return {number} PIN
 */
RoomManager.prototype.getNewPin = function() {
    "use strict";
    var pin = Math.floor(Math.random() * this.maxRooms);

    if (this.io.sockets.clients(pin).length > 0) {
        console.log('### Room already used, trying again.');
        return this.getNewPin();
    } else {
        return pin;
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
    for (var pin = 1; pin < this.maxRooms; pin++) {
        if(this.io.sockets.manager.rooms['/' + pin]) {
            if(this.io.sockets.manager.rooms['/' + pin].length === 1) { // Rooms with just 1 Player
                console.log('### Match found: Room #' + pin);
                return pin;
            }
        }
    }

    return 0; // No Match found
};

module.exports = RoomManager;
