/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Generator');

goog.require('obacht.Trap');
goog.require('obacht.Kollision');

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

        var Kollision = new obacht.Kollision(Trap.character, ownPlayer.character);

        if (Kollision === true) {
            console.log('Boom');
            winkel = startwinkel;
        } else if (Trap.character.getPosition().x < 0) {
            console.log('Getrappt!!!');
            winkel = startwinkel;
        }

        winkel = winkel + winkelgeschwindigkeit;

    }, Trap);

};

obacht.Generator.prototype = {

};
