/* global goog, obacht */
/* jshint strict: false */

goog.provide('obacht.Game');

goog.require('obacht.World');
goog.require('obacht.Player');


/**
 * Its a Game scene
 *
 * @constructor
 * @singleton
 * @extends lime.Scene
 */
obacht.Game = function(size) {
    console.log('New Game();');

    //////////////////////////////
    // Game Model (state)       //
    //////////////////////////////

    // World is a property of the Game
    this.ownWorld = new obacht.World();
    this.enemyWorld = new obacht.World();

    // Players are properties of the Game
    this.ownPlayer = new obacht.Player('Harald');
    this.enemyPlayer  = new obacht.Player('Rudi');

    this.ownPlayer.jump();
    this.ownPlayer.throwTrap('Igelfisch');


    console.log("ownPlayer.y: " + this.ownPlayer.y); // Y Koordinate auslesen
};
