/* global goog, obacht */
/* jshint strict: false */

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

// obacht requirements
goog.require('obacht.MultiplayerService');
goog.require('obacht.Game');
goog.require('obacht.options');


// entrypoint
obacht.start = function(){

    "use strict";
    console.log('Obacht start()');

    console.log('Current Options:');
    console.dir(obacht.options);


    var viewportWidth = obacht.options.graphics.viewportWidth;
    var viewportHeight = obacht.options.graphics.viewportHeight;

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

    // Connect to Multiplayer Server
    this.multiplayerService = new obacht.MultiplayerService(obacht.options.server.url);

};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
