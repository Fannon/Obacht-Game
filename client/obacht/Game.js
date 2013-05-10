/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Game');

goog.require('obacht.World');
goog.require('obacht.Player');
goog.require('obacht.PlayerController');
goog.require('obacht.themes');
goog.require('obacht.options');
goog.require('goog.pubsub.PubSub');


/**
 * Its a Game scene
 *
 * @constructor
 * @singleton
 * @extends lime.Scene
 */
obacht.Game = function() {
    console.log('New Game();');

    //////////////////////////////
    // Game Model (state)       //
    //////////////////////////////

    this.ownWorld = new obacht.World('own');
    this.enemyWorld = new obacht.World('enemy');
    this.sky = new lime.Sprite().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT).setFill(obacht.themes.path.sky).setPosition(0, 0).setAnchorPoint(0, 0);

    this.playerController = new obacht.PlayerController();

    this.ownPlayer = new obacht.Player('own');
    this.enemyPlayer = new obacht.Player('enemy');

    this.layer = new lime.Layer();
    this.layer.appendChild(this.sky);
    this.layer.appendChild(this.enemyWorld.layer);
    this.layer.appendChild(this.ownWorld.layer);
    this.layer.appendChild(this.enemyPlayer.layer);
    this.layer.appendChild(this.ownPlayer.layer);
    this.layer.appendChild(this.playerController.layer);

};

obacht.Game.prototype = {

};
