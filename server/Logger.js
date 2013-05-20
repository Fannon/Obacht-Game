/* global module */
/* jshint devel:true, node: true */

/** Colored Console Output https://github.com/medikoo/cli-color */
var clc = require('cli-color');

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

Logger.prototype.setLogLevel = function(loglevel) {
    "use strict";
    this.loglevel = loglevel;

    if (loglevel <= 0) {
        Logger.prototype.debug = function(msg) {
            console.log(clc.white(msg));
        };
    } else {
        Logger.prototype.debug = function(msg) {};
    }

    if (loglevel <= 1) {
        Logger.prototype.info = function(msg) {
            console.log(clc.blue(msg));
        };
    } else {
        Logger.prototype.info = function(msg) {};
    }

    if (loglevel <= 2) {
        Logger.prototype.warn = function(msg) {
            console.log(clc.yellow(msg));
        };
    } else {
        Logger.prototype.warn = function(msg) {};
    }

    if (loglevel <= 3) {
        Logger.prototype.error = function(msg) {
            console.log(clc.red(msg));
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
