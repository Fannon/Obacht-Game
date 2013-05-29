/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

goog.require('goog.pubsub.PubSub');

goog.require('lime.RoundedRect');
goog.require('lime.Node');
goog.require('obacht.options');

goog.require('lime.Sprite');


//Array for different random Times
var randomTime = [];
    randomTime[0] = 3000;
    randomTime[1] = 3500;
    randomTime[2] = 4000;
    randomTime[3] = 4500;
    randomTime[4] = 5000;

//random Value between 0 and 5 for the Array Position
var randomTimeCalculation;


/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(theme, type) {

    console.log('New Trap();');

    this.timeout();

    var startposx = obacht.options.trap.own.x;
    var startposy = obacht.options.trap.own.y;
    var anchorx = obacht.options.trap.own.anchorx;
    var anchory = obacht.options.trap.own.anchory;

    console.log(theme + ' .. ' + type);

    var file = obacht.themes[theme].traps[type].file;
    var width = obacht.themes[theme].traps[type].width;
    var height = obacht.themes[theme].traps[type].height;
    var boundingBoxes = obacht.themes[theme].traps[type].boundingBoxes;

    this.character = new lime.Sprite().setSize(width, height).setPosition(startposx, startposy).setAnchorPoint(anchorx, anchory).setFill(file);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.layer.appendChild(this.character);
};

obacht.Trap.prototype = {

    //throw trap
    startThrowTrap: function(){
       "use strict";
       console.log('throwTrap');
       obacht.Trap.prototype.timeout();
    },

    //waiting for a trap
    startRandomTime: function(){
        "use strict";
        console.log('start random Time');
        randomTimeCalculation = Math.floor(Math.random()*randomTime.length);
        setTimeout(obacht.Trap.prototype.startThrowTrap, randomTime[randomTimeCalculation]);
    },

    //timeout - no trap can be thrown
    timeout: function(){
        "use strict";
        console.log('start timeout');
        setTimeout(obacht.Trap.prototype.startRandomTime, 2000);
    }

};
