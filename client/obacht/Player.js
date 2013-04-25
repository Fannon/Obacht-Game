/* global goog, obacht */
/* jshint strict: false */

goog.provide('obacht.Player');

goog.require('obacht.Trap');

/**
 * Its a Player Object
 *
 * @constructor
 */
obacht.Player = function(name) {

    console.log('New Player();');

    //////////////////////////////
    // Player Model (state)     //
    //////////////////////////////

    this.name = name;
    this.health = 3;
    this.y = 0;

};

//////////////////////////////
// Player Actions (Logic)   //
//////////////////////////////

// Getter und Setter

/**
 * Lets the Player jump
 */
obacht.Player.prototype = {
    jump: function() {
        "use strict";
        this.y += 1;
        console.log('Jump around!');
    },
    crouch: function() {
        console.log('Crowbar ready');
    },
    throwTrap: function(type) {
        var trap = new obacht.Trap(type);
        console.log("Player " + this.name + " throws " + type);

        // TODO: Logik, etc

        return trap;
    }
};

// throwTrap();
// etc.

//////////////////////////////
// Player Controls (user)   //
//////////////////////////////

// Usereingaben Events

//////////////////////////////
// Player Design            //
//////////////////////////////

// Sprites anziehen etc.


