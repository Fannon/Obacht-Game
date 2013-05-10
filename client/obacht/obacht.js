/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

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
obacht.start = function() {

    // Connect to Multiplayer Server
    this.mp = new obacht.MultiplayerService(obacht.options.server.url);
    this.currentGame = new obacht.Game();

    this.obachtDirector = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    this.scene = new lime.Scene();

    scene.appendChild(this.currentGame.layer);

    console.dir(obacht.options);

    obachtDirector.makeMobileWebAppCapable();
    // set current scene active
    obachtDirector.replaceScene(scene);


};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
