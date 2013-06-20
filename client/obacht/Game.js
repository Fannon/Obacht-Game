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
goog.require('lime.ASSETS.globalSpritesheet.json');


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

    if (obacht.options.debug.avgFramerate) {

        obacht.frameRateArray = [];
        lime.scheduleManager.schedule(function(){
            obacht.frameRateArray.push(obacht.director.fps);
        });
        obacht.interval(function() {
            var sum = 0;
            for(var i = 0; i < obacht.frameRateArray.length; i++) {
                sum += parseInt(obacht.frameRateArray[i], 10);
            }
            var avg = sum/obacht.frameRateArray.length;
            log.info('DEBUG > AVERAGE FRAMERATE: ' + avg);

            obacht.frameRateArray = [];

        }, 3000);
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

    // Draw initial Life Status
    this.initHealthStatus();

    // Draw Quit Game Button
    this.quitGame();

    /// 2 ///
    obacht.timeout(function() {
        self.setCountdownStatus('two');
    }, obacht.options.gameplay.countdownInterval);

    /// 1 ///
    obacht.timeout(function() {
        self.setCountdownStatus('one');
    }, obacht.options.gameplay.countdownInterval * 2);

    /// Obacht! ///
    obacht.timeout(function() {

        /** Time the game started, used for calculation current Distance */
        self.timer = new Date();

        // Start spinning the worlds
        self.ownWorld.spin();
        self.enemyWorld.spin();

        self.setCountdownStatus('obacht_start');

        // Just start the generator if player is the creating Player
        if (obacht.mp.pid === obacht.mp.roomDetail.creatingPlayerId) {
            self.generator = new obacht.Generator();
            self.generator.startThrowTrap();
            self.generator.startThrowBonus();
        }

        // Remove Background
        self.countdownLayer.removeChild(countDownLayerBackground);

        obacht.timeout(function() {
            // Remove CountDown Layer from Game Sene
            obacht.gameScene.removeChild(self.countdownLayer);

        }, obacht.options.gameplay.countdownInterval);

    }, obacht.options.gameplay.countdownInterval * 3);


    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    obacht.mp.events.subscribe('bonus', function(type) {
        self.bonusButton = new obacht.Bonus(self, type);
    });

    obacht.mp.events.subscribe('room_detail', function() {
        self.updateHealthStatus();
    });

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
        var diff = (currentDate.getTime() - this.timer.getTime()) / 1000;
        return Math.round(diff * 90 / obacht.options.world.spinDuration.front);
    },

    /**
     * Gets Time in ms when the distance will be reached
     *
     * @param {Number} distance Distance to calculate time from
     * @returns {number} Time in ms when distance will be reached (or 0 if negative/past)
     */
    getDistanceTimer: function(distance) {
        "use strict";

        var currentDistance = this.getDistance();

        var diff = distance - currentDistance;

        if (diff < 0) {
            log.warn('negative distanceDiff: ' + diff);
            diff = 0;
        }

        return(obacht.options.world.spinDuration.front / 90) * 1000 * diff;
    },

    /**
     * Sets the Countdown Status (3,2,1,Obacht)
     */
    setCountdownStatus: function(status) {
        "use strict";

        if (this.countdownStatus) {
            this.countdownLayer.removeChild(this.countdownStatus);
        }

        /** Current Countdown Status */
        this.countdownStatus = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame(status + '.png'))
            .setPosition(640, 360)
            .setSize(obacht.spritesheet.getFrame(status + '.png').csize_.width * 2, obacht.spritesheet.getFrame(status + '.png').csize_.height * 2);

        this.countdownLayer.appendChild(this.countdownStatus);

        /**Check Sound Status*/
        obacht.menusound.stop();
        obacht.gamesound.stop();

        obacht.gamesound.play();

        lime.scheduleManager.scheduleWithDelay(function(){
        if(obacht.gamesound.isPlaying!=true && obacht.sound===true){
        obacht.gamesound.play();
        }
        },obacht.gamesound,400);
    },

    /**
     * Initializes / draws Health Status Display
     */
    initHealthStatus: function() {
        "use strict";

        this.ownLifestatus = new lime.Sprite()
            .setPosition(110, 672)
            .setSize(160, 56);

        this.colon = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('colon.png'))
            .setPosition(200, 680)
            .setSize(12, 30);

        this.enemyLifestatus = new lime.Sprite()
            .setPosition(290, 672)
            .setSize(160, 56);

        this.ownLifestatus.setFill(obacht.spritesheet.getFrame('ownLifestatus_3.png'));
        this.enemyLifestatus.setFill(obacht.spritesheet.getFrame('enemyLifestatus_3.png'));

        this.layer.appendChild(this.ownLifestatus);
        this.layer.appendChild(this.colon);
        this.layer.appendChild(this.enemyLifestatus);

    },

    /**
     * Draw Quit Game Button
     */
    quitGame: function() {
        "use strict";

        this.quitGame = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('quitGame.png'))
            .setPosition(1250, 690)
            .setSize(52, 50);

        this.layer.appendChild(this.quitGame);
        goog.events.listen(this.quitGame, ['touchstart', 'mousedown'], function() {
            obacht.mp.leaveRoom();
            obacht.cleanUp();
            obacht.menu.mainMenuScene();
        });

        /*unschedule Sound check*/
        /*obacht.gamesound.stop();
        lime.scheduleManager.unschedule(function(dt){
        },obacht.gamesound,400);*/
    },

    /**
     * Updates current Healthstatus for both Players
     */
    updateHealthStatus: function() {
        "use strict";

        if (obacht.mp.roomDetail.creatingPlayerHealth === 0 || obacht.mp.roomDetail.joiningPlayerHealth === 0) {
            return false;
        }

        if (obacht.mp.pid === obacht.mp.roomDetail.creatingPlayerId) {
            this.ownPlayer.health = obacht.mp.roomDetail.creatingPlayerHealth;
            this.ownLifestatus.setFill(obacht.spritesheet.getFrame('ownLifestatus_' + obacht.mp.roomDetail.creatingPlayerHealth + '.png'));
            this.enemyLifestatus.setFill(obacht.spritesheet.getFrame('enemyLifestatus_' + obacht.mp.roomDetail.joiningPlayerHealth + '.png'));
        } else {
            this.ownPlayer.health = obacht.mp.roomDetail.joiningPlayerHealth;
            this.ownLifestatus.setFill(obacht.spritesheet.getFrame('ownLifestatus_' + obacht.mp.roomDetail.joiningPlayerHealth + '.png'));
            this.enemyLifestatus.setFill(obacht.spritesheet.getFrame('enemyLifestatus_' + obacht.mp.roomDetail.creatingPlayerHealth + '.png'));
        }

        return true;
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

        // Clear Event Listeners
        obacht.mp.events.clear('bonus');

        // Remove Layers
        this.layer.removeChild(this.enemyWorld.layer);
        this.layer.removeChild(this.ownWorld.layer);
        this.layer.removeChild(this.enemyPlayer.layer);
        this.layer.removeChild(this.ownPlayer.layer);
    }
};
