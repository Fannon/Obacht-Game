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

        lime.scheduleManager.schedule(function(dt){

            var rotation = trap.trap.getRotation();
            rotation += 0.1;
            trap.trap.setRotation(rotation);

//            console.log(trap.trap.getPosition());

        }, trap);


    });



};

obacht.TrapManager.prototype = {

};

