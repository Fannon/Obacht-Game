/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Game');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

// Obacht Requirements
goog.require('obacht.World');
goog.require('obacht.Player');
goog.require('obacht.Generator');
goog.require('obacht.Trap');


/**
 * Its a Game scene
 *
 * @constructor
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

    this.ownPlayer = new obacht.Player('own');
    this.enemyPlayer = new obacht.Player('enemy');
    this.Trap=new obacht.Trap('test');

    this.layer = new lime.Layer();
    this.layer.appendChild(this.sky);
    this.layer.appendChild(this.enemyWorld.layer);
    this.layer.appendChild(this.ownWorld.layer);
    this.layer.appendChild(this.enemyPlayer.layer);
    this.layer.appendChild(this.ownPlayer.layer);

    this.layer.appendChild(this.Trap.layer);
    this.layer.appendChild(obacht.playerController.layer);

};

obacht.Game.prototype = {

};
