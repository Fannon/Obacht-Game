/* global goog, obacht */
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
    this.world = new obacht.World();

    // Players are properties of the Game
    this.player1 = new obacht.Player();
    this.player2  = new obacht.Player();

    this.player1.jump();
    console.log(this.player1.y);
};
