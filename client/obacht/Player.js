/* global goog, lime, obacht */
/* jshint strict: false, devel: true */

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

// Lime.js Requirements
goog.require('lime.RoundedRect');
goog.require('lime.Sprite');
goog.require('lime.Node');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.ScaleTo');

// Obacht Requirements
goog.provide('obacht.Player');
goog.require('obacht.Trap');


/**
 * Its a Player Object
 *
 * @constructor
 */
obacht.Player = function(location, theme) {

    var self = this;

    //////////////////
    /* PLAYER MODEL */
    //////////////////

    if (location === 'bottom') {
        this.x = obacht.options.player.location.bottom.x;
        this.y = obacht.options.player.location.bottom.y;
        this.rotation = 0;
        this.jumpHeight = -obacht.options.player.general.jumpHeight;
    }

    if (location === 'top') {
        this.x = obacht.options.player.location.top.x;
        this.y = obacht.options.player.location.top.y;
        this.rotation = 180;
        this.jumpHeight = obacht.options.player.general.jumpHeight;
    }

    /** Player Health */
    this.health = 3;

    /** Character Graphic */
    this.character = new lime.Sprite().setSize(obacht.options.player.general.width, obacht.options.player.general.height).setPosition(this.x, this.y).setAnchorPoint(0.5, 1).setFill('assets/gfx/hugo.png').setRotation(this.rotation).setRenderer(obacht.renderer);
    this.boundingBoxes = obacht.options.player.boundingBoxes[0];

    /** Player LimeJS Layer */
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.character);


    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.jumpUp = new lime.animation.MoveBy(0, this.jumpHeight).setDuration(obacht.options.player.general.jumpUpDuration).setEasing(lime.animation.Easing.EASEOUT);
    this.jumpDown = this.jumpUp.reverse().setDuration(obacht.options.player.general.jumpDownDuration).setEasing(lime.animation.Easing.EASEIN);
    this.jumpAnimation = new lime.animation.Sequence(this.jumpUp, this.jumpDown);

    this.crouchAnimation = new lime.animation.ScaleTo(obacht.options.player.general.crouchWidth, obacht.options.player.general.crouchHeight).setDuration(obacht.options.player.general.crouchDuration);
    this.standUpAnimation = new lime.animation.ScaleTo(1, 1).setDuration(obacht.options.player.general.crouchDuration);


    //////////////////////////////////////
    /* STOP-EVENT FOR OPTIMIZED JUMPING */
    //////////////////////////////////////

    goog.events.listen(this.jumpAnimation, 'stop', function() {
        obacht.options.player.stateVar.isJumping = false;
    });


    /////////////////////////
    /* SUBSCRIBE TO EVENTS */
    /////////////////////////

    // Sets up event subscription for own player.
    if (location === 'bottom') {
        obacht.playerController.events.subscribe('own_player_action', function(data) {
            if (data.type === 'jump') {
                self.jump();
            }
            if (data.type === 'crouch') {
                self.crouch();
            }
            if (data.type === 'standUp') {
                self.standUp();
            }
        });
    }

    // Sets up event subscription for enemy player.
    if (location === 'top') {
        obacht.mp.events.subscribe('player_action', function(data) {
            if (data.type === 'jump') {
                self.jump();
            }
            if (data.type === 'crouch') {
                self.crouch();
            }
            if (data.type === 'standUp') {
                self.standUp();
            }
        });
    }

};


//////////////////////////////
// Player Actions (Logic)   //
//////////////////////////////

obacht.Player.prototype = {

    /**
     * Runs the jumping animation on the character.
     */
    jump: function() {
        "use strict";
        this.character.runAction(this.jumpAnimation);
    },

    /**
     * Runs the crouching animation on the character.
     */
    crouch: function() {
        "use strict";
        this.character.runAction(this.crouchAnimation);
    },

    /**
     * Runs the standUp animation on the character.
     */
    standUp: function() {
        "use strict";
        this.character.runAction(this.standUpAnimation);
    }
};
