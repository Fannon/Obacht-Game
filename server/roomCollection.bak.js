/* global module */

/**
 * Room Object
 * Contains Persons
 *
 * @param pin
 * @constructor
 */
var Room = function(pin) {
    "use strict";
    this.pin = pin;
    this.persons = [];
    this.size = 0;
};

Room.prototype.addPerson = function(pid) {
    "use strict";
    this.persons.push(pid);
    this.size++;
};

Room.prototype.removePerson = function(pid) {
    "use strict";
    var index = this.persons.indexOf(pid);
    this.persons.splice(index, 1);
    this.size--;
};

Room.prototype.getSize = function() {
    "use strict";
    return this.size;
};

/**
 * Server Rooms DataStructure
 *
 * This may become the main Data Structure for Room Management of the Server
 * TODO: Right now it is unemployed
 *
 * @singleton
 * @type {object}
 */
var roomCollection = {
    rooms: [],
    hasRoom: function(pin) {
        "use strict";
        if (this.rooms.indexOf(pin) > 0) {
            return true;
        } else {
            return false;
        }
    },
    joinRoom: function(pin, pid) {
        "use strict";
        if (this.hasRoom(pin)) {
            // TODO: Unfertig
            return false;
        }
    }
};


module.exports = roomCollection;
