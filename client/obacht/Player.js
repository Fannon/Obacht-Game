/* global goog, lime, obacht */
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

//Spritesheets Requirements
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.waterSpritesheet.json');
goog.require('lime.ASSETS.desertSpritesheet.json');
goog.require('lime.ASSETS.meadowSpritesheet.json');
goog.require('lime.SpriteSheet');
goog.require('lime.animation.KeyframeAnimation');


/**
 * Its a Player Object
 *
 * @constructor
 */
obacht.Player = function(location, theme) {

    var self = this;

    this.location=location;
    this.playerstate=false;

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

    /** variable for json path */
    this.jsonPath = undefined;
        if (obacht.mp.roomDetail.theme === 'water'){
            this.jsonPath = lime.ASSETS.waterSpritesheet.json;
        }
        if (obacht.mp.roomDetail.theme === 'desert'){
            this.jsonPath = lime.ASSETS.desertSpritesheet.json;
        }
        if (obacht.mp.roomDetail.theme === 'meadow'){
            this.jsonPath = lime.ASSETS.meadowSpritesheet.json;
        }

    /** Character Graphic */
    this.spritesheet = new lime.SpriteSheet('assets/spritesheets/' + obacht.mp.roomDetail.theme + 'Spritesheet.png', this.jsonPath, lime.parser.JSON);

    this.character = new lime.Sprite().setFill(this.spritesheet.getFrame('character_0001.png')).setPosition(this.x, this.y).setSize(205,240).setAnchorPoint(0.5, 1).setRotation(this.rotation).setRenderer(obacht.renderer).setQuality(obacht.options.graphics.characterQuality);

    /** Player LimeJS Layer */
    this.layer = new lime.Layer().setSize(obacht.options.player.general.width, obacht.options.player.general.height);
    this.layer.appendChild(this.character);

    var anim = new lime.animation.KeyframeAnimation();
    var i;
    for(i=1;i<=16;i++){
        anim.addFrame(this.spritesheet.getFrame('character_'+goog.string.padNumber(i,4)+'.png'));
    }
    this.character.runAction(anim);

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

    // Sets up event subscription for enemy player.
    if (location === 'top') {
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
        this.playerstate=true;
        this.character.runAction(this.crouchAnimation);
    },

    /**
     * Runs the standUp animation on the character.
     */
    standUp: function() {
        "use strict";
        this.playerstate=false;
        this.character.runAction(this.standUpAnimation);
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {

    }
};
