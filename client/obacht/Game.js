/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

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

    this.ownPlayer = new obacht.Player('own');
    this.enemyPlayer = new obacht.Player('enemy');

    this.layer.appendChild(this.sky);
    this.layer.appendChild(this.enemyWorld.layer);
    this.layer.appendChild(this.ownWorld.layer);
    this.layer.appendChild(this.ownPlayer.graphicsLayer);
    this.layer.appendChild(this.enemyPlayer.graphicsLayer);
    this.layer.appendChild(this.ownPlayer.interactionLayer);

    // Players are properties of the Game


//    this.ownPlayer.jump('player');

    //this.ownPlayer.throwTrap('Igelfisch');

};
