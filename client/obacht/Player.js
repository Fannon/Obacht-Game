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

    this.spritesheet = currentGame.spritesheet;
    this.location = location;

    this.boundingBoxes = obacht.options.player.boundingBoxes;

    /** Player Health */
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

    currentGame.layer.appendChild(this.character);

    var bb = this.boundingBoxes[0];

    if (obacht.options.debug.showBoundingBoxes) {
        var redsquare = new lime.Sprite()
            .setPosition(this.x + bb.x, this.y + bb.y)
            .setSize(bb.width, bb.height)
            .setAnchorPoint(0.5, 1)
            .setRotation(this.rotation)
            .setFill(255,0,0,0.5);
        currentGame.layer.appendChild(redsquare);
    }


    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.runSprites = new lime.animation.KeyframeAnimation();
    for (var i = 1; i <= 16; i++) {
        this.runSprites.addFrame(self.spritesheet.getFrame('character_' + goog.string.padNumber(i, 4) + '.png'));
    }
    this.run();

    this.jumpSprites = new lime.animation.KeyframeAnimation();
    this.jumpSprites.looping = false;
    this.jumpSprites.delay = (obacht.options.player.general.jumpUpDuration + obacht.options.player.general.jumpDownDuration) / 12;
    for (var j = 1; j <= 13; j++) {
        this.jumpSprites.addFrame(self.spritesheet.getFrame('character_jump_' + goog.string.padNumber(j, 4) + '.png'));
    }

    this.jumpUp = new lime.animation.MoveBy(0, this.jumpHeight).setDuration(obacht.options.player.general.jumpUpDuration).setEasing(lime.animation.Easing.EASEOUT);
    this.jumpDown = this.jumpUp.reverse().setDuration(obacht.options.player.general.jumpDownDuration).setEasing(lime.animation.Easing.EASEIN);
    this.jumpAnimation = new lime.animation.Sequence(this.jumpUp, this.jumpDown);

    this.crouchAnimation = new lime.animation.ScaleTo(obacht.options.player.general.crouchWidth, obacht.options.player.general.crouchHeight).setDuration(obacht.options.player.general.crouchDuration);
    this.standUpAnimation = new lime.animation.ScaleTo(1, 1).setDuration(obacht.options.player.general.crouchDuration);



    /////////////////////////
    /* SUBSCRIBE TO EVENTS */
    /////////////////////////

    try {

        /** STOP-EVENT FOR OPTIMIZED JUMPING @event */
        goog.events.listen(this.jumpAnimation, 'stop', function() {
            if(obacht.playerController) {
                obacht.playerController.isJumping = false;
                self.run();
                self.jumpSprites.currentFrame_=-1; // work-around for lime.js-bug with keyframe animations.
            }
        });

        if (this.location === 'bottom') {
            /** Sets up event subscription for own player. @event */
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
            /** Sets up event subscription for enemy player. @event */
            obacht.mp.events.subscribe('enemy_player_action', function(data) {
                if (data.action === 'jump') {
                    setTimeout(function(){
                        self.jump();
                    },currentGame.getDistanceTimer(data.data.distance));
                }
                if (data.action === 'crouch') {
                    setTimeout(function(){
                        self.crouch();
                    },currentGame.getDistanceTimer(data.data.distance));
                }
                if (data.action === 'standUp') {
                    setTimeout(function(){
                        self.standUp();
                    },currentGame.getDistanceTimer(data.data.distance));
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
        this.character.runAction(this.runSprites);
    },

    /**
     * Runs the jumping animation on the character.
     * Stops the running animation.
     */
    jump: function() {
        'use strict';
        this.character.runAction(this.jumpAnimation);
        this.runSprites.stop();
        this.character.runAction(this.jumpSprites);
    },

    /**
     * Runs the crouching animation on the character.
     */
    crouch: function() {
        'use strict';
        this.character.runAction(this.crouchAnimation);
    },

    /**
     * Runs the standUp animation on the character.
     */
    standUp: function() {
        'use strict';
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
     * Lets the player lose 1 health point.
     */
    loseHealth: function() {
        log.debug('Own Player loses Life');
        obacht.mp.playerStatus(obacht.mp.pid, this.health -1);
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {
        obacht.mp.events.clear('own_player_action');
        obacht.mp.events.clear('player_action');
    }
};
