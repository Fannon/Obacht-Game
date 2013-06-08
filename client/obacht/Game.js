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

    /** Current Distance the world has rotated since the game started. (in Grad) */
    this.distance = 0;

    /** Current Speed Factor which decrements (gets faster!) over time. */
    this.speedFactor = obacht.options.gameplay.initialSpeedFactor;

    /** Game Spritesheet (changes with current theme) */
    this.spritesheet = false;

    /** Game Layer */
    this.layer = new lime.Layer();

    /** Countdown Layer */
    this.countdownLayer = new lime.Layer();

    /** Theme Object which contains just the current Theme */
    this.theme = obacht.themes[obacht.mp.roomDetail.theme];

    /** Timer which will be set when Game is starting (Worlds rotating) */
    this.timer = false;

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


    //////////////////////////////
    // Draw & construct Game    //
    //////////////////////////////

    obacht.setBackground(obacht.mp.roomDetail.theme);

    // Draw Countdown Layer
    var countDownLayerBackground = new lime.Sprite()
        .setFill('assets/gfx/bg_clean.jpg')
        .setPosition(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2)
        .setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.countdownLayer.appendChild(countDownLayerBackground);
    self.setCountdownStatus('three');

    // Construct Worlds
    this.ownWorld = new obacht.World(this, 'bottom');
    this.enemyWorld = new obacht.World(this, 'top');

    // Construct Players
    this.ownPlayer = new obacht.Player(this, 'bottom');
    this.enemyPlayer = new obacht.Player(this, 'top');

    // Construct Player Inventory
    this.inventory = new obacht.Inventory(this);

    // Construct TrapManger
    this.trapManager = new obacht.TrapManager(this, this.ownWorld, this.ownPlayer);


    /// 2 ///
    setTimeout(function() {
        self.setCountdownStatus('two');
    }, obacht.options.gameplay.countdownInterval);

    /// 1 ///
    setTimeout(function() {
        self.setCountdownStatus('one');

        /** Time the game started, used for calculation current Distance */
        self.timer = new Date();

        // Start spinning the worlds
        self.ownWorld.spin();
        self.enemyWorld.spin();

    }, obacht.options.gameplay.countdownInterval * 2);

    /// Obacht! ///
    setTimeout(function() {

        self.setCountdownStatus('obacht_start');

        // Just start the generator if player is the creating Player
        if (obacht.mp.pid === obacht.mp.roomDetail.creatingPlayerId) {
            self.generator = new obacht.Generator(self.speedFactor);
            self.generator.startThrowTrap();
            self.generator.startThrowBonus();
        }

        // Remove Background
        self.countdownLayer.removeChild(countDownLayerBackground);

        setTimeout(function() {
            // Remove CountDown Layer from Game Sene
            obacht.gameScene.removeChild(obacht.currentGame.countdownLayer);
        }, obacht.options.gameplay.countdownInterval);

    }, obacht.options.gameplay.countdownInterval * 3);


    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    obacht.mp.events.subscribe('bonus', function(type) {
        self.bonusButton = new obacht.Bonus(self, type);
        log.debug('PERFORMANCE: GAME - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);
    });


    //////////////////////////////
    // Game Logic               //
    //////////////////////////////

    // Decrement SpeedFactor (lower is faster)
    self.speedFactorInterval = setInterval(function() {
        self.speedFactor -= obacht.options.gameplay.decrementSpeedFactor;
    }, obacht.options.gameplay.decrementSpeedFactorTime);

};

obacht.Game.prototype = {

    /**
     * Calculates current World traveled Distance
     *
     * @returns {number} Distance in Grad
     */
    getDistance: function() {
        "use strict";

        if (!this.timer) {
            return 0;
        }
        var currentDate = new Date();
        var diff = (currentDate.getTime() - this.timer.getTime()) / 1000 ;
        return Math.round(diff * 90 / obacht.options.world.spinDuration.front);
    },

    /**
     * Display
     */
    setCountdownStatus: function(status) {
        "use strict";

        if (this.countdownStatus) {
            this.countdownLayer.removeChild(this.countdownStatus);
        }

        /** Current Countdown Status */
        this.countdownStatus = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame(status + '.png'))
            .setPosition(640, 330);
//            .setSize(544, 114);

        this.countdownLayer.appendChild(this.countdownStatus);
    },

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
