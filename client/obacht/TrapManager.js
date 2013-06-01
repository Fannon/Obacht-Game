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

        trap.trap.setPosition(1200, 400);
        trap.trap.setAnchorPoint(0, -2);

        var startwinkel=45;
        var winkel=startwinkel;
        var winkelgeschwindigkeit=0.01;
        //Startposition
        var groundx=0;
        var groundy=1400;

        //1225
        //1400

        var faktor=1400;

        trap.trap.setPosition(groundx,groundy);

        lime.scheduleManager.scheduleWithDelay(function(dt){

            var position = trap.trap.getPosition();

            position.x = Math.sin(winkel) * faktor + groundx;
            position.y = Math.cos(winkel) * faktor + groundy;

            trap.trap.setPosition(position);
            winkel=winkel+winkelgeschwindigkeit;
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
                    delete traps[i];
                    this.layer.removeChild(trap.layer);

                    console.log('Trap removed');
                }
            }
        }
    }
};

