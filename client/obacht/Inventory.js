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
obacht.Inventory = function(position) {
	"use strict";
	console.log("new Inventory");

	////////////////
    // ATTRIBUTES //
    ////////////////

	if(position === "left"){
		this.positionX = obacht.options.inventory.left.x;
	}
	if(position === "center"){
		this.positionX = obacht.options.inventory.center.x;
	}
	if(position === "right"){
		this.positionX = obacht.options.inventory.right.x;
	}

	this.positionY = obacht.options.inventory.y;

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.inventoryButton = new lime.RoundedRect().setSize(obacht.options.inventory.size, obacht.options.inventory.size).setPosition(this.positionX, this.positionY).setFill('#ffffff').setOpacity(0.5).setAnchorPoint(0, 0).setRadius(15);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.inventoryButton);

};

obacht.Inventory.prototype = {

};
