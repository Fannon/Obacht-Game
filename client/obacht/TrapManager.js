/* global goog, lime, obacht, log */

goog.provide('obacht.TrapManager');

goog.require('obacht.Trap');

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
    this.world = world;
    this.player = player;
    this.currentGame = currentGame;

    /** Trap Array on Top World */
    this.topTraps = [];

    /** Trap Array on Bottom World */
    this.bottomTraps = [];

    /**
     * Enemy Trap Event Listener
     * @event
     */
    obacht.mp.events.subscribe('top_trap', function(data) {

        var anglespeed = obacht.options.trap.general.anglespeed;
        var millesecondsmove = obacht.options.trap.general.millesecondsmove;
        var factor;
        var angle;

        var trap = self.createTrap(data.type, 'top');
        trap.i = self.topTraps.length;
        self.topTraps[trap.i] = trap;

        trap.sprite.setPosition(obacht.options.trap.enemy.x, obacht.options.trap.enemy.y);
        trap.sprite.setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
        trap.sprite.setRotation(180);
        angle = obacht.options.trap.enemy.angle;

        //Do you fly low or high?
        var positiontype = obacht.themes[obacht.mp.roomDetail.theme].traps[data.type].position;
        if (positiontype === 'air') {
            factor = obacht.options.trap.general.factorhigh;
        } else if (positiontype === 'ground') {
            factor = obacht.options.trap.general.factorlow;
        }

        //Movement
        lime.scheduleManager.scheduleWithDelay(function(dt) {

            var position = trap.sprite.getPosition();

            position.x = Math.sin(angle) * factor + obacht.options.trap.enemy.x;
            position.y = Math.cos(angle) * factor + obacht.options.trap.enemy.y;

            trap.sprite.setPosition(position);

            angle = angle + anglespeed;
        }, trap, millesecondsmove);
    });


    /**
     * bottom Traps Event Listener
     * @event
     */
    obacht.mp.events.subscribe('bottom_trap', function(data) {

        var anglespeed = obacht.options.trap.general.anglespeed;
        var millesecondsmove = obacht.options.trap.general.millesecondsmove;
        var factor;
        var angle;

        var trap = self.createTrap(data.type, 'bottom');
        trap.i = self.bottomTraps.length;
        self.bottomTraps[trap.i] = trap;

        trap.sprite.setPosition(obacht.options.trap.own.x, obacht.options.trap.own.y);
        trap.sprite.setAnchorPoint(obacht.options.trap.general.anchorx, obacht.options.trap.general.anchory);
        angle = obacht.options.trap.own.angle;

        //Do you fly low or high?
        var positiontype = obacht.themes[obacht.mp.roomDetail.theme].traps[data.type].position;
        if (positiontype === 'air') {
            factor = obacht.options.trap.general.factorhigh;
        } else if (positiontype === 'ground') {
            factor = obacht.options.trap.general.factorlow;
        }

        /**
         * Collision Checking
         */
        lime.scheduleManager.scheduleWithDelay(function() {
            var collision = self.checkColl(self.currentGame.layer, player, self.bottomTraps);
            if (collision) {
                currentGame.ownPlayer.loseHealth();
            }
        }, player, obacht.options.collisions.checkInterval);

        //Movement
        lime.scheduleManager.scheduleWithDelay(function(dt) {

            var position = trap.sprite.getPosition();

            position.x = Math.sin(angle) * factor + obacht.options.trap.own.x;
            position.y = Math.cos(angle) * factor + obacht.options.trap.own.y;

            trap.sprite.setPosition(position);

            angle = angle + anglespeed;
        }, trap, millesecondsmove);
    });
};

obacht.TrapManager.prototype = {

    /**
     * Creates a new Trap and adds a Timer to remove it after a while
     *
     * @param {String} type         Type of the Trap
     * @param {String} location     Location of the Trap (bottom|top)
     */
    createTrap: function(type, location) {
        "use strict";

        var self = this;
        var trap = new obacht.Trap(obacht.currentGame, type);
        trap.location = location;

        self.currentGame.layer.appendChild(trap.sprite);

        /**
         * Delete the Trap after a specific Timeout
         */
        setTimeout(function() {
            log.debug('Trap Removed.');
            self.currentGame.layer.removeChild(trap.sprite);

            if (location === 'top') {
                delete self.topTraps[trap.i];
            } else if(location === 'bottom') {
                delete self.bottomTraps[trap.i];
            }

        }, obacht.options.trap.general.clearTimeout);

        return trap;
    },

    /**
     *
     * @param layer
     * @param player
     * @param traps
     * @returns {boolean}
     */
    checkColl: function(layer, player, traps) {
        "use strict";

        var self = this;

        if (!obacht.playerController) {
            return false;
        }

        for (var i = 0; i < traps.length; i++) {
            if (typeof traps[i] !== 'undefined' && traps[i].location === 'bottom' && traps[i].type !== 'undefined') {

                var trap = traps[i];

                //Collision detection
                var state = false;

                var obj1w = player.character.getSize().width;
                var obj1h = player.character.getSize().height;

                /*Size Object2*/
                var obj2w = trap.sprite.getSize().width;
                var obj2h = trap.sprite.getSize().height;

                //Get Positions of the objects
                var obj1x = layer.screenToLocal(player.character.getPosition()).ceil().x;
                var obj1y = layer.screenToLocal(player.character.getPosition()).ceil().y;

                var obj2x = layer.screenToLocal(trap.sprite.getPosition()).ceil().x;
                var obj2y = layer.screenToLocal(trap.sprite.getPosition()).ceil().y;

                //Set left top corner of box
                //Attention => TOP: Y=0 Middle: X=0
                obj1x = obj1x - (obj1w) / 2;
                obj1y = obj1y - (obj1h) / 2;

                obj2x = obj2x - (obj2w) / 2;
                obj2y = obj2y - (obj2h) / 2;

                /*Request BoundingBoxes | Name = BoundingBoxes Object */
                var bbobj1 = obacht.options.player.boundingBoxes;
                var bbobj2 = obacht.themes[obacht.mp.roomDetail.theme].traps[trap.type].boundingBoxes;

                //Iterate through bounding boxes
                var y = 0;
                while (y < bbobj2.length) {

                    obj1x = obj1x + bbobj1[0].x;
                    obj1y = obj1y + bbobj1[0].y;

                    if (obacht.playerController.isCrouching === false) {
                        obj1w = bbobj1[0].width;
                        obj1h = bbobj1[0].height;
                    } else if (obacht.playerController.isCrouching === true) {
                        obj1w = bbobj1[0].width * obacht.options.player.general.crouchWidth;
                        obj1h = bbobj1[0].height * obacht.options.player.general.crouchHeight;
                    }

                    obj2x = obj2x + bbobj2[y].x;
                    obj2y = obj2y + bbobj2[y].y;

                    obj2w = bbobj2[y].width;
                    obj2h = bbobj2[y].height;

                    if (obj1x < obj2x + obj2w &&
                        obj2x < obj1x + obj1w &&
                        obj1y < obj2y + obj2h &&
                        obj2y < obj1y + obj1h === true) {
                        state = true;
                    }

                    if (state === true) {
                        self.currentGame.layer.removeChild(trap.sprite);
                        log.debug('Collision! ' + trap.type);
                        delete traps[i];
                        return true;
                    }
                    y = y + 1;
                }
            }
        }
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {
        "use strict";
        obacht.mp.events.clear('top_trap');
        obacht.mp.events.clear('bottom_trap');
        clearInterval(this.cleanUpTrapsInterval);
    }
};

