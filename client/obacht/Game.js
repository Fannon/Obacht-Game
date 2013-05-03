/* global goog, obacht */
/* jshint strict: false */

goog.provide('obacht.Game');

goog.require('obacht.World');
goog.require('obacht.Player');
goog.require('obacht.themes');
goog.require('obacht.options');



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

    this.layer = new lime.Layer();
    this.ownWorld = new obacht.World('bottom');
    this.enemyWorld = new obacht.World('top');
    this.sky = new lime.Sprite().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT).setFill(obacht.themes.path.sky).setPosition(0, 0).setAnchorPoint(0, 0);

    this.layer.appendChild(this.sky);
    this.layer.appendChild(this.enemyWorld.layer);
    this.layer.appendChild(this.ownWorld.layer);

    // Players are properties of the Game
    this.ownPlayer = new obacht.Player('Harald');
    this.enemyPlayer  = new obacht.Player('Rudi');

    this.ownPlayer.jump();
    this.ownPlayer.throwTrap('Igelfisch');


    console.log("ownPlayer.y: " + this.ownPlayer.y); // Y Koordinate auslesen
};
