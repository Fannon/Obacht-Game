/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Generator');

goog.require('obacht.Trap');
goog.require('obacht.Collision');



//random Value between 0 and 5 for the Array Position
var randomTimeCalculation;

/**
 * Trap and Bonus Generator
 *
 * @constructor
 */
obacht.Generator = function(layer, ownPlayer) {
    "use strict";

    this.trapInterval = undefined;
    this.bonusInterval = undefined;

    obacht.mp.events.subscribe('game_over', function(data){
        this.stopThrowTrap();
        this.stopThrowBonus();
    });
};

obacht.Generator.prototype = {

    getRandomTime: function(minTime, maxTime) {
        "use strict";
        var speedFactor = 1.1;
        return (Math.random() * (maxTime - minTime) + minTime) * speedFactor; // TODO: Faktor
    },

    getRandomTrap: function() {
        "use strict";
        var traps = obacht.themes[obacht.mp.roomDetail.theme].traps;
        var availableTraps = Object.keys(traps);
        var rand = Math.floor(availableTraps.length * Math.random());
        return availableTraps[rand];
    },

    //throw trap
    startThrowTrap: function(){
       "use strict";
        var self = this;

        self.trapInterval = setInterval(function() {
           obacht.mp.throwGeneratedTrap(self.getRandomTrap());
        }, self.getRandomTime(obacht.options.gameplay.generateTrapsMinInterval, obacht.options.gameplay.generateTrapsMaxInterval));
    },

    stopThrowTrap: function() {
        "use strict";
        clearInterval(this.trapInterval);
    },

    //throw bonus
    startThrowBonus: function(){
       "use strict";
        var self = this;

        self.bonusInterval = setInterval(function() {
           obacht.mp.throwBonus(self.getRandomTrap());
        }, self.getRandomTime(obacht.options.gameplay.generateBoniMinInterval, obacht.options.gameplay.generateBoniMaxInterval));
    },

    stopThrowBonus: function() {
        "use strict";
        clearInterval(this.bonusInterval);
    }
};
