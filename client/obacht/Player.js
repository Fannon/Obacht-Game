/* global goog, obacht */
/* jshint strict: false */

goog.provide('obacht.Player');
goog.require('obacht.options');
goog.require('obacht.Trap');

goog.require('lime.RoundedRect');
goog.require('lime.Node');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.MoveBy');

/**
 * Its a Player Object
 *
 * @constructor
 */
obacht.Player = function(type) {

    console.log('New Player();');

    //////////////////////////////
    // Player Model (state)     //
    //////////////////////////////
    if (type == 'own') {
        this.jumpArea =  new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0,0).setAnchorPoint(0,0);
        this.crouchArea = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setAnchorPoint(0,0);
        this.x = obacht.options.player.own.x;
        this.y = obacht.options.player.own.y;
        this.rotation = '0';
    };

    if (type == 'enemy') {
		this.x = obacht.options.player.enemy.x;
		this.y = obacht.options.player.enemy.y;
		this.rotation = "180";
    };

    //this.name = name;
    this.health = 3;
    
    this.player = new lime.RoundedRect().setSize(obacht.options.player.general.width, obacht.options.player.general.height).setPosition(this.x, this.y).setAnchorPoint(0.5, 1).setFill('#d5622f').setRotation(this.rotation);

    
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.player);

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
        "use strict";
       /* player.runAction(new lime.animation.Sequence(
        	new lime.animation.MoveBy(0, obacht.options.graphics.VIEWPORT_HEIGHT * -0.38).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT),
        	new lime.animation.MoveBy(0, obacht.options.graphics.VIEWPORT_HEIGHT * -0.38).reverse().setDuration(0.35).setEasing(lime.animation.Easing.EASEIN))
        );*/
    },
    
    crouch: function() {
        console.log('Crowbar ready');
    },
    throwTrap: function(type) {
        var trap = new obacht.Trap(type);
        console.log("Player " + this.name + " throws " + type);

        // TODO: Logik, etc

        return trap;
    }
};




// throwTrap();
// etc.

//////////////////////////////
// Player Controls (user)   //
//////////////////////////////

// Usereingaben Events

//////////////////////////////
// Player Design            //
//////////////////////////////

// Sprites anziehen etc.


