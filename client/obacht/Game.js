/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Game');

// Closure Library Requirements
goog.require('goog.pubsub.PubSub');

// Obacht Requirements
goog.require('obacht.World');
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


    //Game Time
    var time = 0;
    setInterval(function(){clock();},1000);
    function clock(){
       time+=1;
    }


    //////////////////////////////
    // Game Model (state)       //
    //////////////////////////////

    var self = this;

    this.theme = obacht.themes[obacht.mp.roomDetail.theme];

    this.ownWorld = new obacht.World('own', this.theme);
    this.enemyWorld = new obacht.World('enemy', this.theme);
    this.sky = new lime.Sprite().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT).setFill(this.theme.world.files.sky).setPosition(0, 0).setAnchorPoint(0, 0);

    this.ownPlayer = new obacht.Player('bottom', this.theme);
    this.enemyPlayer = new obacht.Player('top', this.theme);

    this.speedFactor = obacht.options.gameplay.initialSpeedFactor;

    // Decrement SpeedFactor (lower is faster)
    setInterval(function() {
        self.speedFactor -= obacht.options.gameplay.decrementSpeedFactor;
    }, obacht.options.gameplay.decrementSpeedFactorTime);

    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    obacht.mp.events.subscribe('bonus', function(type) {
        self.bonusButton = new obacht.Bonus(type);
        self.layer.appendChild(self.bonusButton.layer);
    });

    obacht.mp.events.subscribe('trap', function(data) {
        self.trapFigure = new obacht.Trap(data.type);
        self.ownWorld.ground1.appendChild(self.trapFigure.layer);
    });

    //////////////////////////////
    // Game View                //
    //////////////////////////////

    this.layer = new lime.Layer();
    this.layer.appendChild(this.sky);
    this.layer.appendChild(this.enemyWorld.layer);
    this.layer.appendChild(this.ownWorld.layer);
    this.layer.appendChild(this.enemyPlayer.layer);
    this.layer.appendChild(this.ownPlayer.layer);


    // Just start the generator if player is the creating Player
    if (obacht.mp.pid === obacht.mp.roomDetail.creatingPlayerId) {
        this.generator = new obacht.Generator(this.speedFactor);
        this.generator.startThrowTrap();
        this.generator.startThrowBonus();
    }

};

obacht.Game.prototype = {

};
