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
obacht.Collision = function (player, trap) {
    "use strict";
    this.object1pos = player.character.getPosition();
    this.object2pos = trap.character.getPosition();

    /*Size Object1*/
    this.obj1w = player.character.getSize().width;
    this.obj1h = player.character.getSize().height;

    /*Left Top Corner Player*/
    this.obj1x = Math.round(this.object1pos.x / 10) * 10 + (this.obj1w / 2);
    this.obj1y = Math.round(this.object1pos.y / 10) * 10 - (this.obj1h / 2);

    /*Size Object2*/
    this.obj2w = trap.character.getSize().width;
    this.obj2h = trap.character.getSize().height;

    /*Left Top Corner Trap*/
    this.obj2x = Math.round(this.object2pos.x / 10) * 10 + (this.obj2w / 2);
    this.obj2y = Math.round(this.object2pos.y / 10) * 10 - (this.obj2h / 2);

    /*Request BoundingBoxes | Name = BoundingBoxes Object 2*/
    this.bbobj1 = player.boundingBoxes;
    this.bbobj2 = trap.boundingBoxes;

    var state = false;
    var i = 0;
    while (i < trap.boundingBoxes.length) {

        //New Player i==0
        this.obj1x = this.obj1x - this.bbobj1[0].x;
        this.obj1y = this.obj1y + this.bbobj1[0].y;

        this.obj1w = this.bbobj1[0].width;
        this.obj1h = this.bbobj1[0].height;

        //New Trap
        this.obj2x = this.obj2x - this.bbobj2[i].x;
        this.obj2y = this.obj2y + this.bbobj2[i].y;

        this.obj2w = this.bbobj2[i].width;
        this.obj2h = this.bbobj2[i].height;

        if (this.obj1x < this.obj2x + this.obj2w  &&
            this.obj2x < this.obj1x + this.obj1w  &&
            this.obj1y < this.obj2y + this.obj2h &&
            this.obj2y < this.obj1y + this.obj1h === true){
        state=true;
        }

        //console.log(i);
        i = i + 1;
    }
};

obacht.Collision.prototype = {

    rect: function () {
        "use strict";
        return this.state;

    }
};
