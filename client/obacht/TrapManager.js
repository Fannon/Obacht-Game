/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.TrapManager');

goog.require('obacht.Trap');

/**
 * Trap Manager/Collection
 *
 * @param {String} type     Own or enemy TrapManager
 * @param {Object} world    World the TrapManager manages
 * @param {Object} player   Player
 * @param {Object} layer   Layer
 *
 * @constructor
 */
obacht.TrapManager = function(type, world, player, layer) {
    "use strict";

    var self = this;
    this.traps = [];
    this.world = world;
    this.layer = layer;

    // TODO: Own || Enemy Traps!

    obacht.mp.events.subscribe('trap', function(data) {
        var trap = new obacht.Trap(data.type);
        self.traps[self.traps.length] = trap;
        self.layer.appendChild(trap.layer);

        var anglespeed=0.01;

        var factor=obacht.options.trap.own.factorlow;
        var angle=obacht.options.trap.own.angle;

        lime.scheduleManager.scheduleWithDelay(function(dt){

            var position = trap.trap.getPosition();

            position.x = Math.sin(angle) * factor + obacht.options.trap.own.x;
            position.y = Math.cos(angle) * factor + obacht.options.trap.own.y;

            trap.trap.setPosition(position);
            angle=angle+anglespeed;
        }, trap,1);

    });

    obacht.intervals.cleanUpTraps = setInterval(function() {
        self.cleanUpTraps(self.traps);
    }, 500);

};

obacht.TrapManager.prototype = {

    /**
     * Removes all Traps that are beyond the player
     *
     * @param {Object} traps Traps Array
     */
    cleanUpTraps: function(traps) {
        "use strict";

        for (var i = 0; i < traps.length; i++) {

            var trap = traps[i];

            if (trap) { // Removed Traps are 'undefined'
                var position = trap.trap.getPosition();
                var width = trap.trap.getSize().width;
                if (position.x < 0 - width) {
                    this.layer.removeChild(trap.layer);
                    delete traps[i];
                    console.log('Trap removed');
                }
            }
        }
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {

    }
};

