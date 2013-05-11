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
goog.require('obacht.PlayerController');
goog.require('obacht.Button');
goog.require('obacht.Menu');

// entrypoint
obacht.start = function() {

    obacht.director = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    obacht.director.makeMobileWebAppCapable();

    //Start with Menu
    obacht.Menu();

};

// this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
