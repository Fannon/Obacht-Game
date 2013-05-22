/* global module */
/* jshint devel:true, node: true */

var _ = require('underscore');
var Backbone = require('backbone');
var Logger = require('./Logger');
var options = require('./options');

/** Custom Logger */
var log = new Logger(options.loglevel); // Set Logging Level

/**
 * Room DataStructure for the Server
 *
 * @author Simon Heimler
 *
 * @param {object} io Socket.io Loop Through
 */
var RoomManager = function(io) {
    "use strict";


    /////////////////////////////
    // Variables               //
    /////////////////////////////

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
            randomTheme: true,
            options: {},
            players: [],
            playersCount: 0, // Just for convenience
            playersReady: []
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
        log.warn('!!! addRoom(): Room aldready exists');
        return false;
    } else {
        roomDetail.pin = pin;
        this.rooms.add(roomDetail);
        log.info('--- New Room created! (' + this.rooms.length + ' TOTAL)');
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
        log.debug('--- removeRoom(): Room Removed');
        this.rooms.remove(room);
    } else {
        log.debug('--- removeRoom(): Room did not exist');
    }
};

/**
 * Gets a Room by PIN
 *
 * @param pin
 */
RoomManager.prototype.getRoom = function(pin) {
    "use strict";
    return this.rooms.findWhere({pin: parseInt(pin, 10)});
};

/**
 * Gets all Rooms (Debugging)
 */
RoomManager.prototype.getRoomsDebug = function() {
    "use strict";
    log.debug('--- getRoomsDebug();');
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
        log.debug('!!! ERROR: More than 2 Players cannot be ready!');
        return false;
    } else {
        room.set({
            playersReady: _.union(playersReady, [pid])
        });
        log.debug('--- Player ready in Room #' + pin);
        return room.attributes;
    }
};

/**
 * Player joins a Room
 *
 * @param {Number}  pin         Room PIN
 * @param {String}  pid         Player ID
 * @param {Boolean} isClosed    Room is private or not
 *
 * @return {*} RoomModel if successfull, false if room already full
 */
RoomManager.prototype.joinRoom = function(pin, pid, isClosed) {
    "use strict";

    var room = this.getRoom(pin);

    // Catch all Error Cases
    if (!room) {
        log.warn('!!! Tried to join Room #' + pin + ' that doesnt exist');
        return {msg: 'Cannot join, room does not exist!'};
    } else if (room.attributes.players.length > 1) {
        log.warn('!!! Room Already full! #' + pin);
        return {msg: 'Cannot join, room is already full!'};
    } else if (room.attributes.closed !== isClosed) {
        log.warn('!!! Tried to join Room with different Privacy Setting');
        return false;
    } else {
        room.set({
            players: _.union(room.attributes.players, [pid]),
            playersCount: room.attributes.players.length + 1
        });
        log.debug('--> Player joined Room #' + pin);
        return room.attributes;
    }

};

/**
 * Player leaves a Room
 *
 * Removes Player Id from RoomDetail players and playersReady
 *
 * @param {Number} pin  Room PIN
 * @param {String} pid  Player ID
 */
RoomManager.prototype.leaveRoom = function(pin, pid) {
    "use strict";

    var room = this.getRoom(pin);

    if (room) {
        log.debug('--> Player leaves Room #' + pin);

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
 * Public Room PIN's start with a Number higher than the maximum private PIN
 *
 * @param {Boolean} isClosed    Room is private or not
 * @return {number} PIN
 */
RoomManager.prototype.getNewPin = function(isClosed) {
    "use strict";
    var pin = 0;
    if (isClosed) {
        pin = Math.ceil(Math.random() * options.maxPrivateRooms);
    } else {
        pin = Math.ceil(Math.random() * options.maxPublicRooms) + options.maxPrivateRooms + 1;
    }

    if (!this.getRoom(pin)) {
        return pin;
    } else {
        return this.getNewPin(isClosed);
    }
};

/**
 * Finds a Match
 *
 * Looks for a Game with just one Player waiting for another
 *
 * @return {number} PIN for Room, 0 if no other Player available
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
        log.debug('--- Match found: Room #' + pin);
        return pin;
    } else {
        log.debug('--- No Match found, returning PIN 0');
        return 0;
    }
};

module.exports = RoomManager;
