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

    ////////////////
    // ATTRIBUTES //
    ////////////////
    var self = this;
    this.type = type;
    this.theme = theme;
    this.fill = obacht.themes[this.theme].traps[this.type]+'.png';

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.trap = new lime.RoundedRect().setSize(obacht.options.bonus.general.size, obacht.options.bonus.general.size).setPosition(obacht.options.bonus.general.x, obacht.options.bonus.general.y).setFill(this.fill).setAnchorPoint(0, 0).setRadius(15);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    self.drawBonus();
};

obacht.Trap.prototype = {
    /**
     * Draw the bonus-button
     */
    drawBonus: function() {
        "use strict";
        this.layer.appendChild(this.trap);
    }
};
