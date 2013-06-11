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
    var self = this;


    /////////////////////////////
    // Collections & Models    //
    /////////////////////////////

    /** Room Model (Backbone.Model.extend) */
    this.RoomModel = Backbone.Model.extend({
        // Default Values
        defaults: {
            pin: undefined,
            closed: false,
            theme: 'random',
            randomTheme: true,
            options: {},
            creatingPlayerId: false,
            creatingPlayerReactiontime: false,
            creatingPlayerReady: false,
            creatingPlayerHealth: 3,
            joiningPlayerId: false,
            joiningPlayerReactiontime: false,
            joiningPlayerReady: false,
            joiningPlayerHealth: 3,
            playersCount: 0, // Just for convenience
            created: Date.now()
        }
    });

    /**
     * On Model Change Event:
     * Publish current Room Details to every Player in Room
     * @event
     */
    this.RoomModel.prototype.on("change", function(model) {
        self.io.sockets['in'](model.attributes.pin).emit('room_detail', model.attributes);
    });


    /**
     * Room Collection Instance
     * This Collection manages all current RoomModels
     */
    this.rooms = new Backbone.Collection([], {
        model: this.RoomModel
    });

    /**
     * Cleaning Up Interval: Removes unused Rooms if they are not removed correctly.
     */
    setInterval(function() {
        self.cleanUp();
    }, options.roomPurgeInterval * 60 * 1000);

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
        log.warn('--- removeRoom(): Room did not exist');
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
 * @param {Object} socket Current socket Object
 *
 * @returns {*} roomDetails if successfull, false if not
 */
RoomManager.prototype.playerReady = function(socket) {
    "use strict";

    var pin = socket.pin;
    var pid = socket.pid;
    var room = this.getRoom(pin);

    if (room && room.attributes.creatingPlayerId === pid) {
        room.set({
            creatingPlayerReady: true
        });
        log.debug('--- Creating Player ready in Room #' + pin);

    } else if (room && room.attributes.joiningPlayerId === pid) {
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
 * Sets new Player Status (Health..)
 *
 * @param {Object} socket
 * @param {Object} player_status
 *
 * @returns {*} roomDetails if successfull, false if not
 */
RoomManager.prototype.playerStatus = function(socket, player_status) {
    "use strict";

    var pin = socket.pin;
    var pid = socket.pid;

    var room = this.getRoom(pin);

    if (room.attributes.creatingPlayerId === pid) {
        room.set({
            creatingPlayerHealth: player_status.health
        });
        log.debug('--- Creating Player StatusUpdate in Room #' + pin);

    } else if (room.attributes.joiningPlayerId === pid) {
        room.set({
            joiningPlayerHealth: player_status.health
        });
        log.debug('--- Joining Player StatusUpdate in Room #' + pin);
    } else {
        log.warn('!!! Player StatusUpdate: Player is not in Room! #' + pin, socket);
        return false;
    }

    return room.attributes;
};


/**
 * Player joins a Room
 *
 * @param {Object}  socket      Current socket Object
 * @param {Number}  pin         Room PIN
 * @param {Boolean} isClosed    Room is private or not
 *
 * @return {*} RoomModel if successfull, false if room already full
 */
RoomManager.prototype.joinRoom = function(socket, pin, isClosed) {
    "use strict";

    var pid = socket.pid;
    var room = this.getRoom(pin);

    // Catch Error Cases
    if (!room) {
        log.warn('!!! Tried to join Room #' + pin + ' that doesnt exist', socket);
        return {
            type: 'warning',
            msg: 'Cannot join, room does not exist!'
        };
    } else if (room.attributes.closed !== isClosed) {
        log.warn('!!! Tried to join Room with different Privacy Setting', socket);
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
        log.warn('!!! Room Already full! #' + pin, socket);
        return {
            type: 'warning',
            msg: 'Cannot join, room is already full!'
        };
    }

};

/**
 * Player leaves a Room
 *
 * Removes Player Id from RoomDetail players and playersReady
 *
 * @param {Object} socket Current socket Object
 *
 * @return {*} RoomModel if successfull
 */
RoomManager.prototype.leaveRoom = function(socket) {
    "use strict";

    var pin = socket.pin;
    var pid = socket.pid;
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

        } else if (room.attributes.joiningPlayerId === pid) {
            room.set({
                joiningPlayerId: false,
                joiningPlayerReactiontime: false,
                joiningPlayerReady: false,
                playersCount: room.attributes.playersCount - 1
            });
            log.debug('--> Joining Player left Room #' + pin);
        } else {
            log.warn('!!! Player Left: Player has not been in Room! #' + pin, socket);
        }

        // If no Players left, remove the room
        if (room.attributes.playersCount < 1) {
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
 * @param {Object} socket Current socket Object
 * @param {Object} data     Reaction Time / Bonus Data
 *
 * @return {*} Receive Bonus Object or false if calculation incomplete yet
 */
RoomManager.prototype.checkReactiontime = function(socket, data) {
    "use strict";

    var pin = socket.pin;
    var pid = socket.pid;
    var room = this.getRoom(pin);

    var receiveBonus = {
        type: data.type,
        winner_pid: false
    };

    if (room) {

        // Set Reaction Time
        if (room.attributes.creatingPlayerId === pid) {
            room.attributes.creatingPlayerReactiontime = data.reaction_time;
        } else if (room.attributes.joiningPlayerId === pid) {
            room.attributes.joiningPlayerReactiontime = data.reaction_time;
        } else {
            log.warn('!!! Check Reaction Time : Player is not in Room! #' + pin, socket);
        }

        // If both ReactionTimes are set: Compare them and declare the Winner
        if (room.attributes.creatingPlayerReactiontime && room.attributes.joiningPlayerReactiontime) {

            log.debug('--- Check Reactiontime: ' + room.attributes.creatingPlayerReactiontime + ' vs. ' + room.attributes.joiningPlayerReactiontime);

            // Compare and declare the winner
            if (room.attributes.creatingPlayerReactiontime === room.attributes.joiningPlayerReactiontime) {
                log.debug('Player Reactiontime: Tie or both Players missed');
            } else if (room.attributes.creatingPlayerReactiontime < room.attributes.joiningPlayerReactiontime) {
                receiveBonus.winner_pid = room.attributes.creatingPlayerId;
            } else {
                receiveBonus.winner_pid = room.attributes.joiningPlayerId;
            }

            // Reset Reaction Time for both Players
            room.attributes.creatingPlayerReactiontime = false;
            room.attributes.joiningPlayerReactiontime = false;


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

/**
 * Cleans up Room Collection
 * Looks for Rooms which are older than a specific time and removes them.
 * Usually they are removed automatically, but sometimes they are not.
 */
RoomManager.prototype.cleanUp = function() {
    "use strict";
    var self = this;

    var now = Date.now();
    var timeOut = now - options.roomPurgeTimeout * 60 * 1000;
    var roomsPurged = 0;

    this.rooms.each(function(room) {
        if (room.attributes.created < timeOut) {
            log.warn('!!! Purging Room #' + room.attributes.pin);
            self.removeRoom(room.attributes.pin);
        }
    });

    log.info('--- CleanUp: Purged ' + roomsPurged + ' Rooms.');

};

module.exports = RoomManager;
