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
obacht.Trap = function(theme, type) {

    console.log('New Trap();');

    var startposx = obacht.options.trap.own.x;
    var startposy = obacht.options.trap.own.y;
    var anchorx = obacht.options.trap.own.anchorx;
    var anchory = obacht.options.trap.own.anchory;

    console.log(theme + ' .. ' + type);

    var file = obacht.themes[theme].traps[type].file;
    var width = obacht.themes[theme].traps[type].width;
    var height = obacht.themes[theme].traps[type].height;
    var boundingBoxes = obacht.themes[theme].traps[type].boundingBoxes;

    this.character = new lime.Sprite().setSize(width, height).setPosition(startposx, startposy).setAnchorPoint(anchorx, anchory).setFill(file);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.character);
};

obacht.Trap.prototype = {

};
