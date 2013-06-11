/* global goog, lime, obacht, log */

goog.provide('obacht.Trap');
goog.require('lime.Sprite');


/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(currentGame, type, location) {
    "use strict";

    log.debug('New Trap(): ' + type);



    ////////////////
    /* ATTRIBUTES */
    ////////////////

    this.type = type;
    this.location = location;
    this.layer = currentGame.layer;
    this.trapDetail = obacht.themes[obacht.mp.roomDetail.theme].traps[type];


    if (this.location === 'bottom') {

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
    }

    if (this.location === 'top') {

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
        .setRotation(this.rotation)
        .setAnchorPoint(0.5, 1)
        .setFill(currentGame.spritesheet.getFrame(this.trapDetail.file));


    this.circle = new lime.Circle()
        .setPosition(this.circleX, this.circleY)
        .setAnchorPoint(0.5, 0.5);

    this.layer.appendChild(this.circle);
    this.circle.appendChild(this.sprite);



    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.rotate = new lime.animation.Loop(
            new lime.animation.RotateBy(360)
                .setDuration(obacht.options.world.spinDuration.front*3)
                .setEasing(lime.animation.Easing.LINEAR)
    );

    this.circle.runAction(this.rotate);

};

obacht.Trap.prototype = {

};
