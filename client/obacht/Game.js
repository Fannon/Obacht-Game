/* global goog, obacht */
goog.provide('obacht.Game');

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

    this.player1 = new obacht.Player();
    this.player2  = new obacht.Player();

    this.player1.jump();
};
