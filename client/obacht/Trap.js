/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

goog.require('goog.pubsub.PubSub');

goog.require('lime.RoundedRect');
goog.require('lime.Node');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.ScaleTo');
goog.require('obacht.options');

/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(type) {

    console.log('New Trap();');
	
    this.type = type;
    this.fill = obacht.options.bonus.general.path + this.type + '.png';

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.x = obacht.options.player.enemy.x;
    this.y = obacht.options.player.enemy.y;
    this.rotation = 180;
    this.jumpHeight = obacht.options.player.general.jumpHeight;
    

    this.health = 3;

    this.character = new lime.RoundedRect().setSize(obacht.options.player.general.width+200, obacht.options.player.general.height+30).setPosition(this.x, this.y).setAnchorPoint(0.5, 1).setFill('#CCC').setRotation(this.rotation).setRenderer(obacht.renderer);
    /*'assets/gfx/hugo4.png'*/
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);

    this.layer.appendChild(this.character);


};

obacht.Trap.prototype = {

};
