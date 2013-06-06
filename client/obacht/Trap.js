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
    var self = this;
    this.type = type;
    this.who = 'undefined';

    var trapDetail = obacht.themes[obacht.mp.roomDetail.theme].traps[type];

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////

    this.trap = new lime.Sprite()
        .setSize(trapDetail.width, trapDetail.height)
        .setFill(currentGame.spritesheet.getFrame(trapDetail.file));
//        .setFill('assets/themes/' + obacht.mp.roomDetail.theme + '/traps/' + this.type + '.png');

};

obacht.Trap.prototype = {

};
