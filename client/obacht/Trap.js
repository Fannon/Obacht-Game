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


    ////////////////
    // ATTRIBUTES //
    ////////////////
    var self = this;
    this.type = type;
    this.fill = 'assets/themes/' + obacht.mp.roomDetail.theme + '/traps/' + [this.type] + '.png';
    console.log('New Trap: ' + this.fill);

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
