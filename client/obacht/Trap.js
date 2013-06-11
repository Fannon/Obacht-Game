/* global goog, lime, obacht, log */

goog.provide('obacht.Trap');

goog.require('lime.Sprite');

/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(currentGame, type) {
    "use strict";

    log.debug('New Trap(): ' + type);

    ////////////////
    // ATTRIBUTES //
    ////////////////

    this.type = type;
    this.location = undefined;

    var trapDetail = obacht.themes[obacht.mp.roomDetail.theme].traps[type];

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////

    this.sprite = new lime.Sprite()
        .setSize(trapDetail.width, trapDetail.height)
        .setFill(currentGame.spritesheet.getFrame(trapDetail.file));
};

obacht.Trap.prototype = {

};
