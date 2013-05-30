/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

goog.require('goog.pubsub.PubSub');

goog.require('lime.RoundedRect');
goog.require('lime.Node');
goog.require('obacht.options');

goog.require('lime.Sprite');

/**
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(type) {

    ////////////////
    // ATTRIBUTES //
    ////////////////
    var self = this;
    this.type = type;

    this.fill = 'assets/themes/' + obacht.mp.roomDetail.theme + '/traps/' + this.type + '.png';
    console.log('New Trap: ' + this.fill);

    ////////////////////
    // LIMEJS OBJECTS //
    ////////////////////
    this.trap = new lime.Sprite().setSize(obacht.options.trap.general.width, obacht.options.trap.general.height).setPosition(obacht.options.trap.general.x, obacht.options.trap.general.y).setFill('#d5622f').setAnchorPoint(0, 0);
    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    self.drawBonus();
};

obacht.Trap.prototype = {
    /**
     * Draw the bonus-button
     */
    drawBonus: function() {
        "use strict";
        this.layer.appendChild(this.trap);
    },

    move: function() {
      //    layer.appendChild(trap.layer);

        //Startwinkel & Winkelgeschwindigkeit
        var startwinkel = 45;
        var winkel = startwinkel;
        //Startposition
        var groundx = 100;
        var groundy = 1490;
        var faktor = 950;
        var winkelgeschwindigkeit=0.01;

/*        lime.scheduleManager.schedule(function(dt) {
            this.trap.setPosition(200,200);
            /*var position = this.trap.getPosition();
            position.x = Math.sin(winkel) * faktor + groundx;
            position.y = Math.cos(winkel) * faktor + groundy;
        }, this.trap);
*/
        trap=this.trap;

        var velocity = 0.01;
        lime.scheduleManager.schedule(function(dt){

//            var position = trap.getPosition();
//            position.x += velocity * dt; // if dt is bigger we just move more
//            trap.setPosition(position);

            var position = trap.getPosition();
            position.x = Math.sin(winkel) * faktor + groundx;
            position.y = Math.cos(winkel) * faktor + groundy;
            trap.setPosition(position);
            console.log(position);

            this.winkel=this.winkel+winkelgeschwindigkeit;
        },trap);

        /*
        var Collision = new obacht.Collision();

        if (Collision.rect(ownPlayer, trap) === true) {
            //console.log('Kollsion mit User');
            winkel = startwinkel;
        } else if (trap.character.getPosition().x < 0) {
            console.log('Gegen die Wand');
            winkel = startwinkel;
        }

        winkel = winkel + winkelgeschwindigkeit;
         */
    }
};
