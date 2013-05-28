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
obacht.Trap = function(type) {

    console.log('New Trap();');

    this.timeout();

    //Enemies
    //WATER
    if (this.type === 'crab') {
        this.file = obacht.themes.water.traps.crab.file;
        this.width = obacht.themes.water.traps.crab.width;
        this.height = obacht.themes.water.traps.crab.height;
        this.boundingBoxes = obacht.themes.water.traps.crab.boundingBoxes;
    }

    if (this.type === 'anchor') {
        this.file = obacht.themes.water.traps.anchor.file;
        this.width = obacht.themes.water.traps.anchor.width;
        this.height = obacht.themes.water.traps.anchor.height;
        this.boundingBoxes = obacht.themes.water.traps.anchor.boundingBoxes;
    }

    if (this.type === 'jellyfish') {
        this.file = obacht.themes.water.traps.jellyfish.file;
        this.width = obacht.themes.water.traps.jellyfish.width;
        this.height = obacht.themes.water.traps.jellyfish.height;
        this.boundingBoxes = obacht.themes.water.traps.jellyfish.boundingBoxes;
    }

    if (this.type === 'seaurchin') {
        this.file = obacht.themes.water.traps.seaurchin.file;
        this.width = obacht.themes.water.traps.seaurchin.width;
        this.height = obacht.themes.water.traps.seaurchin.height;
        this.boundingBoxes = obacht.themes.water.traps.seaurchin.boundingBoxes;
    }

    if (this.type === 'shark') {
        this.file = obacht.themes.water.traps.shark.file;
        this.width = obacht.themes.water.traps.shark.width;
        this.height = obacht.themes.water.traps.shark.height;
        this.boundingBoxes = obacht.themes.water.traps.shark.boundingBoxes;
    }

    if (this.type === 'seaurchin') {
        this.file = obacht.themes.water.traps.seaurchin.file;
        this.width = obacht.themes.water.traps.seaurchin.width;
        this.height = obacht.themes.water.traps.seaurchin.height;
        this.boundingBoxes = obacht.themes.water.traps.seaurchin.boundingBoxes;
    }

    if (this.type === 'turtle') {
        this.file = obacht.themes.water.traps.turtle.file;
        this.width = obacht.themes.water.traps.turtle.width;
        this.height = obacht.themes.water.traps.turtle.height;
        this.boundingBoxes = obacht.themes.water.traps.turtle.boundingBoxes;
    }

    if (this.type === 'clownfish') {
        this.file = obacht.themes.water.traps.clownfish.file;
        this.width = obacht.themes.water.traps.clownfish.width;
        this.height = obacht.themes.water.traps.clownfish.height;
        this.boundingBoxes = obacht.themes.water.traps.clownfish.boundingBoxes;
    }

    //Enemies
    //Desert
    if (this.type === 'scorpion') {
        this.file = obacht.themes.desert.traps.scorpion.file;
        this.width = obacht.themes.desert.traps.scorpion.width;
        this.height = obacht.themes.desert.traps.scorpion.height;
        this.boundingBoxes = obacht.themes.desert.traps.scorpion.boundingBoxes;
    }

    if (this.type === 'skull') {
        this.file = obacht.themes.desert.traps.skull.file;
        this.width = obacht.themes.desert.traps.skull.width;
        this.height = obacht.themes.desert.traps.skull.height;
        this.boundingBoxes = obacht.themes.desert.traps.skull.boundingBoxes;
    }

    if (this.type === 'vulture') {
        this.file = obacht.themes.desert.traps.vulture.file;
        this.width = obacht.themes.desert.traps.vulture.width;
        this.height = obacht.themes.desert.traps.vulture.height;
        this.boundingBoxes = obacht.themes.desert.traps.vulture.boundingBoxes;
    }

    if (this.type === 'cactus') {
        this.file = obacht.themes.desert.traps.cactus.file;
        this.width = obacht.themes.desert.traps.cactus.width;
        this.height = obacht.themes.desert.traps.cactus.height;
        this.boundingBoxes = obacht.themes.desert.traps.cactus.boundingBoxes;
    }

    if (this.type === 'snake') {
        this.file = obacht.themes.desert.traps.snake.file;
        this.width = obacht.themes.desert.traps.snake.width;
        this.height = obacht.themes.desert.traps.snake.height;
        this.boundingBoxes = obacht.themes.desert.traps.snake.boundingBoxes;
    }

    if (this.type === 'hawk') {
        this.file = obacht.themes.desert.traps.hawk.file;
        this.width = obacht.themes.desert.traps.hawk.width;
        this.height = obacht.themes.desert.traps.hawk.height;
        this.boundingBoxes = obacht.themes.desert.traps.hawk.boundingBoxes;
    }

    //Enemies
    //GARTEN

    if (this.type === 'butterfly') {
        this.file = obacht.themes.meadow.traps.butterfly.file;
        this.width = obacht.themes.meadow.traps.butterfly.width;
        this.height = obacht.themes.meadow.traps.butterfly.height;
        this.boundingBoxes = obacht.themes.meadow.traps.butterfly.boundingBoxes;
    }

    if (this.type === 'bee') {
        this.file = obacht.themes.meadow.traps.bee.file;
        this.width = obacht.themes.meadow.traps.bee.width;
        this.height = obacht.themes.meadow.traps.bee.height;
        this.boundingBoxes = obacht.themes.meadow.traps.bee.boundingBoxes;
    }

    if (this.type === 'snail') {
        this.file = obacht.themes.meadow.traps.snail.file;
        this.width = obacht.themes.meadow.traps.snail.width;
        this.height = obacht.themes.meadow.traps.snail.height;
        this.boundingBoxes = obacht.themes.meadow.traps.snail.boundingBoxes;
    }

    if (this.type === 'treestump') {
        this.file = obacht.themes.meadow.traps.treestump.file;
        this.width = obacht.themes.meadow.traps.treestump.width;
        this.height = obacht.themes.meadow.traps.treestump.height;
        this.boundingBoxes = obacht.themes.meadow.traps.treestump.boundingBoxes;
    }

    if (this.type === 'hedgehog') {
        this.file = obacht.themes.meadow.traps.hedgehog.file;
        this.width = obacht.themes.meadow.traps.hedgehog.width;
        this.height = obacht.themes.meadow.traps.hedgehog.height;
        this.boundingBoxes = obacht.themes.meadow.traps.hedgehog.boundingBoxes;
    }

    if (this.type === 'mushroom') {
        this.file = obacht.themes.meadow.traps.mushroom.file;
        this.width = obacht.themes.meadow.traps.mushroom.width;
        this.height = obacht.themes.meadow.traps.mushroom.height;
        this.boundingBoxes = obacht.themes.meadow.traps.mushroom.boundingBoxes;
    }

    if (this.type === 'scarecrow') {
        this.file = obacht.themes.meadow.traps.scarecrow.file;
        this.width = obacht.themes.meadow.traps.scarecrow.width;
        this.height = obacht.themes.meadow.traps.scarecrow.height;
        this.boundingBoxes = obacht.themes.meadow.traps.scarecrow.boundingBoxes;
    }

    this.startposx = obacht.options.trap.own.x;
    this.startposy = obacht.options.trap.own.y;
    this.anchorx = obacht.options.trap.own.anchorx;
    this.anchory = obacht.options.trap.own.anchory;

    this.character = new lime.Sprite().setSize(this.width, this.height).setPosition(this.startposx, this.startposy).setAnchorPoint(this.anchorx, this.anchory).setFill(this.file);
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
