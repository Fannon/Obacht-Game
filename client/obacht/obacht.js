/**
 * OBACHT is a multiplayer game createt by obacht. For more informations check www.obacht-game.de
 * 
 * start a new game
 */

// set main namespace
goog.provide('obacht');

// get requirements
goog.require('obacht.Game');


// entrypoint
obacht.start = function(){

    this.currentGame = new obacht.Game();

	// Controller, sonst nichts

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
