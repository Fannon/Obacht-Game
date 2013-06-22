/* global goog, lime, obacht, log */

goog.provide('obacht.Bonus');
goog.require('lime.RoundedRect');

/**
 * This is a Bonus Object.
 *
 * @param  {Object} currentGame Current Game Object
 * @param  {String} type        Type
 */
obacht.Bonus = function(currentGame, type) {
	"use strict";

	////////////////
    // ATTRIBUTES //
    ////////////////

    var self = this;

    this.gameLayer = currentGame.layer;
    this.spritesheet = currentGame.spritesheet;
    this.type = type;
    this.clicked = false;
	this.drawtime = 0;
	this.clicktime = 0;


	////////////////////
    // LIMEJS OBJECTS //
    ////////////////////

	this.bonusButton = new lime.RoundedRect()
        .setSize(obacht.options.bonus.general.size, obacht.options.bonus.general.size)
        .setPosition(obacht.options.bonus.general.x, obacht.options.bonus.general.y)
        .setFill(this.spritesheet.getFrame('boni_' + this.type + '.png'))
        .setAnchorPoint(0, 0)
        .setQuality(obacht.options.graphics.bonusQuality)
        .setRadius(15)
        .setRenderer(obacht.renderer.bonus);

    self.drawBonus();


    /////////////////////////
    // SUBSCRIBE TO EVENTS //
    /////////////////////////

    goog.events.listen(this.bonusButton, ['touchstart', 'mousedown'], function() {
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
        this.gameLayer.appendChild(this.bonusButton);
        this.drawtime = this.getTime();
        this.bonusTimer();
    },

    /**
     * Delete the bonus after 2 seconds
     */
    bonusTimer: function() {
        "use strict";
        var self = this;
        obacht.timeout(function(){
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
        this.gameLayer.removeChild(this.bonusButton);
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
