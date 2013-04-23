/* global goog, obacht */
goog.provide('obacht.Player');

/**
 * Its a Player Object
 *
 * @constructor
 */
obacht.Player = function() {

    console.log('New Player();');

    //////////////////////////////
    // Player Model (state)     //
    //////////////////////////////

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
obacht.Player.prototype.jump = function() {
    "use strict";
    this.y += 1;
    console.log('Jump around!');
};

obacht.Player.prototype.crouch = function() {
    console.log('Crowbar ready');
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


