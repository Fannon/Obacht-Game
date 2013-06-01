/* global goog, lime, obacht */
/* jshint devel: true */

goog.provide('obacht.PlayerController');

// Obacht Requirements
goog.require('obacht.options');
goog.require('obacht.Inventory');

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

    this.tapAreaTop = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 4, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, 0).setAnchorPoint(0, 0);
    this.tapAreaBottom = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 4, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setPosition(0, obacht.options.graphics.VIEWPORT_HEIGHT / 2).setAnchorPoint(0, 0);
    this.tapAreaPuffer = new lime.Node().setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT).setPosition(0, 0).setAnchorPoint(0, 0);

    this.inventory = new obacht.Inventory();

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.tapAreaTop);
    this.layer.appendChild(this.tapAreaBottom);
    this.layer.appendChild(this.tapAreaPuffer);
    this.layer.appendChild(this.inventory.layer);

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

    goog.events.listen(this.tapAreaPuffer, ['touchend', 'touchcancel', 'mouseup'], function(e) {
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
            if (self.tapPositionY < self.tapToleranceArea ||
                self.tapPositionY > obacht.options.graphics.VIEWPORT_HEIGHT / 2 - self.tapToleranceArea ||
                self.tapPositionX < self.tapToleranceArea ||
                self.tapPositionX > obacht.options.graphics.VIEWPORT_WIDTH / 4 -self.tapToleranceArea) {

                self.standUp();
                self.isCrouching = false;
            }
        }
    });

};

obacht.PlayerController.prototype = {

    /**
     * Publishes the player action with action "jump".
     * Calls the playerAction function in MultiplayerService.
     */
    jump: function() {
        "use strict";
        obacht.mp.playerAction('jump', {});
        this.events.publish('own_player_action', {
            action: 'jump'
        });
    },

    /**
     * Publishes the player action with action "crouch".
     * Calls the playerAction function in MultiplayerService.
     */
    crouch: function() {
        "use strict";
        obacht.mp.playerAction('crouch', {});
        this.events.publish('own_player_action', {
            action: 'crouch'
        });
    },

    /**
     * Publishes the player action with action "standUp".
     * Calls the playerAction function in MultiplayerService.
     */
    standUp: function() {
        "use strict";
        obacht.mp.playerAction('standUp', {});
        this.events.publish('own_player_action', {
            action: 'standUp'
        });
    }
};
