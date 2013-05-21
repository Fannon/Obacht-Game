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
obacht.Player = function(type) {

    console.log('New Player();');

    var self = this;


    //////////////////
    /* PLAYER MODEL */
    //////////////////

    if (type === 'own') {
        this.x = obacht.options.player.own.x;
        this.y = obacht.options.player.own.y;
        this.rotation = 0;
        this.jumpHeight = -obacht.options.player.general.jumpHeight;
    }

    if (type === 'enemy') {
        this.x = obacht.options.player.enemy.x;
        this.y = obacht.options.player.enemy.y;
        this.rotation = 180;
        this.jumpHeight = obacht.options.player.general.jumpHeight;
    }

    this.health = 3;

    this.character = new lime.Sprite().setSize(obacht.options.player.general.width, obacht.options.player.general.height).setPosition(this.x, this.y).setAnchorPoint(0.5, 1).setFill('#999').setRotation(this.rotation).setRenderer(obacht.renderer);
    /*'assets/gfx/hugo4.png'*/
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

    if (type === "own") {
        obacht.playerController.events.subscribe('player_jump', function() {
            self.jump();
        });

        obacht.playerController.events.subscribe('player_crouch', function() {
            self.crouch();
        });

        obacht.playerController.events.subscribe('player_standUp', function() {
            self.standUp();
        });
    }

    if (type === "enemy") {
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
    jump: function() {
        "use strict";
        this.character.runAction(this.jumpAnimation);
    },

    /*
    crouch: function() {
        "use strict";
        this.character.runAction(this.crouchAnimation);
    },
    */

    standUp: function() {
        "use strict";
        this.character.runAction(this.standUpAnimation);
    }
};
