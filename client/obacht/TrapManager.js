/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.TrapManager');

goog.require('obacht.Trap');

/**
 * Trap Manager/Collection
 *
 * @param {String} type     Own or enemy TrapManager
 * @param {Object} world    World the TrapManager manages
 *
 * @constructor
 */
obacht.TrapManager = function(type, world) {
    "use strict";

    var self = this;
    this.traps = [];
    this.world = world;

    // TODO: Own || Enemy Traps!

    obacht.mp.events.subscribe('trap', function(data) {
        var trap = new obacht.Trap(data.type);
        self.traps[self.traps.length] = trap;
        self.world.ground1.appendChild(trap.layer);
    });

};

obacht.TrapManager.prototype = {

};

