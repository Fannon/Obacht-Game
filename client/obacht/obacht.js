/* global goog, lime, obacht */

// Obacht Main Namespace
goog.provide('obacht');

// Lime.js Requirements
goog.require('lime.Director');
goog.require('lime.Renderer.DOM');
goog.require('lime.Renderer.CANVAS');

//Spritesheets Requirements
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.globalSpritesheet.json');
goog.require('lime.SpriteSheet');

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

    log = new obacht.Logger(obacht.options.debug.logLevel);
    obacht.checkDevices();

    /** Global Spritesheet */
    obacht.spritesheet = new lime.SpriteSheet('assets/gfx/globalSpritesheet.png', lime.ASSETS.globalSpritesheet.json, lime.parser.JSON);

    /** Menu Instance */
    obacht.menu = new obacht.Menu();


    //////////////////////////////
    // Model                    //
    //////////////////////////////

    /** Multiplayer Service Instance */
    obacht.mp = new obacht.MultiplayerService(obacht.options.server.url, obacht.options.server.connectionTimeout);

    /** LimeJs Director Instance */
    obacht.director = new lime.Director(document.body, obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);
    obacht.director.makeMobileWebAppCapable();
    obacht.director.setDisplayFPS(obacht.options.debug.displayFps);

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

            obacht.gameScene = new lime.Scene();

            /////////////////////////////
            // Start new Game          //
            /////////////////////////////

            if (obacht.currentGame) {
                obacht.cleanUp();
            }

            /** playerController Instance */
            obacht.playerController = new obacht.PlayerController();

            /** current Game Instance */
            obacht.currentGame = new obacht.Game();

            obacht.gameScene.appendChild(obacht.currentGame.layer);
            obacht.gameScene.appendChild(obacht.playerController.layer);
            obacht.gameScene.appendChild(obacht.currentGame.countdownLayer);

            obacht.director.replaceScene(obacht.gameScene);
        }
    });

    /**
     * Subscribe Game Over Event
     * @event
     */
    obacht.mp.events.subscribe('game_over', function(data) {
        if (obacht.currentGame) {
            obacht.menu.gameoverScene(data);
            obacht.cleanUp();
        }
    });

    obacht.menu.mainMenuScene();


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
    obacht.mp.events.clear('receive_bonus');

    // Reset Friend, if player has one
    obacht.mp.friend = false;

    // Leave Room if still connected to one
    if (obacht.mp.roomDetail.pin) {
        obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);
    }

    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
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
 * @param {Object} sceneName Object of the last Scene
 * @param {String} msg Text of the message
 */
obacht.showPopup = function(sceneName, msg) {
    "use strict";

    var self = this;

    if (sceneName) {
        this.sceneName = sceneName;
    } else {
        this.sceneName = 'mainMenuScene';
    }

    var popupScene = new lime.Scene();
    var popupLayer = new lime.Layer();
    popupScene.appendChild(popupLayer);

    var popupBackground = new lime.Sprite()
        .setFill('assets/gfx/bg_clean.jpg')
        .setPosition(obacht.options.graphics.VIEWPORT_WIDTH / 2, obacht.options.graphics.VIEWPORT_HEIGHT / 2)
        .setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);

    var popupSprite = new lime.Sprite()
        .setFill(obacht.spritesheet.getFrame('error.png'))
        .setPosition(640, 371)
        .setSize(904, 698);

    var popupLabel = new lime.Label()
        .setAlign('left')
        .setText(msg)
        .setFontColor('#fff')
        .setFontSize(72)
        .setSize(430, 210)
        .setPosition(525, 335)
        .setRotation(17);

    var popupButton = new lime.Sprite()
        .setFill(obacht.spritesheet.getFrame('button_okay.png'))
        .setPosition(534, 540)
        .setSize(174, 160);

    log.debug('Incoming error from server:' + msg);

    popupLayer.appendChild(popupBackground);
    popupLayer.appendChild(popupSprite);
    popupLayer.appendChild(popupLabel);
    popupLayer.appendChild(popupButton);

    obacht.director.replaceScene(popupScene);

    /** Hide Pop-up @event */
    goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
        obacht.menu[self.sceneName]();
    });
};

/**
 * Checks for different Devices and Capabilities
 * Adjusts Options and introduces some Fixes according to current Device
 */
obacht.checkDevices = function() {
    "use strict";
    // TODO: Check for Devices
};

/**
 * Is called when an Event Listener throws an Error
 *
 * @param {Object} e Error Object
 */
obacht.eventError = function(e) {
    "use strict";
    log.warn('Event Error: ' + e.message );
};
