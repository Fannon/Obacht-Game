/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Menu');

goog.require('obacht.Join');

/**
 * Game Menu
 *
 * Has different Scenes and Flows
 *
 * @constructor
 */
   

//load Menu
obacht.Menu = function() {
    var sceneMenu = new lime.Scene();
    
    // set current scene active
    obacht.director.replaceScene(sceneMenu);

    var layerMenu = new lime.Layer();
    sceneMenu.appendChild(layerMenu);
    
    //Play-Button
    var btn_play = new obacht.Button('PLAY NOW').setPosition(640, 360).setSize(300, 100);
    layerMenu.appendChild(btn_play);
    goog.events.listen(btn_play, lime.Button.Event.CLICK, function() {
      obacht.loadMenuScene2();
    });
};  

obacht.loadMenuScene2 = function() {
    var sceneMenu = new lime.Scene();
    
    // set current scene active
    obacht.director.replaceScene(sceneMenu);

    var layerMenu = new lime.Layer();
    sceneMenu.appendChild(layerMenu);
    
    //PlayOnline-Button
    var btn_playOnline = new obacht.Button('PLAY ONLINE').setPosition(450, 360).setSize(300, 100);
    layerMenu.appendChild(btn_playOnline);
    goog.events.listen(btn_playOnline, lime.Button.Event.CLICK, function() {
      obacht.loadGame();
    });
    
    //Create-Button
    var btn_createGame = new obacht.Button('CREATE GAME').setPosition(830, 290).setSize(300, 100);
    layerMenu.appendChild(btn_createGame);
    goog.events.listen(btn_createGame, lime.Button.Event.CLICK, function() {
      obacht.loadGame();
    });
    
    //Join-Button
    var btn_joinGame = new obacht.Button('JOIN GAME').setPosition(830, 430).setSize(300, 100);
    layerMenu.appendChild(btn_joinGame);
    goog.events.listen(btn_joinGame, lime.Button.Event.CLICK, function() {
      obacht.Join();
    });
}; 

   
//load Game
obacht.loadGame = function() {

	// Connect to Multiplayer Server
    //obacht.mp = new obacht.MultiplayerService(obacht.options.server.url);
    var sceneGame = new lime.Scene();
    
    // set current scene active
    obacht.director.replaceScene(sceneGame);
    
	obacht.playerController = new obacht.PlayerController();
	
    obacht.currentGame = new obacht.Game();
    sceneGame.appendChild(obacht.currentGame.layer);

};  
  
// this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
