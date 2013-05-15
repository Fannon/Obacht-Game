/* global goog, lime, obacht */
/* jshint devel: true */

goog.provide('obacht.PlayerController');

goog.require('obacht.options');
goog.require('obacht.Inventory');
goog.require('goog.pubsub.PubSub');

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
    
    this.leftInventory = new obacht.Inventory('left');
    this.centerInventory = new obacht.Inventory('center');
    this.rightInventory = new obacht.Inventory('right');
    //this.inventarButtonLeft = new lime.RoundedRect().setSize(obacht.options.playerController.inventar.size, obacht.options.playerController.inventar.size).setPosition(880, 20).setFill('#ffffff').setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);
    //this.inventarButtonCenter = new lime.RoundedRect().setSize(obacht.options.playerController.inventar.size, obacht.options.playerController.inventar.size).setPosition(1010, 20).setFill('#ffffff').setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);
    //this.inventarButtonRight = new lime.RoundedRect().setSize(obacht.options.playerController.inventar.size, obacht.options.playerController.inventar.size).setPosition(1140, 20).setFill('#ffffff').setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.tapAreaTop);
    this.layer.appendChild(this.tapAreaBottom);
    this.layer.appendChild(this.tapAreaPuffer);
    this.layer.appendChild(this.leftInventory.layer);
    this.layer.appendChild(this.centerInventory.layer);
    this.layer.appendChild(this.rightInventory.layer);
    //this.layer.appendChild(this.inventarButtonCenter);
    //this.layer.appendChild(this.inventarButtonRight);

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
    
    //LEFT INVENTORY BUTTON
   goog.events.listen(this.leftInventory.layer, ['touchstart', 'mousedown'], function(e) {
       console.log('click left');
       if(obacht.options.Inventory.left.active === true){
            self.useItem(obacht.options.Inventory.left.type);
       } else {
           return false;
       }
    });
    //CENTER INVENTORY BUTTON
    goog.events.listen(this.centerInventory.layer, ['touchstart', 'mousedown'], function(e) {
       console.log('click center');
        if(obacht.options.Inventory.center.active === true){
            self.useItem(obacht.options.Inventory.center.type);
        }
    });
    //RIGHT INVENTORY BUTTON
    goog.events.listen(this.rightInventory.layer, ['touchstart', 'mousedown'], function(e) {
       console.log('click right');
       if(obacht.options.Inventory.right.active === true){
            self.useItem(obacht.options.Inventory.right.type);
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
<<<<<<< HEAD
        obacht.mp.events.publish('player_standUp');
    },
    
    getItem: function() {
        "use strict";
        //funktion wird durch tippen auf das erscheinende Icon ausgelöst und legt das Icon im Inventar ab
    },
    
    useItem: function(type) {
        "use strict";
        //function wird durch tippen auf ein Icon im Inventar ausgelöst, setzt das Hinderniss und löscht das Icon dann aus dem Inventar
        console.log('use Item: ' + type);
=======
        obacht.mp.playerAction('standUp', {
            d: 3
        });
>>>>>>> Bugfix
    }
};
