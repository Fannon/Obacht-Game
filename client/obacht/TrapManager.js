/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.TrapManager');

goog.require('obacht.Trap');
goog.require('obacht.Collision');

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
    this.player = player;

    this.type = type;

    //TESTVAR 1


    obacht.mp.events.subscribe('trap', function(data) {
        var trap = new obacht.Trap(data.type);
        self.traps[self.traps.length] = trap;
        self.layer.appendChild(trap.layer);

        var anglespeed=0.015;
        var millesecondsmove=15;
        var millesecondscoll=100;
        var factor;
        var angle;

        //Are you own or enemy?
        if(trap.who==='own') {
            trap.trap.setPosition(obacht.options.trap.own.x, obacht.options.trap.own.y);
            trap.trap.setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
            angle = obacht.options.trap.own.angle;
        }else if(trap.who==='enemy') {
            trap.trap.setPosition(obacht.options.trap.enemy.x, obacht.options.trap.enemy.y);
            trap.trap.setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
            trap.trap.setRotation(180);
            angle = obacht.options.trap.enemy.angle;
        }

        //Do you fly low or high?
        var positiontype=obacht.themes[obacht.mp.roomDetail.theme].traps[data.type].position;
        if (positiontype==='air') {
            factor = obacht.options.trap.general.factorhigh;
        }else if(positiontype==='ground') {
            factor = obacht.options.trap.general.factorlow;
        }

        //Movement
        lime.scheduleManager.scheduleWithDelay(function(dt){

            var position = trap.trap.getPosition();

            position.x = Math.sin(angle) * factor + obacht.options.trap[trap.who].x;
            position.y = Math.cos(angle) * factor + obacht.options.trap[trap.who].y;

            trap.trap.setPosition(position);

            angle=angle+anglespeed;
        }, trap,millesecondsmove);
    });

    obacht.intervals.cleanUpTraps = setInterval(function() {
        self.checkColl(self.layer,player,self.traps);
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

                if(trap.who==='own'){
                    if (position.x < 0 - width) {
                        this.layer.removeChild(trap.layer);
                        console.log('Trap removed left side: '+traps[i].type);
                        delete traps[i];
                    }
                }else if(trap.who==='enemy'){
                    if (position.x > obacht.options.graphics.VIEWPORT_WIDTH + width){
                        this.layer.removeChild(trap.layer);
                        console.log('Trap removed right side:' +traps[i].type);
                        delete traps[i];
                    }
                }


            }
        }
    },

    checkColl: function(layer,player,traps) {
        "use strict";

        for (var i = 0; i < traps.length; i++) {

            var trap = traps[i];
            var position = trap.trap.getPosition();

            /*if(position.x<200){
                var kol=new obacht.Collision(layer,player,trap);
                if(kol.rect()===true){
                    console.log('boom! '+trap.type);
                    delete traps[i];
                }
            }*/
        }
    },

      /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {

    }
};

