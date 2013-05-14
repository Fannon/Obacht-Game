/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Inventory');

//goog.require('obacht.options');
//goog.require('lime.Layer');
goog.require('lime.RoundedRect');
/**
 * Inventory Object.
 *
 * @constructor
 *  
 * @author Lukas Jaborsky
 */
obacht.Inventory = function(type) {
	"use strict";
	console.log("new Inventory");
	
	////////////////
    // ATTRIBUTES //
    ////////////////
	
	if(type === "left"){
		this.positionX = obacht.options.Inventory.left.x;
	}
	if(type === "center"){
		this.positionX = obacht.options.Inventory.center.x;
	}
	if(type === "right"){
		this.positionX = obacht.options.Inventory.right.x;
	}
	
	this.positionY = obacht.options.Inventory.y;
	
	
	////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.inventoryButton = new lime.RoundedRect().setSize(obacht.options.Inventory.size, obacht.options.Inventory.size).setPosition(this.positionX, this.positionY).setFill('#ffffff').setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.inventoryButton);
	
};

obacht.Inventory.prototype = {

};
