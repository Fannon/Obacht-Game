/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Generator');

goog.require('obacht.Trap');
goog.require('obacht.Collision');

//Array for different random Times
var randomTime = [];
    randomTime[0] = 3000;
    randomTime[1] = 3500;
    randomTime[2] = 4000;
    randomTime[3] = 4500;
    randomTime[4] = 5000;

//random Value between 0 and 5 for the Array Position
var randomTimeCalculation;

/**
 * Trap and Bonus Generator
 *
 * @constructor
 */
obacht.Generator = function(layer, ownPlayer) {
    "use strict";

//    var trap = new obacht.Trap(obacht.mp.roomDetail.theme, 'scarecrow');
    var trap = new obacht.Trap('meadow', 'scarecrow');

    this.timeout();


    layer.appendChild(trap.layer);

    //Startwinkel & Winkelgeschwindigkeit
    var startwinkel = 45;
    var winkel = startwinkel;
    var winkelgeschwindigkeit = 0.05;
    //Startposition
    var groundx = 200;
    var groundy = 1490;
    var faktor = 950;
    faktor = 1070;

    lime.scheduleManager.schedule(function(dt) {

        var position = trap.character.getPosition();
        position.x = Math.sin(winkel) * faktor + groundx;
        position.y = Math.cos(winkel) * faktor + groundy;
        trap.character.setPosition(position);

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

    }, trap);

};

obacht.Generator.prototype = {

    //throw trap
    startThrowTrap: function(){
       "use strict";
       var self = this;
       self.timeout();
    },

    //waiting for a trap
    startRandomTime: function(){
        "use strict";
        randomTimeCalculation = Math.floor(Math.random()*randomTime.length);
        var self = this;
        setTimeout(function() {
            self.startThrowTrap();
        }, randomTime[randomTimeCalculation]);
    },

    //timeout - no trap can be thrown
    timeout: function(){
        "use strict";
        var self = this;
        setTimeout(function() {
            self.startRandomTime();
        }, 2000);
    }

};
