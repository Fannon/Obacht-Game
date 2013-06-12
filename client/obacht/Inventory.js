/* global goog, lime, obacht, log */

goog.provide('obacht.Inventory');

goog.require('lime.RoundedRect');
goog.require('lime.Sprite');

/**
 * Inventory Object.
 *
 * @constructor
 *
 * @author Lukas Jaborsky
 */

/**
 *
 * @param currentGame
 * @constructor
 */
obacht.Inventory = function(currentGame) {
	"use strict";
	log.debug("new Inventory");

	var self = this;

    this.gameLayer = currentGame.layer;
    this.spritesheet = currentGame.spritesheet;

	/////////////////////
    // INVENTORY ARRAY //
    /////////////////////
    this.trays = [];

    this.trays[0] = [];
    this.trays[0].active = false;
    this.trays[0].type = 'none';
    this.trays[0].fill = this.spritesheet.getFrame('boni_' + this.trays[0].type + '.png');
    this.trays[0].button = new lime.RoundedRect()
        .setSize(obacht.options.inventory.size, obacht.options.inventory.size)
        .setPosition(obacht.options.inventory.right.x, obacht.options.inventory.y)
        .setFill(this.trays[0].fill)
        .setOpacity(0.5)
        .setAnchorPoint(0, 0)
        .setRadius(15);


    this.trays[1] = [];
    this.trays[1].active = false;
    this.trays[1].type = 'none';
    this.trays[1].fill = this.spritesheet.getFrame('boni_' + this.trays[0].type + '.png');
    this.trays[1].button = new lime.RoundedRect()
        .setSize(obacht.options.inventory.size, obacht.options.inventory.size)
        .setPosition(obacht.options.inventory.center.x, obacht.options.inventory.y)
        .setFill(this.trays[1].fill)
        .setOpacity(0.5)
        .setAnchorPoint(0, 0)
        .setRadius(15);

    this.trays[2] = [];
    this.trays[2].active = false;
    this.trays[2].type = 'none';
    this.trays[2].fill =this.spritesheet.getFrame('boni_' + this.trays[0].type + '.png');
    this.trays[2].button = new lime.RoundedRect()
        .setSize(obacht.options.inventory.size, obacht.options.inventory.size)
        .setPosition(obacht.options.inventory.left.x, obacht.options.inventory.y)
        .setFill(this.trays[2].fill)
        .setOpacity(0.5)
        .setAnchorPoint(0, 0)
        .setRadius(15);


    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.trays[0].button);
    this.layer.appendChild(this.trays[1].button);
    this.layer.appendChild(this.trays[2].button);


    ////////////
    // EVENTS //
    ////////////
    goog.events.listen(this.trays[0].button, ['touchstart', 'mousedown'], function(e) {
        self.checkTray(0);
    });

    goog.events.listen(this.trays[1].button, ['touchstart', 'mousedown'], function(e) {
        self.checkTray(1);
    });

    goog.events.listen(this.trays[2].button, ['touchstart', 'mousedown'], function(e) {
        self.checkTray(2);
    });
    obacht.mp.events.subscribe('receive_bonus', function(type, success) {
        log.debug('receive bonus: Type: ' + type + 'Success: ' + success);
        self.checkBoni(success, type);
    });

    obacht.playerController.layer.appendChild(self.layer);

};

obacht.Inventory.prototype = {

	/**
	 *
     * @param {Object} tray Number of inventory tray
	 */
	checkTray: function(tray) {
		"use strict";
		if(this.trays[tray].active === true){
            this.throwTrap(this.trays[tray].type);
            this.resetTray(tray, false, 'none');
       }
    },

   /**
    *
    * @param {Object} type Type of the trap
    */
    throwTrap: function(type) {
        "use strict";
        log.debug('throwTrap: ' + type);
        obacht.mp.throwTrap(type, obacht.mp.enemy);

       // Last Trap on Enemy World
       obacht.mp.lastTrap = new Date().getTime();
    },

    /**
     *
     * @param {Boolean} success true on success, false on failure
     * @param {Object} type Type of the trap
     */
    checkBoni: function(success, type){
        "use strict";
        log.debug('checkBoni');
        if(success === true) {
            this.fillTray(type);
        } else {
            this.setFail();
        }
    },

   /**
    *
    * @param {Object} type Type of trap
    */
    fillTray: function(type){
        "use strict";
        log.debug('fillTray');
        for(var i = 0; i < this.trays.length; i++) {
            if(this.trays[i].active === false) {
                this.resetTray(i, true, type);
                break;
            }
        }
    },

   /**
    *
    * @param {Object} tray Number of the inventory tray
    * @param {Boolean} active true to fill, false to clear the tray
    * @param {Object} type Type of the trap
    */
    resetTray: function(tray, active, type){
        "use strict";
        this.trays[tray].active = active;
        this.trays[tray].type = type;
        this.trays[tray].fill = this.spritesheet.getFrame('boni_' + this.trays[0].type + '.png');
        this.trays[tray].button.setFill(this.trays[tray].fill);
    },

    setFail: function(){
        "use strict";
        log.debug('to late for Bonus');
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {

    }


};
