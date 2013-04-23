/* global goog, obacht */

/**
 * OBACHT is a multiplayer game createt by obacht. For more informations check www.obacht-game.de
 * 
 * start a new game
 */

// set main namespace
goog.provide('obacht');

// get requirements
goog.require('obacht.MultiplayerService');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('obacht.Game');


/**
 * Starts the Game
 *
 * Controller
 */
obacht.start = function(){
    "use strict";
	console.log('start');
	//this.currentGame = new obacht.Game();

	// Controller, sonst nichts
	
	var viewportWidth = 1280;
	var viewportHeight = 720;
	
	var obachtDirector = new lime.Director(document.body, viewportWidth, viewportHeight);
	var scene = new lime.Scene(),
	   	layer = new lime.Layer();
	    	
	/*hier muss dann das Menu eingeschoben werden dass dann das Spiel neue Spiel aufruft
	this.menu = new obacht.Menu(); */
	
	this.currentGame = new obacht.Game();

	//nur zu Testzwecken, wird dann ins Menu ausgelagert, sonst muss man immer durchs Menü navigieren wenn man zum Spiel will	
	layer.appendChild(this.currentGame);
	scene.appendChild(layer);

	obachtDirector.makeMobileWebAppCapable();
	// set current scene active
	obachtDirector.replaceScene(scene);
		
	this.multiplayerService = new obacht.MultiplayerService('http://localhost:8080');

    this.multiplayerService.joinRoom(1234);
	    	

};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);


