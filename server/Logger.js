/* global module */
/* jshint devel:true, node: true */

/**
 * Custom Logger with Color- and Loglevel Support
 *
 * Saves performance by changing the functions on/off while runtime
 *
 * @author Simon Heimler
 * @constructor
 *
 * @param {Number} loglevel From 0 (Everything) to 5 (Nothing)
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
        Logger.prototype.warn = function(msg) {
            console.log(yellow + msg + reset);
        };
    } else {
        Logger.prototype.warn = function(msg) {};
    }

    if (loglevel <= 3) {
        Logger.prototype.error = function(msg) {
            console.log(red + msg + reset);
        };
    } else {
        Logger.prototype.error = function(msg) {};
    }
};

Logger.prototype.getLogLevel = function() {
    "use strict";
    return this.loglevel;
};

module.exports = Logger;
