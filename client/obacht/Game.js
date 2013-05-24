/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Game');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

// Obacht Requirements
goog.require('obacht.World');
goog.require('obacht.Player');
goog.require('obacht.Generator');
goog.require('obacht.Bonus');


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

    this.theme = obacht.themes[obacht.mp.roomDetail.theme];
    console.dir(this.theme);

    this.ownWorld = new obacht.World('own', this.theme);
    this.enemyWorld = new obacht.World('enemy', this.theme);
    this.sky = new lime.Sprite().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT).setFill(this.theme.world.files.sky).setPosition(0, 0).setAnchorPoint(0, 0);

    this.ownPlayer = new obacht.Player('own', this.theme);
    this.enemyPlayer = new obacht.Player('enemy', this.theme);

    //this.bonus = new obacht.Bonus('snake');

    this.layer = new lime.Layer();
    this.layer.appendChild(this.sky);
    this.layer.appendChild(this.enemyWorld.layer);
    this.layer.appendChild(this.ownWorld.layer);
    this.layer.appendChild(this.enemyPlayer.layer);
    this.layer.appendChild(this.ownPlayer.layer);
    //this.layer.appendChild(this.bonus);

    this.layer.appendChild(obacht.playerController.layer);

    this.generator = new obacht.Generator(this.layer, this.ownPlayer);

    this.layer.appendChild(obacht.playerController.layer);

};

obacht.Game.prototype = {

};
