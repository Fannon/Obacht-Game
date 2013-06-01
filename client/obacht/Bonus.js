/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Bonus');
goog.require('lime.RoundedRect');

/**
 * Bonus Object.
 *
 * @constructor
 *
 * @author Lukas Jaborsky
 */
obacht.Bonus = function(type) {
	"use strict";

	////////////////
    // ATTRIBUTES //
    ////////////////
    var self = this;
    this.type = type;
//	this.fill = obacht.options.bonus.general.path + this.type + '.png';
    this.fill = 'assets/themes/' + obacht.mp.roomDetail.theme + '/boni/' + this.type + '.png';
	console.log("new Bonus: " + this.fill);
    this.clicked = false;

	//this.time = new Date();
	this.drawtime = 0;
	this.clicktime = 0;

	////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
	this.bonusButton = new lime.RoundedRect().setSize(obacht.options.bonus.general.size, obacht.options.bonus.general.size).setPosition(obacht.options.bonus.general.x, obacht.options.bonus.general.y).setFill(this.fill).setAnchorPoint(0, 0).setRadius(15);
    this.layer = new lime.Layer().setSize(obacht.options.bonus.general.size, obacht.options.bonus.general.size);
    self.drawBonus();

    /////////////////////////
    // SUBSCRIBE TO EVENTS //
    /////////////////////////
    goog.events.listen(this.bonusButton, ['touchstart', 'mousedown'], function(e) {
        self.checkReactiontime();
        self.deleteBonus();
    });
};

obacht.Bonus.prototype = {

     /**
     * Draw the bonus-button
     */
    drawBonus: function() {
        "use strict";
        this.layer.appendChild(this.bonusButton);
        this.drawtime = this.getTime();
        this.bonusTimer();
    },

    /**
     * Delete the bonus after 2 seconds
     */
    bonusTimer: function() {
        "use strict";
        var self = this;
        setTimeout(function(){
            if(!self.clicked) {
                self.noReaction();
            }
        }, obacht.options.bonus.general.displayTime);
    },

    noReaction: function() {
        "use strict";
        this.deleteBonus();
        var reactiontime = 9999;
        obacht.mp.checkReactiontime(this.type, reactiontime);
    },

    /**
     * Delete the bonus-button
     */
    deleteBonus: function() {
        "use strict";
        this.layer.removeChild(this.bonusButton);
    },

    /**
     * Check the reaction time
     */
    checkReactiontime: function() {
        "use strict";
        this.clicked = true;
        this.clicktime = this.getTime();
        var reactiontime = this.clicktime - this.drawtime;
        obacht.mp.checkReactiontime(this.type, reactiontime);
    },

    /**
     * determine time in ms
     *
     * @returns {Number} ms current time in ms
     */
    getTime: function() {
        "use strict";
        var time = new Date();
        return time.getTime();
    }

};
