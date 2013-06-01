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

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.trap = new lime.Sprite()
        .setSize(obacht.options.trap.general.width, obacht.options.trap.general.height)
        .setFill(this.fill)
        .setPosition(obacht.options.trap.x, obacht.options.trap.y)
        .setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
    this.layer = new lime.Layer().setSize(obacht.options.trap.general.width, obacht.options.trap.general.height);
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
