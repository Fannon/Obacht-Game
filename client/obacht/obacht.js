/* global goog, lime, obacht */

// Obacht Main Namespace
goog.provide('obacht');

// Lime.js Requirements
goog.require('lime.Director');
goog.require('lime.Renderer.DOM');
goog.require('lime.Renderer.CANVAS');

// Obacht Requirements
goog.require('obacht.options');
goog.require('obacht.themes');
goog.require('obacht.Logger');
goog.require('obacht.MultiplayerService');
goog.require('obacht.PlayerController');
goog.require('obacht.Menu');
goog.require('obacht.Game');

/** global log variable for Logging with the custom Logger */
var log;


/**
 * Obacht Game EntryPoint
 */
obacht.start = function() {
    "use strict";

    log = new obacht.Logger(obacht.options.logLevel);
    obacht.checkDevices();


    //////////////////////////////
    // Model                    //
    //////////////////////////////

    /** Multiplayer Service Instance */
    obacht.mp = new obacht.MultiplayerService(obacht.options.server.url);

    /** LimeJs Director Instance */
    obacht.director = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    obacht.director.makeMobileWebAppCapable();
    obacht.director.setDisplayFPS(obacht.options.displayFps);

    if (obacht.options.graphics.DEFAULT_RENDERER === 'DOM') {
        obacht.renderer = lime.Renderer.DOM;
    } else {
        obacht.renderer = lime.Renderer.CANVAS;
    }

    //////////////////////////////
    // Events                   //
    //////////////////////////////

    /**
     * Subscribe Game Ready Event -> Start Game
     * @event
     */
    obacht.mp.events.subscribe('game_ready', function() {

        if (obacht.menu) {

            var gameScene = new lime.Scene();


            /////////////////////////////
            // Start new Game          //
            /////////////////////////////

            if (obacht.currentGame) {
                obacht.cleanUp();
            }
//            if (obacht.menu) {
//                delete obacht.menu;
//            }

            // Create a new playerController Instance
            obacht.playerController = new obacht.PlayerController();
            // Create a new Game Instance
            obacht.currentGame = new obacht.Game();

            gameScene.appendChild(obacht.currentGame.layer);
            gameScene.appendChild(obacht.playerController.layer);

            /**
             * Subscribe (once) Game Over Event
             * @event
             */
            obacht.mp.events.subscribeOnce('game_over', function(data) {

//                if (!obacht.menu) {
//                    obacht.menu = new obacht.Menu();
//                }
                obacht.menu.gameoverScene(data);
                obacht.cleanUp();
            });

            obacht.director.replaceScene(gameScene);
        }

    });

    /** Menu Instance */
    obacht.menu = new obacht.Menu();
    obacht.menu.loadingScene();

};

/**
 * Does all neccesary cleanup after a game is over
 * Resets all currently running Intervals (use obacht.intervals Object for this!)
 * Clears specific event listeners
 */
obacht.cleanUp = function() {
    "use strict";

    log.debug('Cleaning up...!');

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
    "use strict";
    var limeDirectorElement = document.getElementsByClassName('lime-director')[0];
    if (theme) {
        limeDirectorElement.setAttribute("class", 'lime-director ' + theme);
    } else {
        limeDirectorElement.setAttribute("class", 'lime-director');
    }
};

/**
 * Draws a PopUp / Alert Box over the current Scene (Game or Menu)
 *
 * @param {String} text Text to draw
 */
obacht.popUpHelper = function(text) {
    "use strict";
    // TODO: Generate a PopUp (Alert Style) which can be used everywhere in the Menu/Game
};

/**
 * Checks for different Devices and Capabilities
 * Adjusts Options and introduces some Fixes according to current Device
 */
obacht.checkDevices = function() {
    "use strict";
    // TODO: Check for Devices
};
