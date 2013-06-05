/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

goog.require('lime.Sprite');

/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(currentGame, type) {

    console.log('New Trap(): ' + type);

    ////////////////
    // ATTRIBUTES //
    ////////////////
    var self = this;
    this.type = type;
    this.who = 'undefined';
    this.zahl = Math.random();

    this.spritesheet = currentGame.spritesheet;

    var traps = obacht.themes[obacht.mp.roomDetail.theme].traps;

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////

    this.trap = new lime.Sprite()
        .setSize(traps[type].width, traps[type].height)
        .setFill(this.spritesheet.getFrame(traps[type].file));
//        .setFill('assets/themes/' + obacht.mp.roomDetail.theme + '/traps/' + this.type + '.png');

};

obacht.Trap.prototype = {

};
