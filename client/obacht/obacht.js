/* global goog, obacht */
/* jshint strict: false */

//set main namespace
goog.provide('obacht');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');

// obacht requirements
goog.require('obacht.MultiplayerService');
goog.require('obacht.Game');
goog.require('obacht.options');


// entrypoint
obacht.start = function(){

    console.dir(obacht.options);

    var obachtDirector = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    var scene = new lime.Scene();
    var currentGame = new obacht.Game();

    scene.appendChild(currentGame.layer);

    obachtDirector.makeMobileWebAppCapable();
    // set current scene active
    obachtDirector.replaceScene(scene);

    // Connect to Multiplayer Server
    this.multiplayerService = new obacht.MultiplayerService(obacht.options.server.url);

};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
