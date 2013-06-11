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
                log.debug('Player Collision with Trap!');
//                currentGame.ownPlayer.loseHealth();
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
            self.removeTrap(trap);
        }, obacht.options.trap.general.clearTimeout);

        return trap;
    },

    /**
     * Removes the Trap from the Layer and the DataStructures
     * @param {Object} trap Trap Object
     */
    removeTrap: function(trap) {
        "use strict";

        log.debug('Trap Removed.');
        this.currentGame.layer.removeChild(trap.sprite);

        if (trap.location === 'top') {
            delete this.topTraps[trap.i];
        } else if(trap.location === 'bottom') {
            delete this.bottomTraps[trap.i];
        }
    },

    /**
     * Checks for Collisions between bottom Player and bottom Traps
     *
     * @returns {boolean} True if Collision, false
     */
    checkColl: function() {
        "use strict";

        var self = this;

        if (!obacht.currentGame || !obacht.playerController) {
            return false;
        }

        for (var i = 0; i < self.bottomTraps.length; i++) {

            if (self.bottomTraps[i] && self.bottomTraps[i].location === 'bottom' && self.bottomTraps[i].type) {

                var trap = self.bottomTraps[i];


                ///////////////////////////////////
                // Player and Trap Size          //
                ///////////////////////////////////

                var playerWidth = self.currentGame.ownPlayer.character.getSize().width;
                var playerHeight = self.currentGame.ownPlayer.character.getSize().height;

                var trapWidth = trap.sprite.getSize().width;
                var trapHeight = trap.sprite.getSize().height;


                ///////////////////////////////////
                // Player and Trap Position      //
                ///////////////////////////////////

                var playerX = self.currentGame.layer.screenToLocal(self.currentGame.ownPlayer.character.getPosition()).ceil().x;
                var playerY = self.currentGame.layer.screenToLocal(self.currentGame.ownPlayer.character.getPosition()).ceil().y;

                var trapX = self.currentGame.layer.screenToLocal(trap.sprite.getPosition()).ceil().x;
                var trapY = self.currentGame.layer.screenToLocal(trap.sprite.getPosition()).ceil().y;

                //Set left top corner of box
                //Attention => TOP: Y=0 Middle: X=0
                playerX = playerX - (playerWidth) / 2;
                playerY = playerY - (playerHeight) / 2;

                trapX = trapX - (trapWidth) / 2;
                trapY = trapY - (trapHeight) / 2;


                ///////////////////////////////////
                // Trap PreSelection             //
                ///////////////////////////////////

                // Dont calculate Traps which are not in the Player Region
                if (trapX < 0 || trapX > 400) {break;}


                ///////////////////////////////////
                // Player and Trap BoundingBoxes //
                ///////////////////////////////////

                var playerBoundingBoxes = obacht.options.player.boundingBoxes;
                var trapBoundingBoxes = obacht.themes[obacht.mp.roomDetail.theme].traps[trap.type].boundingBoxes;


                ///////////////////////////////////
                // Collision Calculation         //
                ///////////////////////////////////

                for (var y = 0; y < trapBoundingBoxes.length; y++) {

                    playerX = playerX + playerBoundingBoxes[0].x;
                    playerY = playerY + playerBoundingBoxes[0].y;

                    if (obacht.playerController.isCrouching === false) {
                        playerWidth = playerBoundingBoxes[0].width;
                        playerHeight = playerBoundingBoxes[0].height;
                    } else if (obacht.playerController.isCrouching === true) {
                        playerWidth = playerBoundingBoxes[0].width * obacht.options.player.general.crouchWidth;
                        playerHeight = playerBoundingBoxes[0].height * obacht.options.player.general.crouchHeight;
                    }

                    trapX = trapX + trapBoundingBoxes[y].x;
                    trapY = trapY + trapBoundingBoxes[y].y;

                    trapWidth = trapBoundingBoxes[y].width;
                    trapHeight = trapBoundingBoxes[y].height;

                    if (playerX < trapX + trapWidth &&
                        trapX < playerX + playerWidth &&
                        playerY < trapY + trapHeight &&
                        trapY < playerY + playerHeight === true) {

                        self.removeTrap(trap);
                        return true;
                    }
                }
            }
        }

        // No Collision -> Return false
        return false;
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

