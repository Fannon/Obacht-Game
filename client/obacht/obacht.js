/**
 * OBACHT is a multiplayer game createt by obacht. For more informations check www.obacht-game.de
 * 
 * start a new game
 */

//set main namespace
goog.provide('obacht');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');


// entrypoint
obacht.start = function(){

	// Controller, sonst nichts

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
