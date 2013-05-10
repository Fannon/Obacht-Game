/* global goog, lime, obacht */
/* jshint strict: false, devel: true */

goog.provide('obacht.Player');
goog.require('obacht.options');
goog.require('obacht.Trap');

goog.require('goog.pubsub.PubSub');

goog.require('lime.RoundedRect');
goog.require('lime.Node');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.ScaleTo');

/**
 * Its a Player Object
 *
 * @constructor
 */
obacht.Player = function(type) {

    console.log('New Player();');



    //////////////////
    /* PLAYER MODEL */
    //////////////////

    if (type === 'own') {
        this.x = obacht.options.player.own.x;
        this.y = obacht.options.player.own.y;
        this.rotation = '0';
    }

    if (type === 'enemy') {
		this.x = obacht.options.player.enemy.x;
		this.y = obacht.options.player.enemy.y;
		this.rotation = "180";
    }


    this.health = 3;

    this.player = new lime.RoundedRect().setSize(obacht.options.player.general.width, obacht.options.player.general.height).setPosition(this.x, this.y).setAnchorPoint(0.5, 1).setFill('assets/gfx/hugo1.png').setRotation(this.rotation);

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);

    this.layer.appendChild(this.player);



    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.jumpUp = new lime.animation.MoveBy(0, -280).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT);
    this.jumpDown = this.jumpUp.reverse().setDuration(0.35).setEasing(lime.animation.Easing.EASEIN);
    this.jumpAnimation = new lime.animation.Sequence(this.jumpUp, this.jumpDown);

    this.crouchAnimation = new lime.animation.ScaleTo(1.6, 0.5).setDuration(0.1);
    this.standUpAnimation = new lime.animation.ScaleTo(1, 1).setDuration(0.1);



    //////////////////////////////////////
    /* STOP-EVENT FOR OPTIMIZED JUMPING */
    //////////////////////////////////////

    goog.events.listen(this.jumpAnimation, "stop", function() {
        obacht.options.player.stateVar.isJumping = false;
    });



    /////////////////////////
    /* SUBSCRIBE TO EVENTS */
    /////////////////////////

    // Event Publisher/Subscriber
    this.events = new goog.pubsub.PubSub();

    // TODO: Just a test Event Subscription! Remove later.
    this.events.subscribe('player_jump', function() {
        console.log('SLAYER!');
        this.jump();
    });

};



//////////////////////////////
// Player Actions (Logic)   //
//////////////////////////////

// Getter und Setter

/**
 * Lets the Player jump
 */
obacht.Player.prototype = {
    jump: function(player) {
		this.player.runAction(this.jumpAnimation);
    },

    crouch: function() {
		this.player.runAction(this.crouchAnimation);
    },

    standUp: function() {
		this.player.runAction(this.standUpAnimation);
    },

    throwTrap: function(type) {
        var trap = new obacht.Trap(type);
        console.log("Player " + this.name + " throws " + type);

        // TODO: Logik, etc

        return trap;
    }

};
