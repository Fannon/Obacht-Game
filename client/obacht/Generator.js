/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Generator');

goog.require('obacht.Trap');
goog.require('obacht.Collision');

/**
 * Trap and Bonus Generator
 *
 * @constructor
 */
obacht.Generator = function(layer, ownPlayer) {
    Trap = new obacht.Trap('test');
    layer.appendChild(Trap.layer);

    //Startwinkel & Winkelgeschwindigkeit
    var startwinkel = 45;
    var winkel = startwinkel;
    var winkelgeschwindigkeit = 0.05;
    //Startposition
    var groundx = 200;
    var groundy = 1490;
    var faktor = 950;
    faktor = 1070;

    lime.scheduleManager.schedule(function(dt) {
        var position = Trap.character.getPosition();
        position.x = Math.sin(winkel) * faktor + groundx;
        position.y = Math.cos(winkel) * faktor + groundy;
        Trap.character.setPosition(position);

        var Collision = new obacht.Collision(Trap.character, ownPlayer.character);

        if (Collision.rect() === true) {
            console.log('Kollsion mit User');
            winkel = startwinkel;
        } else if (Trap.character.getPosition().x < 0) {
            console.log('Gegen die Wand');
            winkel = startwinkel;
        }

        winkel = winkel + winkelgeschwindigkeit;

    }, Trap);

};

obacht.Generator.prototype = {

};
