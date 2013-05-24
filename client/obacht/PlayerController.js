/* global goog, lime, obacht */
/* jshint devel: true */

goog.provide('obacht.PlayerController');

// Obacht Requirements
goog.require('obacht.options');
goog.require('obacht.Inventory');
goog.require('obacht.Bonus');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

//LimeJS Requirements
goog.require('lime.RoundedRect');

/**
 * Its a Player Controller
 *
 * @constructor
 */
obacht.PlayerController = function() {
    "use strict";
    var self = this;

    this.isCrouching = false;

    this.tapAreaTop = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, 0).setAnchorPoint(0, 0);
    this.tapAreaBottom = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setAnchorPoint(0, 0);
    this.tapAreaPuffer = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT).setPosition(0, 0).setAnchorPoint(0, 0);

    this.inventory = new obacht.Inventory();

    this.bonus = new obacht.Bonus('snake');

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.tapAreaTop);
    this.layer.appendChild(this.tapAreaBottom);
    this.layer.appendChild(this.tapAreaPuffer);
    this.layer.appendChild(this.inventory.layer);
    this.layer.appendChild(this.bonus.layer);

    // Event Publisher/Subscriber
    this.events = new goog.pubsub.PubSub();



    ////////////////////
    /* EVENT HANDLING */
    ////////////////////

    // JUMP

    goog.events.listen(this.tapAreaTop, ['touchstart', 'mousedown'], function(e) {
        if (obacht.options.player.stateVar.isJumping === true) {
            return false;
        } else {
            self.jump();
            obacht.options.player.stateVar.isJumping = true;
        }
    });

    // CROUCH

    this.isCrouching = false;

    goog.events.listen(this.tapAreaBottom, ['touchstart', 'mousedown'], function(e) {
        if (self.isCrouching === false) {
            self.crouch();
            self.isCrouching = true;
        } else {
            return false;
        }
    });

    goog.events.listen(this.tapAreaPuffer, ['touchend', 'mouseup'], function(e) {
        if (self.isCrouching === true) {
            self.standUp();
            self.isCrouching = false;
        } else {
            return false;
        }
    });

    this.tapToleranceArea = obacht.options.playerController.tapToleranceArea;

    goog.events.listen(this.tapAreaBottom, ['touchmove', 'mousemove'], function(e) {
        self.tapPositionX = Math.round(e.position.x);
        self.tapPositionY = Math.round(e.position.y);

        if (self.isCrouching === true) {
            if (self.tapPositionY < self.tapToleranceArea || self.tapPositionY > obacht.options.graphics.VIEWPORT_HEIGHT / 2 - self.tapToleranceArea || self.tapPositionX < self.tapToleranceArea || self.tapPositionX > obacht.options.graphics.VIEWPORT_WIDTH / 2 -self.tapToleranceArea) {
                self.standUp();
                self.isCrouching = false;
            }
        }
    });

};

obacht.PlayerController.prototype = {

    jump: function() {
        "use strict";
        this.events.publish('player_jump');
        obacht.mp.playerAction('jump', {
            d: 1
        });
    },

    crouch: function() {
        "use strict";
        this.events.publish('player_crouch');
        obacht.mp.playerAction('crouch', {
            d: 2
        });
    },

    standUp: function() {
        "use strict";
        this.events.publish('player_standUp');
        obacht.mp.playerAction('standUp', {
            d: 3
        });
    }

};
