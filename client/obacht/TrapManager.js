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

    ///////////////////////////////////
    // Variables                     //
    ///////////////////////////////////

    var self = this;
    this.currentGame = currentGame;

    /** Trap Array for top World */
    this.topTraps = [];

    /** Trap Array for bottom World */
    this.bottomTraps = [];


    ///////////////////////////////////
    // Collision Interval            //
    ///////////////////////////////////

    /**
     * Collision Checking
     */
    lime.scheduleManager.scheduleWithDelay(function() {
        var collision = self.checkColl(self.currentGame.layer, player, self.bottomTraps);
        if (collision) {
            log.debug('Player Collision with Trap!');
            currentGame.ownPlayer.loseHealth();
        }
    }, player, obacht.options.collisions.checkInterval);


    ///////////////////////////////////
    // Event Listeners               //
    ///////////////////////////////////

    /**
     * Enemy Trap Event Listener
     * @event
     */
    obacht.mp.events.subscribe('top_trap', function(data) {
        var trap = self.createTrap(data.type, 'top');
        trap.i = self.topTraps.length;
        self.topTraps[trap.i] = trap;
    });

    /**
     * Bottom Traps Event Listener
     * @event
     */
    obacht.mp.events.subscribe('bottom_trap', function(data) {
        var trap = self.createTrap(data.type, 'bottom');
        trap.i = self.bottomTraps.length;
        self.bottomTraps[trap.i] = trap;
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

        var trap = new obacht.Trap(self.currentGame, type, location);
        trap.location = location;
        trap.type = type;

        /** Delete the Trap after a specific Timeout */
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
        this.currentGame.layer.removeChild(trap.circle);

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


                var playerPosition = obacht.director.localToNode(self.currentGame.ownPlayer.character.getPosition(), self.currentGame.layer);
                var trapPosition = trap.circle.localToNode(trap.sprite.getPosition(), self.currentGame.layer);

                // Set left top corner of box
                // Attention => TOP: Y=0 Middle: X=0
                var playerX = playerPosition.ceil().x - (playerWidth) / 2;
                var playerY = playerPosition.ceil().y - (playerHeight) / 2;

                var trapX = trapPosition.ceil().x - (trapWidth) / 2;
                var trapY = trapPosition.ceil().y - (trapHeight) / 2;

//                console.log('TrapX: ' + trapX + ' TrapY: ' +  trapY + ' || PlayerX: ' + playerX + ' PlayerY: ' +  playerY);

                ///////////////////////////////////
                // Trap PreSelection             //
                ///////////////////////////////////

                // Dont calculate Traps which are not in the Player Region
                if (trapX < 20 || trapX > 420) {
                    break;
                }


                ///////////////////////////////////
                // Player and Trap BoundingBoxes //
                ///////////////////////////////////

                var playerBoundingBoxes = obacht.options.player.boundingBoxes;
                var trapBoundingBoxes = trap.boundingBoxes;


                ///////////////////////////////////
                // Collision Detection           //
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

        this.topTraps = [];
        this.bottomTraps = [];

        obacht.mp.events.clear('top_trap');
        obacht.mp.events.clear('bottom_trap');

    }
};

