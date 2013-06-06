/* global goog, lime, obacht, log */

goog.provide('obacht.Game');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

// Obacht Requirements
goog.require('obacht.World');
goog.require('obacht.TrapManager');
goog.require('obacht.Player');
goog.require('obacht.Generator');
goog.require('obacht.Bonus');
goog.require('obacht.Trap');
goog.require('obacht.Inventory');

//Spritesheet Requirements
goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.waterSpritesheet.json');
goog.require('lime.ASSETS.desertSpritesheet.json');
goog.require('lime.ASSETS.meadowSpritesheet.json');

/**
 * Its a Game scene
 *
 * @constructor
 * @extends lime.Scene
 */
obacht.Game = function() {
    "use strict";


    //////////////////////////////
    // Game Model (state)       //
    //////////////////////////////

    var self = this;

    this.layer = new lime.Layer();
    /** Game Spritesheet (changes with current theme) */
    this.spritesheet = false;

    this.theme = obacht.themes[obacht.mp.roomDetail.theme];

    // Load Spritesheet according to current Theme
    if (obacht.mp.roomDetail.theme === 'desert') {
        this.spritesheet = new lime.SpriteSheet(this.theme.spritesheet, lime.ASSETS.desertSpritesheet.json, lime.parser.JSON);
    } else if (obacht.mp.roomDetail.theme === 'meadow') {
        this.spritesheet = new lime.SpriteSheet(this.theme.spritesheet, lime.ASSETS.meadowSpritesheet.json, lime.parser.JSON);
    } else if (obacht.mp.roomDetail.theme === 'water') {
        this.spritesheet = new lime.SpriteSheet(this.theme.spritesheet, lime.ASSETS.waterSpritesheet.json, lime.parser.JSON);
    } else {
        log.warn('Error loading Theme Spritesheet');
    }

    this.speedFactor = obacht.options.gameplay.initialSpeedFactor;

    obacht.setBackground(obacht.mp.roomDetail.theme);

    self.ownWorld = new obacht.World(this, 'bottom');
    self.enemyWorld = new obacht.World(this, 'top');

    this.ownPlayer = new obacht.Player(this, 'bottom');
    this.enemyPlayer = new obacht.Player(this, 'top');

    this.inventory = new obacht.Inventory(this);

    this.trapManager = new obacht.TrapManager(this, this.ownWorld, this.ownPlayer);


    log.debug('PERFORMANCE: GAME - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);

    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    obacht.mp.events.subscribe('bonus', function(type) {

        self.bonusButton = new obacht.Bonus(self, type);

        log.debug('PERFORMANCE: GAME - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);
    });


    // Decrement SpeedFactor (lower is faster)
    self.speedFactorInterval = setInterval(function() {
        self.speedFactor -= obacht.options.gameplay.decrementSpeedFactor;
    }, obacht.options.gameplay.decrementSpeedFactorTime);

    //////////////////////////////
    // Game View                //
    //////////////////////////////

    // Just start the generator if player is the creating Player
    if (obacht.mp.pid === obacht.mp.roomDetail.creatingPlayerId) {
        this.generator = new obacht.Generator(this.speedFactor);
        this.generator.startThrowTrap();
        this.generator.startThrowBonus();
    }

};

obacht.Game.prototype = {

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {
        "use strict";

        // Call Destructors of created Instances
        this.ownWorld.destruct();
        this.enemyWorld.destruct();

        this.ownPlayer.destruct();
        this.enemyPlayer.destruct();

        this.inventory.destruct();

        this.trapManager.destruct();

        if (this.generator) {
            this.generator.destruct();
        }

        // Clean Intervals
        clearInterval(this.speedFactorInterval);

        // Clear Event Listeners
        obacht.mp.events.clear('bonus');

        // Remove Layers
        this.layer.removeChild(this.enemyWorld.layer);
        this.layer.removeChild(this.ownWorld.layer);
        this.layer.removeChild(this.enemyPlayer.layer);
        this.layer.removeChild(this.ownPlayer.layer);
    }
};
