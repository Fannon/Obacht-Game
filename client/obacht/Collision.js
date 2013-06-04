/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Collision');
goog.require('obacht.themes');

/**
 * Collision Detector
 * @param {Object} layer    Layer which is reference
 * @param {Object} player   Player
 * @param {Object} trap   Trap
 */
obacht.Collision = function (layer, player, trap) {

    this.state=false;

    "use strict";
    this.obj1w = player.character.getSize().width;
    this.obj1h = player.character.getSize().height;

    /*Size Object2*/
    this.obj2w = trap.trap.getSize().width;
    this.obj2h = trap.trap.getSize().height;

    //Get Positions of the objects
    this.obj1x=layer.screenToLocal(player.character.getPosition()).ceil().x;
    this.obj1y=layer.screenToLocal(player.character.getPosition()).ceil().y;

    this.obj2x=layer.screenToLocal(trap.trap.getPosition()).ceil().x;
    this.obj2y=layer.screenToLocal(trap.trap.getPosition()).ceil().y;

    console.log(this.obj1x+'>'+this.obj1y);

    //Set left top corner of box
    this.obj1x=this.obj1x-(this.obj1w)/2;
    this.obj1y=this.obj1y+(this.obj1h)/2;

    console.log(this.obj1x+'>>'+this.obj1y);

    this.obj2x=this.obj2x-(this.obj2w)/2;
    this.obj2y=this.obj2y+(this.obj2h)/2;

    /*Request BoundingBoxes | Name = BoundingBoxes Object */
    this.bbobj1 = obacht.options.player.boundingBoxes;
    this.bbobj2 = obacht.themes[obacht.mp.roomDetail.theme].traps[trap.type].boundingBoxes;

    //Iterate through bounding boxes
    var i = 0;
    while (i < this.bbobj2.length) {

        //Just one Bounding Box for Hugo
        this.obj1x = this.obj1x + this.bbobj1[0].x;
        this.obj1y = this.obj1y - this.bbobj1[0].y;

        console.log(this.obj1x+'>>>'+this.obj1y);

        //If player is crouched
        /*Size Object1*/
        if(player.playerstate===false){
            this.obj1w = this.bbobj1[0].width;
            this.obj1h = this.bbobj1[0].height;
        }else if(player.playerstate===true){
            this.obj1w = this.bbobj1[0].width*obacht.options.player.general.crouchWidth;
            this.obj1h = this.bbobj1[0].height*obacht.options.player.general.crouchHeight;
        }

        //New Trap
        this.obj2x = this.obj2x + this.bbobj2[i].x;
        this.obj2y = this.obj2y - this.bbobj2[i].y;

        this.obj2w = this.bbobj2[i].width;
        this.obj2h = this.bbobj2[i].height;

        if (this.obj1x < this.obj2x + this.obj2w  &&
            this.obj2x < this.obj1x + this.obj1w  &&
            this.obj1y < this.obj2y + this.obj2h &&
            this.obj2y < this.obj1y + this.obj1h === true){
            this.state=true;
        }
        i = i + 1;
    }
};

obacht.Collision.prototype = {

    rect: function () {
        "use strict";
        return this.state;

    }
};
