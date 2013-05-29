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


/**
 * Its a Game scene
 *
 * @constructor
 * @extends lime.Scene
 */
obacht.Game = function() {
   
    console.log('New Game();');

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
    this.roomDetail = {};

    this.ownWorld = new obacht.World('own', this.theme);
    this.enemyWorld = new obacht.World('enemy', this.theme);
    this.sky = new lime.Sprite().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT).setFill(this.theme.world.files.sky).setPosition(0, 0).setAnchorPoint(0, 0);

    this.ownPlayer = new obacht.Player('own', this.theme);
    this.enemyPlayer = new obacht.Player('enemy', this.theme);
    
    this.bonusButton = new obacht.Bonus('snake');



    //////////////////////////////
    // Game Events              //
    //////////////////////////////

    // Update RoomDetails if Server sends new one
    obacht.mp.events.subscribe('room_detail', function(data) {
        self.roomDetail = data;
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
    this.layer.appendChild(this.bonusButton.layer);

    this.layer.appendChild(obacht.playerController.layer);

    this.generator = new obacht.Generator(this.layer, this.ownPlayer);

    this.layer.appendChild(obacht.playerController.layer);

};

obacht.Game.prototype = {
         
};
