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
goog.require('obacht.themes');
goog.require('obacht.MultiplayerService');
goog.require('obacht.Menu');

/**
 * Persistent Store for temporary values
 * @type {Object}
 */
obacht.intervals = {};


// entrypoint
obacht.start = function() {

    /** Multiplayer Service */
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

/**
 * Does all neccesary cleanup after a game is over
 * Resets all currently running Intervals (use obacht.intervals Object for this!)
 * Clears specific event listeners
 */
obacht.cleanUp = function() {
    "use strict";

    clearInterval(obacht.intervals.trapInterval);
    clearInterval(obacht.intervals.bonusInterval);

    obacht.mp.events.clear('room_detail');
    obacht.mp.events.clear('bonus');
    obacht.mp.events.clear('trap');
    obacht.mp.events.clear('receive_bonus');
    obacht.mp.events.clear('game_over');
};

// this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);
