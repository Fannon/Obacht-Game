/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

goog.require('goog.pubsub.PubSub');

goog.require('lime.RoundedRect');
goog.require('lime.Node');
goog.require('obacht.options');

goog.require('lime.Sprite');

/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(type) {

    console.log('New Trap();');

    this.type = type;
    this.character = new lime.Sprite().setSize(obacht.options.trap.general.width, obacht.options.trap.general.height).setPosition(obacht.options.trap.own.x, obacht.options.trap.own.y).setAnchorPoint(0.5, 1).setFill('#999');
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.character);
};

obacht.Trap.prototype = {

};
