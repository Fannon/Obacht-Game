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
    this.speedFactor = obacht.options.gameplay.initialSpeedFactor;

    obacht.setBackground(obacht.mp.roomDetail.theme);

    this.ownWorld = new obacht.World(this.layer, 'bottom', this.theme);
    this.enemyWorld = new obacht.World(this.layer, 'top', this.theme);


    this.ownPlayer = new obacht.Player(this.layer, 'bottom', this.theme);
    this.enemyPlayer = new obacht.Player(this.layer, 'top', this.theme);


    this.ownTrapManager = new obacht.TrapManager('own', this.ownWorld, this.ownPlayer, this.layer);
//    this.enemyTrapManager = new obacht.TrapManager('enemy', this.enemyWorld, this.enemyPlayer);


    console.log('PERFORMANCE: GAME - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);

    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    obacht.mp.events.subscribe('bonus', function(type) {

        self.bonusButton = new obacht.Bonus(self.layer, type);
        self.layer.appendChild(self.bonusButton.bonusButton);

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

        this.ownTrapManager.destruct();

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
