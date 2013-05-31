/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Generator');

goog.require('obacht.Trap');
goog.require('obacht.Collision');

/**
 * Trap and Bonus Generator
 *
 * @param {Number} speedFactor Speed Factor PassThru
 *
 * @constructor
 */
obacht.Generator = function(speedFactor) {
    "use strict";
    this.speedFactor = speedFactor;
};

obacht.Generator.prototype = {

    /**
     * Calculates a random Time (in ms) between a minimum and maximum
     *
     * @param {Number} minTime
     * @param {Number} maxTime
     * @returns {number}
     */
    getRandomTime: function(minTime, maxTime) {
        "use strict";
        return (Math.random() * (maxTime - minTime) + minTime) * this.speedFactor;
    },

    /**
     * Returns a random Trap type, fitting to the current Theme
     *
     * @returns {String}
     */
    getRandomTrap: function() {
        "use strict";
        var traps = obacht.themes[obacht.mp.roomDetail.theme].traps;
        var availableTraps = Object.keys(traps);
        var rand = Math.floor(availableTraps.length * Math.random());
        return availableTraps[rand];
    },

    /**
     * Starts trowing Traps to both Players
     */
    startThrowTrap: function(){
       "use strict";
        var self = this;

        obacht.intervals.trapInterval = setInterval(function() {
           obacht.mp.throwGeneratedTrap(self.getRandomTrap());
        }, self.getRandomTime(obacht.options.gameplay.generateTrapsMinInterval, obacht.options.gameplay.generateTrapsMaxInterval));
    },

    /**
     * Starts trowing Boni to both Players
     */
    startThrowBonus: function(){
       "use strict";
        var self = this;

        obacht.intervals.bonusInterval = setInterval(function() {
           obacht.mp.throwBonus(self.getRandomTrap());
        }, self.getRandomTime(obacht.options.gameplay.generateBoniMinInterval, obacht.options.gameplay.generateBoniMaxInterval));
    }
};
