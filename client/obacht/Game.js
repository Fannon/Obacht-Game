/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

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


//Spritesheet Requirements
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.waterSpritesheet.json');
goog.require('lime.ASSETS.desertSpritesheet.json');
goog.require('lime.ASSETS.meadowSpritesheet.json');
goog.require('lime.SpriteSheet');

/**
 * Its a Game scene
 *
 * @constructor
 * @extends lime.Scene
 */
obacht.Game = function() {


    //////////////////////////////
    // Game Model (state)       //
    //////////////////////////////

    var self = this;

    this.layer = new lime.Layer();

    this.theme = obacht.themes[obacht.mp.roomDetail.theme];

    // Load Spritesheet according to current Theme
    var spritesheetUrl = this.theme.spritesheet;

    if (obacht.mp.roomDetail.theme === 'desert') {
        this.spritesheet = new lime.SpriteSheet(spritesheetUrl, lime.ASSETS.desertSpritesheet.json, lime.parser.JSON);
    } else if (obacht.mp.roomDetail.theme === 'meadow') {
        this.spritesheet = new lime.SpriteSheet(spritesheetUrl, lime.ASSETS.meadowSpritesheet.json, lime.parser.JSON);
    } else if (obacht.mp.roomDetail.theme === 'water') {
        this.spritesheet = new lime.SpriteSheet(spritesheetUrl, lime.ASSETS.waterSpritesheet.json, lime.parser.JSON);
    } else {
        console.warn('Error loading Theme Spritesheet');
    }

    this.speedFactor = obacht.options.gameplay.initialSpeedFactor;

    obacht.setBackground(obacht.mp.roomDetail.theme);

    this.ownWorld = new obacht.World(this, 'bottom');
    this.enemyWorld = new obacht.World(this, 'top');


    this.ownPlayer = new obacht.Player(this, 'bottom');
    this.enemyPlayer = new obacht.Player(this, 'top');


    this.trapManager = new obacht.TrapManager(this, this.ownWorld, this.ownPlayer);


    console.log('PERFORMANCE: GAME - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);

    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    obacht.mp.events.subscribe('bonus', function(type) {

        self.bonusButton = new obacht.Bonus(self, type);

        console.log('PERFORMANCE: GAME - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);
    });


    // Decrement SpeedFactor (lower is faster)
    obacht.intervals.speedFactorInterval = setInterval(function() {
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

        // Call Destructors of created Instances
        this.ownWorld.destruct();
        this.enemyWorld.destruct();

        this.ownPlayer.destruct();
        this.enemyPlayer.destruct();

        this.trapManager.destruct();

        if (this.generator) {
            this.generator.destruct();
        }

        obacht.mp.events.clear('bonus');

        this.layer.removeChild(this.enemyWorld.layer);
        this.layer.removeChild(this.ownWorld.layer);
        this.layer.removeChild(this.enemyPlayer.layer);
        this.layer.removeChild(this.ownPlayer.layer);
    }
};
