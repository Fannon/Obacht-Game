/* global goog, lime, obacht */
/* jshint devel: true */

goog.provide('obacht.PlayerController');

goog.require('obacht.options');
goog.require('goog.pubsub.PubSub');

/**
 * Its a Player Controller
 *
 * @constructor
 */
obacht.PlayerController = function() {
    "use strict";

    this.tapAreaTop     = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, 0).setAnchorPoint(0, 0);
    this.tapAreaBottom  = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setAnchorPoint(0, 0);
    this.tapAreaPuffer  = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT).setPosition(0, 0).setAnchorPoint(0, 0);

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.tapAreaTop);
    this.layer.appendChild(this.tapAreaBottom);
    this.layer.appendChild(this.tapAreaPuffer);

    // Event Publisher/Subscriber
    this.events = new goog.pubsub.PubSub();

    self = this;



    ////////////////////
    /* EVENT HANDLING */
    ////////////////////

    // JUMP

    goog.events.listen(this.tapAreaTop, ['touchstart', 'mousedown'], function(e) {
        if (obacht.options.player.stateVar.isJumping === true) {
            return;
        } else {
            self.jump();
            obacht.options.player.stateVar.isJumping = true;
        }
    });

    // CROUCH

    this.isCrouching = false;

    goog.events.listen(this.tapAreaBottom, ['touchstart', 'mousedown'], function(e) {
        if (this.isCrouching === false) {
            this.crouch();
            this.isCrouching = true;
        } else {
            return;
        }
    });

    goog.events.listen(this.tapAreaPuffer, ['touchend', 'mouseup'], function(e) {
        if (this.isCrouching === true) {
            this.standUp();
            this.isCrouching = false;
        } else {
            return;
        }
    });

    this.tapToleranceArea = 70;

    goog.events.listen(this.tapAreaBottom, ['touchmove', 'mousemove'], function(e) {
        this.tapPositionX = e.position.x;
        this.tapPositionY = e.position.y;

        if (this.tapPositionY < this.tapToleranceArea || this.tapPositionY > obacht.options.graphics.VIEWPORT_HEIGHT / 2 - this.tapToleranceArea || this.tapPositionX < this.tapToleranceArea || this.tapPositionX > obacht.options.graphics.VIEWPORT_WIDTH / 2 - this.tapToleranceArea) {
            if (this.isCrouching === true) {
                this.standUp();
                this.isCrouching = false;
            }
        }
    });
};

obacht.PlayerController.prototype = {

    jump: function() {
        "use strict";
        this.events.publish('player_jump');
    }
};
