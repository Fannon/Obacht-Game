/* global module */
/* jshint devel:true, node: true */

var _ = require('underscore');
var Backbone = require('backbone');
var Logger = require('./Logger');
var options = require('./options');

var log = new Logger(options.loglevel); // Set Logging Level

/**
 * Room DataStructure for the Server
 * Uses Backbone.js and Underscore.js for Model/Collection Handling
 *
 * @param {object} io Socket.io Loop Through
 *
 * @author Simon Heimler
 * @constructor
 */
var RoomManager = function(io) {
    "use strict";


    /////////////////////////////
    // Variables               //
    /////////////////////////////

    /** Socket.io */
    this.io = io; // Socket.io Loop Through


    /////////////////////////////
    // Collections & Models    //
    /////////////////////////////

    /** Room Model (Backbone.Model.extend) */
    this.RoomModel = Backbone.Model.extend({
        defaults: {
            pin: undefined,
            closed: false,
            theme: 'random',
            randomTheme: true,
            options: {},
            creatingPlayerId: false,
            creatingPlayerReactiontime: false,
            creatingPlayerReady: false,
            joiningPlayerId: false,
            joiningPlayerReactiontime: false,
            joiningPlayerReady: false,
            playersCount: 0 // Just for convenience
        }
    });

    /**
     * Room Collection Instance
     * This Collection manages all current RoomModels
     */
    this.rooms = new Backbone.Collection([], {
        model: this.RoomModel
    });

};

/**
 * Adds a new Room
 *
 * If Room already exists, returns false
 *
 * @param {Number} pin  Room PIN
 * @param {object} roomDetail roomDetail Object
 *
 * @return {Boolean} Success or not
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
 * @param {Number} pin  Room PIN
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
 * @param {Number} pin  Room PIN
 * @return {Object} roomModel
 */
RoomManager.prototype.getRoom = function(pin) {
    "use strict";
    return this.rooms.findWhere({pin: parseInt(pin, 10)});
};

/**
 * Gets all Rooms (Debugging)
 *
 * @return {String} JSON String of RoomCollection
 */
RoomManager.prototype.getRoomsDebug = function() {
    "use strict";
    log.debug('--- getRoomsDebug();');
    return this.rooms.toJSON();
};

/**
 * Sets the player Ready
 *
 * @param {Number} pin  Room PIN
 * @param {String} pid  Player ID
 *
 * @returns {*} roomDetails if successfull, false if not
 */
RoomManager.prototype.playerReady = function(pin, pid) {
    "use strict";

    var room = this.getRoom(pin);

    if (room.attributes.creatingPlayerId === pid) {
        room.set({
            creatingPlayerReady: true
        });
        log.debug('--- Creating Player ready in Room #' + pin);

    } else if (room.attributes.joiningPlayerId === pid) {
        room.set({
            joiningPlayerReady: true
        });
        log.debug('--- Joining Player ready in Room #' + pin);
    } else {
        log.warn('!!! Player Ready: Player is not in Room! #' + pin);
        return false;
    }

    return room.attributes;
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

    // Catch Error Cases
    if (!room) {
        log.warn('!!! Tried to join Room #' + pin + ' that doesnt exist');
        return {msg: 'Cannot join, room does not exist!'};
    } else if (room.attributes.closed !== isClosed) {
        log.warn('!!! Tried to join Room with different Privacy Setting');
        return false;
    }

    // Set Player
    if (!room.attributes.creatingPlayerId) {
        room.set({
            creatingPlayerId: pid,
            playersCount: room.attributes.playersCount + 1
        });
        log.debug('--> Creating Player joined Room #' + pin);
        return room.attributes;

    } else if (!room.attributes.joiningPlayerId) {
        room.set({
            joiningPlayerId: pid,
            playersCount: room.attributes.playersCount + 1
        });
        log.debug('--> Joining Player joined Room #' + pin);
        return room.attributes;
    } else {
        log.warn('!!! Room Already full! #' + pin);
        return {msg: 'Cannot join, room is already full!'};
    }

};

/**
 * Player leaves a Room
 *
 * Removes Player Id from RoomDetail players and playersReady
 *
 * @param {Number} pin  Room PIN
 * @param {String} pid  Player ID
 *
 * @return {*} RoomModel if successfull
 */
RoomManager.prototype.leaveRoom = function(pin, pid) {
    "use strict";

    var room = this.getRoom(pin);

    if (room) {
        log.debug('--> Player leaves Room #' + pin);

        if (room.attributes.creatingPlayerId === pid) {
            room.set({
                creatingPlayerId: false,
                creatingPlayerReactiontime: false,
                creatingPlayerReady: false,
                playersCount: room.attributes.playersCount - 1
            });
            log.debug('--> Creating Player left Room #' + pin);
            return room.attributes;

        } else if (room.attributes.joiningPlayerId === pid) {
            room.set({
                creatingPlayerId: false,
                creatingPlayerReactiontime: false,
                creatingPlayerReady: false,
                playersCount: room.attributes.playersCount - 1
            });
            log.debug('--> Joining Player left Room #' + pin);
            return room.attributes;
        } else {
            log.warn('!!! Player Left: Player has not been in Room! #' + pin);
        }

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
 * Checks (compares) Reaction Time between both Players and declares the winner.
 * If other Player hasn't committed his reactiontime yet, returns false
 *
 *
 * @param {Number} pin      Room PIN
 * @param {String} pid      Player ID
 * @param {Object} data     Reaction Time / Bonus Data
 *
 * @return {*} Receive Bonus Object or false if calculation incomplete yet
 */
RoomManager.prototype.checkReactiontime = function(pin, pid, data) {
    "use strict";

    var room = this.getRoom(pin);
    var receiveBonus = {
        type: data.type,
        winner_pid: false
    };

    if (room) {

        // Set Reaction Time
        if (room.attributes.creatingPlayerId === pid) {
            room.set({
                creatingPlayerReactiontime: data.reaction_time
            });
        } else if (room.attributes.joiningPlayerId === pid) {
            room.set({
                joiningPlayerReactiontime: data.reaction_time
            });
        } else {
            log.warn('!!! Check Reaction Time : Player is not in Room! #' + pin);
        }

        if (room.attributes.creatingPlayerReactiontime && room.attributes.joiningPlayerReactiontime) {

            // Compare and declare the winner
            if (room.attributes.creatingPlayerReactiontime < room.attributes.joiningPlayerReactiontime) {
                receiveBonus.winner_pid = room.attributes.creatingPlayerId;
            } else {
                receiveBonus.winner_pid = room.attributes.joiningPlayerId;
            }

            // Reset Reaction Time for both Players
            room.set({
                creatingPlayerReactiontime: false,
                joiningPlayerReactiontime: false
            });

            return receiveBonus;
        } else {
            // Missing at least one ReactionTime. Waiting for other Player.
            return false;
        }

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
