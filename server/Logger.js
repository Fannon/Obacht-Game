/* global module */
/* jshint devel:true, node: true */

/**
 * Custom Logger with Color- and Loglevel Support
 *
 * Saves performance by changing the functions on/off while runtime
 * Uses passed through Socket Connection to emit Message to the client that caused the Message
 *
 * @param {Number}  loglevel    From 0 (Everything) to 5 (Nothing)
 * @param {Boolean} timestamp   Timestamp Logoutput
 *
 * @author Simon Heimler
 * @constructor
 * @class
 */
var Logger = function(loglevel, timestamp) {
    "use strict";
    this.setLogLevel(loglevel);
    this.timestamp = timestamp;
};

// Escaped ANSI Color Codes
var blue  = '\033[34m';
var yellow = '\033[33m';
var red   = '\033[31m';
var reset = '\033[0m';

/**
 * Changes the Loglevel (while runtime)
 *
 * @param {Number} loglevel loglevel From 0 (Everything) to 5 (Nothing)
 */
Logger.prototype.setLogLevel = function(loglevel) {
    "use strict";
    var self = this;

    this.loglevel = loglevel;

    console.log('--- Loglevel: ' + loglevel);

    if (loglevel <= 0) {

        /**
         * Create Debug Message
         * @param {String} msg Log Message
         */
        Logger.prototype.debug = function(msg) {
            console.log(reset + self.format(msg) + reset);
        };
    } else {
        Logger.prototype.debug = function(msg) {};
    }

    if (loglevel <= 1) {

        /**
         * Create Info Message
         *
         * @param {String} msg Log Message
         */
        Logger.prototype.info = function(msg) {
            console.log(blue + self.format(msg) + reset);
        };
    } else {
        Logger.prototype.info = function(msg) {};
    }

    if (loglevel <= 2) {

        /**
         * Create Warning Message, emit it via current Socket if given
         *
         * @param {String} msg Log Message
         * @param {object} socket Socket PassTrough
         */
        Logger.prototype.warn = function(msg, socket) {
            console.log(yellow + self.format(msg) + reset);
            if (socket) {
                socket.emit({msg: msg});
            }
        };
    } else {
        Logger.prototype.warn = function(msg, socket) {};
    }

    if (loglevel <= 3) {

        /**
         * Create Error  Message, emit it via current Socket if given
         *
         * @param {String} msg Log Message
         * @param {object} socket Socket PassTrough
         */
        Logger.prototype.error = function(msg, socket) {
            console.log(red + self.format(msg) + reset);
            if (socket) {
                socket.emit('error', {msg: msg});
            }
        };
    } else {
        Logger.prototype.error = function(msg, socket) {};
    }
};

/**
 * Gets the Loglevel (while runtime)
 *
 * @returns {Number} Current Loglevel
 */
Logger.prototype.getLogLevel = function() {
    "use strict";
    return this.loglevel;
};

Logger.prototype.format = function(msg) {
    "use strict";
    var d = new Date();
    if (this.timestamp) {
        return '[' + ((d.getHours() < 10)?"0":"") + d.getHours() +":"+ ((d.getMinutes() < 10)?"0":"") + d.getMinutes() +":"+ ((d.getSeconds() < 10)?"0":"") + d.getSeconds() + '] ' + msg;
    } else {
        return msg;
    }
 };

module.exports = Logger;
