/* global module */
/* jshint devel:true */

/**
 * Room DataStructure for the Server
 *
 * TODO: Make this into an Collection of Room Objects
 *
 * @author Simon Heimler
 *
 * @type {object}
 */
var RoomCollection = function(maxRooms, io) {
    "use strict";
    this.maxRooms = maxRooms;
    this.currentRooms = 0;
    this.rooms = {}; // Room Object
    
    this.io = io; // TODO: Just a temporary Hack
};


/**
 * Generates a Random PIN
 * Checks if it is already in use. If it is, draws a new one.
 *
 * TODO: Refactor this into Room Data Structure
 *
 * @return {number} PIN
 */
RoomCollection.prototype.getNewPin = function() {
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
RoomCollection.prototype.findMatch = function() {
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

module.exports = RoomCollection;
