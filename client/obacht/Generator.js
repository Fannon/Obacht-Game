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

//    layer.appendChild(trap.layer);

    //Startwinkel & Winkelgeschwindigkeit
//    var startwinkel = 45;
//    var winkel = startwinkel;
//    var winkelgeschwindigkeit = 0.05;
//    //Startposition
//    var groundx = 200;
//    var groundy = 1490;
//    var faktor = 950;
//    faktor = 1070;

    obacht.mp.events.subscribe('game_over', function(data){
        this.stopThrowTrap();
        this.stopThrowBonus();
    });

//    lime.scheduleManager.schedule(function(dt) {
            /*
        var position = trap.character.getPosition();
        position.x = Math.sin(winkel) * faktor + groundx;
        position.y = Math.cos(winkel) * faktor + groundy;
        trap.character.setPosition(position);
              */
//        var Collision = new obacht.Collision();

//        if (Collision.rect(ownPlayer, trap) === true) {
//            //console.log('Kollsion mit User');
//            winkel = startwinkel;
//        } else if (trap.character.getPosition().x < 0) {
//            console.log('Gegen die Wand');
//            winkel = startwinkel;
//        }
//
//        winkel = winkel + winkelgeschwindigkeit;

//    }, trap);

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
