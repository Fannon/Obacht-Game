/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

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

    this.fill = 'assets/themes/' + obacht.mp.roomDetail.theme + '/traps/' + this.type + '.png';
    console.log('New Trap: ' + this.type);

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.trap = new lime.Sprite().setSize(obacht.options.trap.general.width, obacht.options.trap.general.height).setPosition(1470, 0).setFill(this.fill).setAnchorPoint(0.5, 0.5).setRotation(270);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    self.drawTrap();
};

obacht.Trap.prototype = {
    /**
     * Draw the trap
     */
    drawTrap: function() {
        "use strict";
        this.layer.appendChild(this.trap);
    }
};
