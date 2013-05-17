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

    this.leftInventory = new obacht.Inventory('left');
    this.centerInventory = new obacht.Inventory('center');
    this.rightInventory = new obacht.Inventory('right');
    
    this.bonus = new obacht.Bonus('snake');

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.tapAreaTop);
    this.layer.appendChild(this.tapAreaBottom);
    this.layer.appendChild(this.tapAreaPuffer);
    this.layer.appendChild(this.leftInventory.layer);
    this.layer.appendChild(this.centerInventory.layer);
    this.layer.appendChild(this.rightInventory.layer);
    this.layer.appendChild(this.bonus.layer);
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
       if(obacht.options.inventory.left.active === true){
            self.useItem(obacht.options.inventory.left.type);
            obacht.options.inventory.left.active = false;
       }
    });
    
    //CENTER INVENTORY BUTTON
    goog.events.listen(this.centerInventory.layer, ['touchstart', 'mousedown'], function(e) {
       console.log('click center');
        if(obacht.options.inventory.center.active === true){
            self.useItem(obacht.options.inventory.center.type);
            obacht.options.inventory.center.active = false;
        }
    });
    
    //RIGHT INVENTORY BUTTON
    goog.events.listen(this.rightInventory.layer, ['touchstart', 'mousedown'], function(e) {
       console.log('click right');
       if(obacht.options.inventory.right.active === true){
            self.useItem(obacht.options.inventory.right.type);
            obacht.options.inventory.right.active = false;
        }
    });
    
    //GET BONUS
    goog.events.listen(this.bonus.layer, ['touchstart', 'mousedown'], function(e) {
       console.log('click Boni');
       if(obacht.options.inventory.right.active === false){
           self.getItem('right');
           obacht.options.inventory.right.active = true;
       }else if(obacht.options.inventory.center.active === false){
           self.getItem('center');
           obacht.options.inventory.center.active = true;
       }else if(obacht.options.inventory.left.active === false){
           self.getItem('left');
           obacht.options.inventory.left.active = true;	
       }else {
       	   console.log('Inventary is full')
           return false;	
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
    },

    getItem: function(inventary) {
        "use strict";
        console.log('get Boni' + inventary);
        /*this.events.publish('getBoni',{
            inventary: inventary
        });*/
        //funktion wird durch tippen auf das erscheinende Icon ausgelöst und legt das Icon im Inventar ab
    },

    useItem: function(type) {
        "use strict";
        //function wird durch tippen auf ein Icon im Inventar ausgelöst, setzt das Hinderniss und löscht das Icon dann aus dem Inventar
        console.log('use Item: ' + type);
        obacht.mp.playerAction('standUp', {
            d: 3
        });
    }
};
