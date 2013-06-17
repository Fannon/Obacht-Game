/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Logger');

/**
 * Custom Logger with Color- and Loglevel Support
 *
 * Saves performance by changing the functions on/off while runtime
 * Uses passed through Socket Connection to emit Message to the client that caused the Message
 *
 * @param {Number} loglevel From 0 (Everything) to 5 (Nothing)
 *
 * @author Simon Heimler
 * @constructor
 * @class
 */
obacht.Logger = function(loglevel) {
    "use strict";
    this.setLogLevel(loglevel);
};

/**
 * Changes the Loglevel (while runtime)
 *
 * @param {Number} loglevel loglevel From 0 (Everything) to 5 (Nothing)
 */
obacht.Logger.prototype.setLogLevel = function(loglevel) {
    "use strict";

    this.loglevel = loglevel;
    console.log('Logger activated: Loglevel: ' + loglevel);

    if (loglevel <= 0) {

        /**
         * Create Debug Message
         * @param {String} msg Log Message
         */
        obacht.Logger.prototype.debug = function(msg) {
            console.log(msg);
            obacht.mp.sendDebugMessage('debug', msg);
        };

        /**
         * Debug Object
         * @param {Object} object JavaScript Object
         */
        obacht.Logger.prototype.dir = function(object) {
            console.dir(object);
        };

    } else {
        obacht.Logger.prototype.debug = function(msg) {};
        obacht.Logger.prototype.dir = function(object) {};
    }

    if (loglevel <= 1) {
        /**
         * Create Info Message
         * @param {String} msg Log Message
         */
        obacht.Logger.prototype.info = function(msg) {
            console.info(msg);
            obacht.mp.sendDebugMessage('info', msg);
        };
    } else {
        obacht.Logger.prototype.info = function(msg) {};
    }

    if (loglevel <= 2) {
        /**
         * Create Warning Message, emit it via current Socket if given
         * @param {String} msg Log Message
         */
        obacht.Logger.prototype.warn = function(msg) {
            console.warn(msg);
            obacht.mp.sendDebugMessage('warn', msg);
        };
    } else {
        obacht.Logger.prototype.warn = function(msg, socket) {};
    }

    if (loglevel <= 3) {
        /**
         * Create Error  Message, emit it via current Socket if given
         *
         * @param {String} msg Log Message
         */
        obacht.Logger.prototype.error = function(msg) {
            console.error(msg);
            obacht.mp.sendDebugMessage('error', msg);
        };
    } else {
        obacht.Logger.prototype.error = function(msg, socket) {};
    }
};

/**
 * Gets the Loglevel (while runtime)
 *
 * @returns {Number} Current Loglevel
 */
obacht.Logger.prototype.getLogLevel = function() {
    "use strict";
    return this.loglevel;
};
