/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.TrapManager');

goog.require('obacht.Trap');
goog.require('obacht.Collision');

/**
 * Trap Manager/Collection
 *
 * @param {Object} currentGame  Current Game Object
 * @param {Object} world        World the TrapManager manages
 * @param {Object} player       Player
 *
 * @constructor
 */
obacht.TrapManager = function(currentGame, world, player) {
    "use strict";

    var self = this;
    this.currentGame = currentGame;
    this.world = world;
    this.player = player;
    this.layer = currentGame.layer;

    this.traps = [];


    //TESTVAR 1
    obacht.mp.events.subscribe('enemy_trap', function(data) {
        var anglespeed=obacht.options.trap.general.anglespeed;
        var millesecondsmove=obacht.options.trap.general.millesecondsmove;
        var factor;
        var angle;

        var trap = new obacht.Trap(data.type);
        self.traps[self.traps.length] = trap;
        self.layer.appendChild(trap.trap);
        trap.who='enemy';

        trap.trap.setPosition(obacht.options.trap.enemy.x, obacht.options.trap.enemy.y);
        trap.trap.setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
        trap.trap.setRotation(180);
        angle = obacht.options.trap.enemy.angle;

        //Do you fly low or high?
        var positiontype=obacht.themes[obacht.mp.roomDetail.theme].traps[data.type].position;
        if (positiontype==='air') {
            factor = obacht.options.trap.general.factorhigh;
        }else if(positiontype==='ground') {
            factor = obacht.options.trap.general.factorlow;
        }

        //Collision
        lime.scheduleManager.schedule(function(dt){
            self.checkColl(self.layer,player,self.traps);
        },player);


        //Movement
        lime.scheduleManager.scheduleWithDelay(function(dt){

            var position = trap.trap.getPosition();

            position.x = Math.sin(angle) * factor + obacht.options.trap.enemy.x;
            position.y = Math.cos(angle) * factor + obacht.options.trap.enemy.y;

            trap.trap.setPosition(position);

            angle=angle+anglespeed;
        }, trap,millesecondsmove);
    });


    obacht.mp.events.subscribe('own_trap', function(data) {
        var anglespeed=obacht.options.trap.general.anglespeed;
        var millesecondsmove=obacht.options.trap.general.millesecondsmove;
        var factor;
        var angle;

        var trap = new obacht.Trap(data.type);
        self.traps[self.traps.length] = trap;
        self.layer.appendChild(trap.trap);
        trap.who='own';

        trap.trap.setPosition(obacht.options.trap.own.x, obacht.options.trap.own.y);
        trap.trap.setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
        angle = obacht.options.trap.own.angle;

        //Do you fly low or high?
        var positiontype=obacht.themes[obacht.mp.roomDetail.theme].traps[data.type].position;
        if (positiontype==='air') {
            factor = obacht.options.trap.general.factorhigh;
        }else if(positiontype==='ground') {
            factor = obacht.options.trap.general.factorlow;
        }

        //Collision
        lime.scheduleManager.schedule(function(dt){
            self.checkColl(self.layer,player,self.traps);
        },player);

        //Movement
        lime.scheduleManager.scheduleWithDelay(function(dt){

            var position = trap.trap.getPosition();

            position.x = Math.sin(angle) * factor + obacht.options.trap.own.x;
            position.y = Math.cos(angle) * factor + obacht.options.trap.own.y;

            trap.trap.setPosition(position);

            angle=angle+anglespeed;
        }, trap,millesecondsmove);
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

                if(trap.who==='own'){
                    if (position.x < 0 - width) {
                        this.layer.removeChild(trap.trap);
                        console.log('Trap removed left side: '+traps[i].type);
                        delete traps[i];
                    }
                }else if(trap.who==='enemy'){
                    if (position.x > obacht.options.graphics.VIEWPORT_WIDTH + width){
                        this.layer.removeChild(trap.trap);
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
            if(typeof traps[i] !== 'undefined' && traps[i].who==='own'){
                var trap = traps[i];

                //Collision detection
                var state=false;

                var obj1w = player.character.getSize().width;
                var obj1h = player.character.getSize().height;

                /*Size Object2*/
                var obj2w = trap.trap.getSize().width;
                var obj2h = trap.trap.getSize().height;

                //Get Positions of the objects
                var obj1x=layer.screenToLocal(player.character.getPosition()).ceil().x;
                var obj1y=layer.screenToLocal(player.character.getPosition()).ceil().y;

                var obj2x=layer.screenToLocal(trap.trap.getPosition()).ceil().x;
                var obj2y=layer.screenToLocal(trap.trap.getPosition()).ceil().y;

                //Set left top corner of box
                obj1x=obj1x-(obj1w)/2;
                obj1y=obj1y+(obj1h)/2;

                obj2x=obj2x-(obj2w)/2;
                obj2y=obj2y+(obj2h)/2;

                /*Request BoundingBoxes | Name = BoundingBoxes Object */
                var bbobj1 = obacht.options.player.boundingBoxes;
                var bbobj2 = obacht.themes[obacht.mp.roomDetail.theme].traps[trap.type].boundingBoxes;

                //Iterate through bounding boxes
                var y = 0;
                while (y < bbobj2.length) {

                    obj1x = obj1x + bbobj1[0].x;
                    obj1y = obj1y - bbobj1[0].y;

                    if(obacht.playerController.isCrouching===false){
                        obj1w = bbobj1[0].width;
                        obj1h = bbobj1[0].height;
                    }else if(obacht.playerController.isCrouching===true){
                        obj1w = bbobj1[0].width*obacht.options.player.general.crouchWidth;
                        obj1h = bbobj1[0].height*obacht.options.player.general.crouchHeight;
                    }

                    obj2x = obj2x + bbobj2[y].x;
                    obj2y = obj2y - bbobj2[y].y;

                    obj2w = bbobj2[y].width;
                    obj2h = bbobj2[y].height;

                    if (obj1x < obj2x + obj2w  &&
                        obj2x < obj1x + obj1w  &&
                        obj1y < obj2y + obj2h &&
                        obj2y < obj1y + obj1h === true){
                        state=true;
                    }

                    if(state===true){
                        this.layer.removeChild(trap.trap);
                        console.log('Kollision! '+trap.type);
                        delete traps[i];
                    }
                    y=y+1;
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

