/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Collision');
goog.require('obacht.themes');
//goog.require('obacht.Game');

/**
 * Collision Detector
 *
 * @constructor
 */
obacht.Collision = function () {
    "use strict";
};

obacht.Collision.prototype = {
    rect: function (player, trap) {
        "use strict";
        /*Object Position*/
        this.object1pos = player.character.getPosition();
        this.object2pos = trap.character.getPosition();

        /*Size Object1*/
        this.obj1w = player.character.getSize().width;
        this.obj1h = player.character.getSize().height;

        /*Size Object2*/
        this.obj2w = trap.character.getSize().width;
        this.obj2h = trap.character.getSize().height;

        /*Left Top Corner Player*/
        this.obj1x = Math.round(this.object1pos.x / 10) * 10 - (this.obj1w / 2);
        this.obj1y = Math.round(this.object1pos.y / 10) * 10 - (this.obj1h / 2);

        this.obj2x = Math.round(this.object2pos.x / 10) * 10 - (this.obj2w / 2);
        this.obj2y = Math.round(this.object2pos.y / 10) * 10 - (this.obj2h / 2);

        return this.obj1x < this.obj2x + this.obj2w  &&
            this.obj2x < this.obj1x + this.obj1w  &&
            this.obj1y < this.obj2y + this.obj2h &&
            this.obj2y < this.obj1y + this.obj1h;
    }
};
