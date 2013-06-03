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
 * Store for setInterval handler
 * @type {Object}
 */
obacht.intervals = {};


// entrypoint
obacht.start = function() {

    console.log('PERFORMANCE: PRE-MENU - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);

    /** Multiplayer Service */
    obacht.mp = new obacht.MultiplayerService(obacht.options.server.url);

    obacht.director = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    obacht.director.makeMobileWebAppCapable();
    obacht.director.setDisplayFPS(obacht.options.displayFps);

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

    console.log('Cleaning up...!');

    // Clean up Game if one still running
    if (obacht.currentGame) {
        obacht.currentGame.destruct();
        delete obacht.currentGame;
    }

    if (obacht.playerController) {
        obacht.playerController.destruct();
        delete obacht.playerController;
    }

    // Remove CSS Gradients from Theme and show Menu Background again
    obacht.setBackground(false);

    // Clear running Intervals
    clearInterval(obacht.intervals.speedFactorInterval);
    clearInterval(obacht.intervals.cleanUpTraps);

    // Clear Event Subscriptions
    obacht.mp.events.clear('room_detail');
    obacht.mp.events.clear('bonus');
    obacht.mp.events.clear('trap');
    obacht.mp.events.clear('receive_bonus');
    obacht.mp.events.clear('game_over');

    // Reset Friend, if player has one
    obacht.mp.friend = false;

    // Leave Room if still connected to one
    if (obacht.mp.roomDetail.pin) {
        obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);
    }

};

/**
 * Sets the LimeJS Directory Background via HTML Classes (see obacht.css)
 * @param {*} theme Themename or false to reset
 */
obacht.setBackground = function(theme) {
    console.log('Set Background to .' + theme);
    var limeDirectorElement = document.getElementsByClassName('lime-director')[0];
    if (theme) {
        limeDirectorElement.setAttribute("class", 'lime-director ' + theme);
    } else {
        limeDirectorElement.setAttribute("class", 'lime-director');
    }
};
