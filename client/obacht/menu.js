/* global goog, lime, obacht */
/* devel:true */

goog.provide('obacht.Menu');

// Lime.js Requirements
goog.require('lime.Layer');

// Obacht Requirements
goog.require('obacht.PlayerController');
goog.require('obacht.Game');
goog.require('obacht.Button');

/**
 * Game Menu
 *
 * Inits the Menu and handles the different MenuScenes
 * Uses the MultiplayerService to join/create Rooms
 *
 * TODO: Use Config
 *
 * @singleton
 */
obacht.Menu = function() {
    "use strict";

    // Start first Menu Scene
    this.mainMenuScene();

};

obacht.Menu.prototype = {

    /**
     * Main Menu Scene
     */
    mainMenuScene: function() {
        "use strict";
        var that = this;

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        //Play-Button
        var btn_play = new obacht.Button('PLAY NOW').setPosition(640, 360).setSize(300, 100);
        layerMenu.appendChild(btn_play);
        goog.events.listen(btn_play, lime.Button.Event.CLICK, function() {
            that.newGameScene();
        });
    },

    /**
     * New Game Scene
     * Join Random Game or Create/Join a custom one
     */
    newGameScene: function() {
        "use strict";
        var that = this;

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        //PlayOnline-Button
        var btn_playOnline = new obacht.Button('PLAY ONLINE').setPosition(450, 360).setSize(300, 100);
        layerMenu.appendChild(btn_playOnline);
        goog.events.listen(btn_playOnline, lime.Button.Event.CLICK, function() {
            that.loadGame(false);
        });

        //Create-Button
        var btn_createGame = new obacht.Button('CREATE GAME').setPosition(830, 290).setSize(300, 100);
        layerMenu.appendChild(btn_createGame);
        goog.events.listen(btn_createGame, lime.Button.Event.CLICK, function() {
            that.loadGame(false);
        });

        //Join-Button
        var btn_joinGame = new obacht.Button('JOIN GAME').setPosition(830, 430).setSize(300, 100);
        layerMenu.appendChild(btn_joinGame);
        goog.events.listen(btn_joinGame, lime.Button.Event.CLICK, function() {
            that.join();
        });
    },

    /**
     * Game Loading Scene
     * Starts the Game and everything that needs to be ready for that.
     */
    loadGame: function(pin) {
        "use strict";

        if (!pin) {
            pin = '1234'; // TODO: PIN from Server
        }

        // Connect to Multiplayer Server
        //obacht.mp = new obacht.MultiplayerService(obacht.options.server.url);
        var sceneGame = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneGame);


        /////////////////////////////
        // Start new Game          //
        /////////////////////////////

        obacht.playerController = new obacht.PlayerController();

        obacht.currentGame = new obacht.Game();
        obacht.currentGame.pin = pin;
        sceneGame.appendChild(obacht.currentGame.layer);

    },

    /**
     * Join Custom Game Scene
     */
    join: function() {
        "use strict";
        var that = this;


        /////////////////////////////
        // Variables               //
        /////////////////////////////

        /** Array for PIN */
        var codeArray = ['_', '_', '_', '_'];
        var codeposition = 0;

        // KeyboardButton Placement
        var startFrom = 150;
        var spacing = 90;
        var keys = [];


        /////////////////////////////
        // Helper Functions        //
        /////////////////////////////

        /**
         * Returns PIN
         *
         * @returns {*}
         */
        var getPin = function() {
            return codeArray[0] + codeArray[1] + codeArray[2] + codeArray[3];
        };

        /**
         * Returns PIN with adequate spacing
         * @returns {string}
         */
        var getStyledPin = function() {
            return codeArray[0] + ' ' + codeArray[1] + ' ' + codeArray[2] + ' ' + codeArray[3];
        };

        /**
         * Draws Button for Keyboard Input
         *
         * @param {Number} x
         * @param {string} text
         *
         * @returns {*}
         */
        var drawKeyboardButton = function(x, text) {
            var key = new lime.RoundedRect().setFill('#888').setRadius(15).setPosition(x, 550).setSize(70, 70);
            key.label = new lime.Label().setAlign('center').setText(text).setFontColor('#fff').setFontSize(40).setSize(70, 45).setFontWeight('bold');
            key.appendChild(key.label);
            return key;
        };

        /**
         * Add Number to PIN
         *
         * @param {Number} insertNumber
         */
        var addNumber = function(insertNumber) {
            codeArray[codeposition] = insertNumber;
            if (codeposition < 4) {
                codeposition++;
            }
            field.label.setText(getStyledPin());
        };

        /**
         * Backspace PIN (Deletes last entered PIN)
         */
        var deleteNumber = function() {
            codeArray[codeposition - 1] = '_';
            if (codeposition > 0) {
                codeposition--;
            }
            field.label.setText(getStyledPin());
        };

        var startGame = function() {
            if (codeposition === 4) {
                that.loadGame(getPin());
            }
        };


        /////////////////////////////
        // Scene Content           //
        /////////////////////////////

        // Current Code Field
        var field = new lime.RoundedRect().setFill('#888').setRadius(15).setPosition(640, 360).setSize(300, 130);
        field.label = new lime.Label().setAlign('center').setText(getStyledPin()).setFontColor('#eef').setFontSize(80).setSize(300, 80).setFontWeight('bold');

        field.appendChild(field.label);
        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        layerMenu.appendChild(field);


        /////////////////////////////
        // Create Buttons          //
        /////////////////////////////

        for (var i = 0; i < 10; i++) {
            keys[i] = drawKeyboardButton(startFrom + spacing * i, i + '');
            layerMenu.appendChild(keys[i]);
        }

        var keyDelete = drawKeyboardButton(startFrom + spacing * 10, '<');
        layerMenu.appendChild(keyDelete);

        var submitButton = drawKeyboardButton(startFrom + spacing * 11, '#');
        layerMenu.appendChild(submitButton);


        /////////////////////////////
        // Register EventListeners //
        /////////////////////////////

        goog.events.listen(keys[0], lime.Button.Event.CLICK, function() {
            addNumber(0);
        });
        goog.events.listen(keys[1], lime.Button.Event.CLICK, function() {
            addNumber(1);
        });
        goog.events.listen(keys[2], lime.Button.Event.CLICK, function() {
            addNumber(2);
        });
        goog.events.listen(keys[3], lime.Button.Event.CLICK, function() {
            addNumber(3);
        });
        goog.events.listen(keys[4], lime.Button.Event.CLICK, function() {
            addNumber(4);
        });
        goog.events.listen(keys[5], lime.Button.Event.CLICK, function() {
            addNumber(5);
        });
        goog.events.listen(keys[6], lime.Button.Event.CLICK, function() {
            addNumber(6);
        });
        goog.events.listen(keys[7], lime.Button.Event.CLICK, function() {
            addNumber(7);
        });
        goog.events.listen(keys[8], lime.Button.Event.CLICK, function() {
            addNumber(8);
        });
        goog.events.listen(keys[9], lime.Button.Event.CLICK, function() {
            addNumber(9);
        });
        goog.events.listen(keyDelete, lime.Button.Event.CLICK, function() {
            deleteNumber();
        });
        goog.events.listen(submitButton, lime.Button.Event.CLICK, function() {
            startGame();
        });

    }
};

