/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Inventory');

goog.require('lime.RoundedRect');

/**
 * Inventory Object.
 *
 * @constructor
 *
 * @author Lukas Jaborsky
 */
obacht.Inventory = function() {
	"use strict";
	console.log("new Inventory");
	
	var self = this;

	/////////////////////
    // INVENTORY ARRAY //
    /////////////////////
    this.trays = new Array();
    
    this.trays[0] = new Array(); 
    this.trays[0].active = true;
    this.trays[0].type = 'snake';
    this.trays[0].fill = "assets/boni/" + this.trays[0].type + '.png';
    this.trays[0].button = new lime.RoundedRect().setSize(obacht.options.inventory.size, obacht.options.inventory.size).setPosition(obacht.options.inventory.right.x, obacht.options.inventory.y).setFill(this.trays[0].fill).setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);

    
    this.trays[1] = new Array(); 
    this.trays[1].active = false;
    this.trays[1].type = 'none';
    this.trays[1].fill = "assets/boni/" + this.trays[1].type + '.png';
    this.trays[1].button = new lime.RoundedRect().setSize(obacht.options.inventory.size, obacht.options.inventory.size).setPosition(obacht.options.inventory.center.x, obacht.options.inventory.y).setFill(this.trays[1].fill).setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);
    
    this.trays[2] = new Array(); 
    this.trays[2].active = false;
    this.trays[2].type = 'none';
    this.trays[2].fill = "assets/boni/" + this.trays[2].type + '.png';
    this.trays[2].button = new lime.RoundedRect().setSize(obacht.options.inventory.size, obacht.options.inventory.size).setPosition(obacht.options.inventory.left.x, obacht.options.inventory.y).setFill(this.trays[2].fill).setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);


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
            this.resetTray(tray);
       }
    },
   
   /**
    * 
    * @param {Object} type Type of the trap
    */
    throwTrap: function(type) {
        "use strict";
        console.log('throwTrap: ' + type)
        //obacht.mp.throwTrap(type);
    },
   
   /**
    * 
    * @param {Object} tray Number of the inventory tray
    */
    resetTray: function(tray){
        "use strict";
        this.trays[tray].active = false;
        this.trays[tray].type = 'none';
        this.trays[tray].fill = "assets/boni/" + this.trays[tray].type + '.png';
        this.trays[tray].button.setFill(this.trays[tray].fill);
   }
};
