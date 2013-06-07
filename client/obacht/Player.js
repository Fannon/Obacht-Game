/* global goog, lime, obacht, log */
/* jshint strict: false, devel: true */

// Obacht Requirements
goog.provide('obacht.Player');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

// Lime.js Requirements
goog.require('lime.Sprite');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.ScaleTo');

//Spritesheet Requirements
goog.require('lime.animation.KeyframeAnimation');


/**
 * Its a Player Object
 *
 * @param {Object} currentGame  Current Game Object
 * @param {String} location     Location
 * @constructor
 */
obacht.Player = function(currentGame, location) {

    var self = this;


    //////////////////
    /* PLAYER MODEL */
    //////////////////

    this.gameLayer = currentGame.layer;
    this.spritesheet = currentGame.spritesheet;
    this.location = location;
    this.playerstate = false;
    this.health = 3;

    if (this.location === 'bottom') {
        this.x = obacht.options.player.location.bottom.x;
        this.y = obacht.options.player.location.bottom.y;
        this.rotation = 0;
        this.jumpHeight = -obacht.options.player.general.jumpHeight;
    } else {
        this.x = obacht.options.player.location.top.x;
        this.y = obacht.options.player.location.top.y;
        this.rotation = 180;
        this.jumpHeight = obacht.options.player.general.jumpHeight;
    }


    /** Character Graphic */
    this.character = new lime.Sprite()
        .setFill(this.spritesheet.getFrame('character_0001.png'))
        .setPosition(this.x, this.y)
        .setSize(205,240)
        .setAnchorPoint(0.5, 1)
        .setRotation(this.rotation)
//        .setRenderer(obacht.renderer)
        .setQuality(obacht.options.graphics.characterQuality);

    this.gameLayer.appendChild(this.character);



    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.runAnimation = new lime.animation.KeyframeAnimation();
    for (var i = 1; i <= 16; i++) {
        this.runAnimation.addFrame(self.spritesheet.getFrame('character_' + goog.string.padNumber(i, 4) + '.png'));
    }

    this.run();

    this.jumpUp = new lime.animation.MoveBy(0, this.jumpHeight).setDuration(obacht.options.player.general.jumpUpDuration).setEasing(lime.animation.Easing.EASEOUT);
    this.jumpDown = this.jumpUp.reverse().setDuration(obacht.options.player.general.jumpDownDuration).setEasing(lime.animation.Easing.EASEIN);
    this.jumpAnimation = new lime.animation.Sequence(this.jumpUp, this.jumpDown);

    this.crouchAnimation = new lime.animation.ScaleTo(obacht.options.player.general.crouchWidth, obacht.options.player.general.crouchHeight).setDuration(obacht.options.player.general.crouchDuration);
    this.standUpAnimation = new lime.animation.ScaleTo(1, 1).setDuration(obacht.options.player.general.crouchDuration);



    //////////////////////////////////////
    /* STOP-EVENT FOR OPTIMIZED JUMPING */
    //////////////////////////////////////

    goog.events.listen(this.jumpAnimation, 'stop', function() {
        obacht.playerController.isJumping = false;
    });



    /////////////////////////
    /* SUBSCRIBE TO EVENTS */
    /////////////////////////

    try {
        if (this.location === 'bottom') {
            // Sets up event subscription for own player.
            obacht.playerController.events.subscribe('own_player_action', function(data) {
                if (data.action === 'jump') {
                    self.jump();
                }
                if (data.action === 'crouch') {
                    self.crouch();
                }
                if (data.action === 'standUp') {
                    self.standUp();
                }
            });
        } else {
            // Sets up event subscription for enemy player.
            obacht.mp.events.subscribe('player_action', function(data) {
                if (data.action === 'jump') {
                    self.jump();
                }
                if (data.action === 'crouch') {
                    self.crouch();
                }
                if (data.action === 'standUp') {
                    self.standUp();
                }
            });
        }
    } catch(e) {
        obacht.eventError(e);
    }

};



//////////////////////////////
// Player Actions (Logic)   //
//////////////////////////////

obacht.Player.prototype = {

    /**
     * Runs the running animation on the character.
     */
    run: function() {
        'use strict';
        this.character.runAction(this.runAnimation);
    },

    /**
     * Runs the jumping animation on the character.
     */
    jump: function() {
        'use strict';
        this.character.runAction(this.jumpAnimation);
    },

    /**
     * Runs the crouching animation on the character.
     */
    crouch: function() {
        'use strict';
        this.playerstate=true;
        this.character.runAction(this.crouchAnimation);
    },

    /**
     * Runs the standUp animation on the character.
     */
    standUp: function() {
        'use strict';
        this.playerstate=false;
        this.character.runAction(this.standUpAnimation);
    },

    /**
     * Lets the player die -> Game Over
     * Just for debugging purposes
     */
    die: function() {
        obacht.mp.playerStatus(obacht.mp.pid, 0);
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {
        obacht.mp.events.clear('own_player_action');
        obacht.mp.events.clear('player_action');
    }
};
