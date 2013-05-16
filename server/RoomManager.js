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
            players: [],
            theme: 'random'
        },
        initialize: function(){
            console.log("New RoomModel created");
        }
    });

    // Room Collection
    this.RoomCollection = Backbone.Collection.extend({
        model: this.RoomModel
    });

    // New RoomCollection Instance
    this.rooms = new this.RoomCollection();


    ////////////////
    // Sandboxing //
    ////////////////

    this.addRoom(1234, {});
    this.addRoom(1234, {});
//    this.removeRoom(1234);

    console.log(this.rooms.models);

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
        console.log('addRoom(): Room added');
        roomDetail.pin = pin;
        this.rooms.add(roomDetail);
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
    console.log('removeRoom();');
    this.rooms.remove(this.getRoom(pin));
};

/**
 * Gets a Room by PIN
 *
 * @param pin
 */
RoomManager.prototype.getRoom = function(pin) {
    "use strict";
    console.log('getRoom();');
    return this.rooms.findWhere({pin: pin});
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
