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
goog.require('lime.animation.MoveTo');

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

    /** Player Location */
    this.location = location;

    /** Player BoundingBoxes Array */
    this.boundingBoxes = obacht.options.player.boundingBoxes;
    var bb = this.boundingBoxes[0];

    /** Player Health */
    this.health = 3;

    /** Player jumping Boolean */
    this.isJumping = false;

    /** Player crouching Boolean */
    this.isCrouching = false;

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

    /////////////
    /* SPRITES */
    /////////////

    /** Character Sprite */
    this.character = new lime.Sprite()
        .setFill(this.spritesheet.getFrame('character_0001.png'))
        .setPosition(this.x, this.y)
        .setSize(this.spritesheet.getFrame('character_0001.png').csize_.width * 1.988, this.spritesheet.getFrame('character_0001.png').csize_.height * 1.988)
        .setAnchorPoint(0.5, 1)
        .setRotation(this.rotation)
        .setRenderer(obacht.renderer.player)
        .setQuality(obacht.options.graphics.characterQuality);

    currentGame.layer.appendChild(this.character);

    /** Smoke Sprite */
    this.smoke = new lime.Sprite()
        .setAnchorPoint(0.5, 1)
        .setPosition(0, 0)
        .setSize(obacht.spritesheet.getFrame('smoke_0001.png').csize_.width * 2, obacht.spritesheet.getFrame('smoke_0001.png').csize_.height * 2)
        .setRenderer(obacht.renderer.player)
        .setQuality(obacht.options.graphics.characterQuality);

    /** Character Bounding Box (Square) */
    if (this.location === 'bottom') {

        this.boundingBox = new lime.Sprite()
            .setPosition(this.x + bb.x, this.y - bb.y)
            .setSize(bb.width, bb.height)
            .setAnchorPoint(0.5, 1)
            .setRotation(this.rotation);
    }

    // Set fill if showBoundingBoxes is set true in debug mode.
    if (obacht.options.debug.showBoundingBoxes && location === 'bottom') {
        this.boundingBox.setFill(0, 0, 255, 0.5);
        currentGame.layer.appendChild(this.boundingBox);
    }


    ////////////////
    /* ANIMATIONS */
    ////////////////

    /** Jump up animation */
    this.jumpUp = new lime.animation
        .MoveBy(0, this.jumpHeight)
        .setDuration(obacht.options.player.general.jumpUpDuration)
        .setEasing(lime.animation.Easing.EASEOUT)
        .enableOptimizations();

    /** Jump down animation */
    this.jumpDown = this.jumpUp
        .reverse()
        .setDuration(obacht.options.player.general.jumpDownDuration)
        .setEasing(lime.animation.Easing.EASEIN)
        .enableOptimizations();

    /** Sequences jump up and jump down animation */
    this.jumpAnimation = new lime.animation.Sequence(this.jumpUp, this.jumpDown);

    // Adds targets to jump sequence. Has to be done like this when using multiple targets.
    this.jumpAnimation.addTarget(this.character);

    // Adds bounding box as target to the jump animation if bottom player
    if (this.location === 'bottom') {
        this.jumpAnimation.addTarget(this.boundingBox);
    }

    /** Crouch animation for bounding box */
    this.crouchAnimationBB = new lime.animation
        .ScaleTo(obacht.options.player.general.crouchWidth, obacht.options.player.general.crouchHeight)
        .setDuration(obacht.options.player.general.crouchDuration)
        .enableOptimizations();

    /** Stand up animation for bounding box */
    this.standUpAnimationBB = new lime.animation
        .ScaleTo(1, 1)
        .setDuration(obacht.options.player.general.crouchDuration)
        .enableOptimizations();

    /** Moves smoke down while crouching */
    this.moveSmokeDown = new lime.animation
        .MoveTo(obacht.options.player.smoke.moveX, obacht.options.player.smoke.moveY)
        .setDuration(obacht.options.player.crouchDuration)
        .enableOptimizations();

    /** Moves smoke up again */
    this.moveSmokeUp = new lime.animation
        .MoveTo(0, 0)
        .setDuration(obacht.options.player.crouchDuration)
        .enableOptimizations();


    ///////////////////////
    /* SPRITE ANIMATIONS */
    ///////////////////////

    /** Sprite animation for running */
    this.runSprites = new lime.animation.KeyframeAnimation();
    for (var i = 1; i <= 16; i++) {
        this.runSprites
            .addFrame(self.spritesheet.getFrame('character_' + goog.string.padNumber(i, 4) + '.png'));
    }

    // Runs running animation initially
    this.run();

    /** Sprite animation for jumping */
    this.jumpSprites = new lime.animation.KeyframeAnimation();
    this.jumpSprites.looping = false;
    this.jumpSprites.delay = (obacht.options.player.general.jumpUpDuration + obacht.options.player.general.jumpDownDuration) / 8;
    for (var j = 3; j <= 11; j++) {
        this.jumpSprites
            .addFrame(self.spritesheet.getFrame('character_jump_' + goog.string.padNumber(j, 4) + '.png'));
    }

    /** Sprite animation for crouching (when character goes down) */
    this.crouchSprites = new lime.animation.KeyframeAnimation();
    this.crouchSprites.looping = false;
    for (var k = 1; k <= 4; k++) {
        this.crouchSprites
            .addFrame(self.spritesheet.getFrame('character_creep_start_' + goog.string.padNumber(k, 4) + '.png'));
    }

    /** Sprite animation for crouching (while character is down) */
    this.stayDownSprites = new lime.animation.KeyframeAnimation();
    for (var l = 5; l <= 20; l++) {
        this.stayDownSprites
            .addFrame(self.spritesheet.getFrame('character_creep_' + goog.string.padNumber(l, 4) + '.png'));
    }

    /** Sprite animation for standing up */
    this.standUpSprites = new lime.animation.KeyframeAnimation();
    this.standUpSprites.looping = false;
    for (var h = 21; h <= 24; h++) {
        this.standUpSprites
            .addFrame(self.spritesheet.getFrame('character_creep_end_' + goog.string.padNumber(h, 4) + '.png'));
    }

    /** Sprite animation for smoking if a collision happens */
    this.smokeSprites = new lime.animation.KeyframeAnimation();
    this.smokeSprites.delay = obacht.options.player.smoke.frameFrequency;
    this.smokeSprites.looping = false;
    for (var g = 1; g <= 5; g++) {
        this.smokeSprites
            .addFrame(obacht.spritesheet.getFrame('smoke_' + goog.string.padNumber(g, 4) + '.png'));
    }

    this.smokeSprites.addTarget(this.smoke);



    /////////////////////////
    /* SUBSCRIBE TO EVENTS */
    /////////////////////////

    try {

        /** STOP-EVENT FOR OPTIMIZED JUMPING @event */
        goog.events.listen(this.jumpAnimation, 'stop', function() {
            if(obacht.playerController) {
                self.isJumping = false;
                self.run();
                self.jumpSprites.currentFrame_=-1; // work-around for lime.js-bug with keyframe animations.
            }
        });

        /** Stop event on crouch sprite animation for initializing stay down sprite animation. @event */
        goog.events.listen(this.crouchSprites, 'stop', function() {
            if (self.isCrouching === false) {
                self.standUp();
            } else {
                self.stayDown();
            }
            self.crouchSprites.currentFrame_=-1; // work-around for lime.js-bug with keyframe animations.
        });

        /** Stop event on the end of stand up sprite animation for initializing the run animation. @event */
        goog.events.listen(this.standUpSprites, 'stop', function() {
            self.run();
            self.standUpSprites.currentFrame_=-1; // work-around for lime.js-bug with keyframe animations.
        });

        goog.events.listen(this.smokeSprites, 'stop', function() {
            self.character.removeChild(self.smoke);
        });

        if (this.location === 'bottom') {

            /** Sets up event subscription for own player. @event */
            obacht.playerController.events.subscribe('own_player_action', function(data) {
                if (data.action === 'jump') {
                    self.jump();
                    self.isJumping = true;
                }
                if (data.action === 'crouch') {
                    self.crouch();
                    self.isCrouching = true;
                }
                if (data.action === 'standUp') {
                    self.standUp();
                    self.isCrouching = false;
                }
            });

        } else {

            /** Sets up event subscription for enemy player. @event */
            obacht.mp.events.subscribe('enemy_player_action', function(data) {
                if (data.action === 'jump') {
                    self.jump();
                }
                if (data.action === 'crouch') {
                    self.crouch();
                    self.isCrouching = true;
                }
                if (data.action === 'standUp') {
                    self.standUp();
                    self.isCrouching = false;
                }
            });
        }

    } catch(e) {
        obacht.eventError(e);
    }
};



////////////////////////////
/* PLAYER ACTIONS (LOGIC) */
////////////////////////////

obacht.Player.prototype = {

    /**
     * Runs the running animation on the character.
     */
    run: function() {
        'use strict';

        this.character.runAction(this.runSprites);
    },

    /**
     * Runs the jumping animation on the character and the bounding box.
     * Stops the running animation.
     */
    jump: function() {
        'use strict';

        this.jumpAnimation.play();
        this.runSprites.stop();
        this.character.runAction(this.jumpSprites);
    },

    /**
     * Runs the crouching animation on the character and the bounding box.
     * Stops the running animation just in case something went wrong.
     * Runs the animation for going down on the smoke sprite.
     */
    crouch: function() {
        'use strict';

        this.runSprites.stop();
        this.character.runAction(this.crouchSprites);
        this.smoke.runAction(this.moveSmokeDown);

        if (this.location === 'bottom') {
            this.boundingBox.runAction(this.crouchAnimationBB);
        }
    },

    /**
     * Runs the sprite animation for staying down. (while crouching)
     */
    stayDown: function() {
        'use strict';

        this.character.runAction(this.stayDownSprites);
    },

    /**
     * Runs the standUp animation on the character and the bounding box.
     * Stops the staying down animation.
     * Stops the running animation just in case something went wrong.
     * Runs the animation for going back up on the smoke sprite.
     * Runs the animation for standing up on the bounding box if bottom player.
     */
    standUp: function() {
        'use strict';

        this.stayDownSprites.stop();
        this.runSprites.stop();
        this.character.runAction(this.standUpSprites);
        this.smoke.runAction(this.moveSmokeUp);

        if (this.location === 'bottom') {
            this.boundingBox.runAction(this.standUpAnimationBB);
        }
    },

    /**
     * Runs the smoke animation.
     * Has to be called when a collision happens.
     * Contains a lime.js-work-around for reusing a lime.js-keyFrameAnimation.
     */
    collide: function() {
        'use strict';
        var self = this;

        this.character.appendChild(this.smoke);

        log.debug(this.location + ' Player Kollusiom!');

        this.smokeSprites.currentFrame_ = -1;
        lime.animation.actionManager.actions[goog.getUid(self.smokeSprites.targets[0])] = {};
        this.smokeSprites.play();
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
