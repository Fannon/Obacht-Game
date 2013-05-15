/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

// Obacht Main Namespace
goog.provide('obacht');

// Lime.js Requirements
goog.require('lime.Director');
goog.require('lime.Renderer.DOM');
goog.require('lime.Renderer.CANVAS');

// Obacht Requirements
goog.require('obacht.options');
goog.require('obacht.MultiplayerService');
goog.require('obacht.Menu');


// entrypoint
obacht.start = function() {

    obacht.mp = new obacht.MultiplayerService(obacht.options.server.url);

    obacht.director = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    obacht.director.makeMobileWebAppCapable();

    if (obacht.options.graphics.DEFAULT_RENDERER === 'DOM') {
        obacht.renderer = lime.Renderer.DOM;
    } else {
        obacht.renderer = lime.Renderer.CANVAS;
    }

    //Start with Menu
    obacht.menu = new obacht.Menu();

};

// this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
