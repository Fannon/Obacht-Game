/* global goog, lime, obacht, log */

goog.provide('obacht.PlayerController');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');



/**
 * Its a Player Controller
 *
 * @constructor
 */
obacht.PlayerController = function() {
    "use strict";
    var self = this;

    /** Tap area for jump events */
    this.tapAreaTop = new lime.Node()
        .setSize(obacht.options.graphics.VIEWPORT_WIDTH / 4, obacht.options.graphics.VIEWPORT_HEIGHT / 2)
        .setPosition(0, 0)
        .setAnchorPoint(0, 0);

    /** Tap area for crouch events */
    this.tapAreaBottom = new lime.Node()
        .setSize(obacht.options.graphics.VIEWPORT_WIDTH / 4, obacht.options.graphics.VIEWPORT_HEIGHT / 2)
        .setPosition(0, obacht.options.graphics.VIEWPORT_HEIGHT / 2)
        .setAnchorPoint(0, 0);

    /** Sets up a bigger area for touchend events, so when the user swipes his finger while crouching the end of the action can be caught. */
    this.tapAreaPuffer = new lime.Node()
        .setSize(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT)
        .setPosition(0, 0)
        .setAnchorPoint(0, 0);

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.tapAreaTop);
    this.layer.appendChild(this.tapAreaBottom);
    this.layer.appendChild(this.tapAreaPuffer);

    // Event Publisher/Subscriber
    this.events = new goog.pubsub.PubSub();



    ////////////////////////////////
    /* EVENT HANDLING FOR JUMPING */
    ////////////////////////////////

    /** Indicates if the player is currently jumping */
    this.isJumping = false;

    goog.events.listen(this.tapAreaTop, ['touchstart', 'mousedown'], function(e) {
        if (self.isJumping === true) {
            return false;
        } else {
            self.jump();
            self.isJumping = true;
        }
    });



    //////////////////////////////////
    /* EVENT HANDLING FOR CROUCHING */
    //////////////////////////////////

    /** Indicates if the player is currently crouching */
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

    /** Safety are for touch events that leave the screen and don't cause a touchend or touchcancel event */
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



///////////////////////////
/* PROTOTYPE - FUNCTIONS */
///////////////////////////

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
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {
        "use strict";


    }
};
