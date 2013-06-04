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
    this.thrownTrapsCounter = 0;
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
        this.trapInterval = setInterval(function() {
            if (self.thrownTrapsCounter % 2) {
                obacht.mp.throwTrap(self.getRandomTrap(), obacht.mp.pid);
            } else {
                obacht.mp.throwTrap(self.getRandomTrap(), obacht.mp.enemy);
            }
            self.thrownTrapsCounter += 1;

        }, self.getRandomTime(obacht.options.gameplay.generateTrapsMinInterval, obacht.options.gameplay.generateTrapsMaxInterval));
    },

    /**
     * Starts trowing Boni to both Players
     */
    startThrowBonus: function(){
       "use strict";
        var self = this;
        this.bonusInterval = setInterval(function() {
            obacht.mp.throwBonus(self.getRandomTrap());
        }, self.getRandomTime(obacht.options.gameplay.generateBoniMinInterval, obacht.options.gameplay.generateBoniMaxInterval));
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {
        "use strict";
        console.log('Cleaning up Generator');
        console.log(this.trapInterval);
        clearInterval(this.trapInterval);
        clearInterval(this.bonusInterval);
    }
};
