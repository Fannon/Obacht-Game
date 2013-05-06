/* global goog, lime, obacht */
/* jshint strict: false, devel: true */

goog.provide('obacht.Player');
goog.require('obacht.options');
goog.require('obacht.Trap');

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

    //////////////////////////////
    // Subscribe to Events      //
    //////////////////////////////

    obacht.multiplayerService.events.subscribe('player_move_test', function(data) {
        console.log('Player Move Test received!');
    });

    //////////////////////////////
    // Player Model (state)     //
    //////////////////////////////
    if (type === 'own') {

        this.tapAreaTop     = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, 0).setAnchorPoint(0, 0);
        this.tapAreaBottom  = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setAnchorPoint(0, 0);
        this.tapAreaPuffer  = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT).setPosition(0, 0).setAnchorPoint(0, 0);

        this.x = obacht.options.player.own.x;
        this.y = obacht.options.player.own.y;
        this.rotation = '0';

        this.interactionLayer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
        this.interactionLayer.appendChild(this.tapAreaTop);
        this.interactionLayer.appendChild(this.tapAreaBottom);
        this.interactionLayer.appendChild(this.tapAreaPuffer);

    }

    if (type === 'enemy') {
		this.x = obacht.options.player.enemy.x;
		this.y = obacht.options.player.enemy.y;
		this.rotation = "180";
    }


    this.health = 3;

    this.player = new lime.RoundedRect().setSize(obacht.options.player.general.width, obacht.options.player.general.height).setPosition(this.x, this.y).setAnchorPoint(0.5, 1).setFill('#d5622f').setRotation(this.rotation);

    this.graphicsLayer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);

    this.graphicsLayer.appendChild(this.player);

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





//////////////////////
// EVENT - HANDLING //
//////////////////////

	// JUMP //


    this.isJumping = false;

    goog.events.listen(this.tapAreaTop, ['touchstart', 'mousedown'], function(e) {
        if (this.isJumping === true) {
            return;
        } else {
            this.jump();
            this.isJumping = true;
        }
    });

    goog.events.listen(this.jumpAnimation, "stop", function() {
        this.isJumping = false;
    });

    // CROUCH //

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

    this.tapPositionX;
    this.tapPositionY;
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



    ////////////////
    /* ANIMATIONS */
    ////////////////

    this.jumpUp = new lime.animation.MoveBy(0, -280).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT);
    this.jumpDown = this.jumpUp.reverse().setDuration(0.35).setEasing(lime.animation.Easing.EASEIN);
    this.jumpAnimation = new lime.animation.Sequence(this.jumpUp, this.jumpDown);

    this.crouchAnimation = new lime.animation.ScaleTo(1.6, 0.5).setDuration(0.1);
    this.standUpAnimation = new lime.animation.ScaleTo(1, 1).setDuration(0.1);






