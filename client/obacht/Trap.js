/* global goog, lime, obacht, log */

goog.provide('obacht.Trap');

goog.require('lime.Sprite');
goog.require('lime.Circle');
goog.require('lime.animation.RotateBy');


/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(currentGame, type, location) {
    "use strict";

    ////////////////
    /* ATTRIBUTES */
    ////////////////

    var self = this;
    this.type = type;
    this.location = location;
    this.layer = currentGame.layer;

    /** Trap Data from themes.js */
    this.trapDetail = obacht.themes[obacht.mp.roomDetail.theme].traps[type];


    if (this.location === 'bottom') {

        /** Trap BoundingBoxes */
        this.boundingBoxes = obacht.themes[obacht.mp.roomDetail.theme].traps[type].boundingBoxes;

        this.rotation = obacht.options.trap.bottom.rotation;
        this.circleX = obacht.options.world.bottom.x;
        this.circleY = obacht.options.world.bottom.y;

        if (this.trapDetail.position === 'air') {
            this.x = obacht.options.trap.general.airPosition;
            this.y = -obacht.options.trap.general.airPosition;
        } else {
            this.x = obacht.options.trap.general.groundPosition;
            this.y = -obacht.options.trap.general.groundPosition;
        }

    } else {

        this.rotation = obacht.options.trap.top.rotation;
        this.circleX = obacht.options.world.top.x;
        this.circleY = obacht.options.world.top.y;

        if (this.trapDetail.position === 'air') {
            this.x = -obacht.options.trap.general.airPosition;
            this.y = obacht.options.trap.general.airPosition;
        } else {
            this.x = -obacht.options.trap.general.groundPosition;
            this.y = obacht.options.trap.general.groundPosition;
        }

    }


    /////////////////////
    /* LIME.JS OBJECTS */
    /////////////////////

    this.sprite = new lime.Sprite()
        .setPosition(this.x, this.y)
        .setSize(this.trapDetail.width, this.trapDetail.height)
        .setAnchorPoint(0.5, 1)
        .setRotation(this.rotation)
        .setQuality(obacht.options.graphics.trapQuality)
        .setFill(currentGame.spritesheet.getFrame(this.trapDetail.file))
        .setRenderer(obacht.renderer.trap);

    this.circle = new lime.Circle()
        .setPosition(this.circleX, this.circleY)
        .setAnchorPoint(0.5, 0.5);

    this.circle.appendChild(this.sprite);
    this.layer.appendChild(this.circle);


    /////////////////////
    /* BOUNDING BOXES  */
    /////////////////////

    if (this.location === 'bottom') {

        // Debugging: Bounding Boxes:
        for (var j = 0; j < this.boundingBoxes.length; j++) {

            var bb = this.boundingBoxes[j];

            if (obacht.options.debug.showBoundingBoxes) {
                var redsquare = new lime.Sprite()
                    .setPosition(bb.x - (this.trapDetail.width / 2), bb.y - this.trapDetail.height)
                    .setSize(bb.width, bb.height)
                    .setAnchorPoint(0, 0)
                    .setFill(255,0,0,0.5);
                self.sprite.appendChild(redsquare);
            }
        }
    }


    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.rotate = new lime.animation.RotateBy(90)
        .setDuration(obacht.options.world.spinDuration.front * 0.8)
        .setEasing(lime.animation.Easing.LINEAR);

    this.circle.runAction(this.rotate);

    return this;
};

obacht.Trap.prototype = {

};
