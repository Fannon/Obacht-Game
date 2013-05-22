/* global module */
/* jshint devel:true, node: true */

/**
 * Custom Logger with Color- and Loglevel Support
 *
 * Saves performance by changing the functions on/off while runtime
 *
 * @param {Number} loglevel From 0 (Everything) to 5 (Nothing)
 *
 * @author Simon Heimler
 * @constructor
 * @class
 * @scope _global_
 */
var Logger = function(loglevel) {
    "use strict";
    this.setLogLevel(loglevel);
};

// Escaped ANSI Color Codes
var blue  = '\033[34m';
var yellow = '\033[33m';
var red   = '\033[31m';
var reset = '\033[0m';

Logger.prototype.setLogLevel = function(loglevel) {
    "use strict";
    this.loglevel = loglevel;

    if (loglevel <= 0) {
        Logger.prototype.debug = function(msg) {
            console.log(reset + msg + reset);
        };
    } else {
        Logger.prototype.debug = function(msg) {};
    }

    if (loglevel <= 1) {
        Logger.prototype.info = function(msg) {
            console.log(blue + msg + reset);
        };
    } else {
        Logger.prototype.info = function(msg) {};
    }

    if (loglevel <= 2) {
        Logger.prototype.warn = function(msg, socket) {
            console.log(yellow + msg + reset);
            if (socket) {
                socket.emit('error', {type: 'warning', msg: msg});
            }
        };
    } else {
        Logger.prototype.warn = function(msg, socket) {};
    }

    if (loglevel <= 3) {
        Logger.prototype.error = function(msg, socket) {
            console.log(red + msg + reset);
            if (socket) {
                socket.emit('error', {type: 'error', msg: msg});
            }
        };
    } else {
        Logger.prototype.error = function(msg, socket) {};
    }
};

Logger.prototype.getLogLevel = function() {
    "use strict";
    return this.loglevel;
};

module.exports = Logger;
