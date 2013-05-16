/* global goog, lime, obacht */
/* devel:true */

goog.provide('obacht.Menu');

// Lime.js Requirements
goog.require('lime.Layer');
goog.require('lime.fill.Frame');

// Obacht Requirements
goog.require('obacht.PlayerController');
goog.require('obacht.Game');
goog.require('obacht.Button');
goog.require('obacht.options');

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
    
    lime.Label.defaultFont = 'Cartwheel';
    lime.Label.installFont('Cartwheel', 'assets/fonts/Cartwheel.otf');
    
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

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/menu/backgrounds/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        var logo = new lime.Sprite().setSize(650, 149).setFill('assets/menu/logo/logo.png').setPosition(640, 100).setAnchorPoint(0.5, 0);
        layerMenu.appendChild(logo);

        //Play-Button
        var playButton = new lime.RoundedRect().setFill('#7ca534').setRadius(25).setPosition(640, 350).setSize(300, 130).setStroke(7,'#fff');
            playButton.label = new lime.Label().setAlign('center').setText('PLAY').setFontColor('#fff').setFontSize(90).setSize(200, 90);
            playButton.appendChild(playButton.label);
        layerMenu.appendChild(playButton);
        goog.events.listen(playButton, lime.Button.Event.CLICK, function() {
            that.newGameScene();
        });

        //Help-Button
        var mask = new lime.Sprite().setPosition(324, 530).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask);
        var icon = new lime.Sprite().setPosition(245, 530).setAnchorPoint(0.5,0.5).setSize(966,170).setFill('assets/menu/buttons/icons.png');
        layerMenu.appendChild(icon);
        icon.setMask(mask);
        var labelHelp = new lime.Label().setText(('HELP')).setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(324, 650).setFontColor('#fff');
        layerMenu.appendChild(labelHelp);

        //Credits-Button
        var mask = new lime.Sprite().setPosition(537, 530).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask);
        var icon = new lime.Sprite().setPosition(932, 530).setAnchorPoint(0.5,0.5).setSize(966,170).setFill('assets/menu/buttons/icons.png');
        layerMenu.appendChild(icon);
        icon.setMask(mask);
        var labelCredits = new lime.Label().setText(('CREDITS').toUpperCase()).setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(537, 650).setFontColor('#fff');
        layerMenu.appendChild(labelCredits);
        
        //Sound-Button
        var mask = new lime.Sprite().setPosition(747, 530).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask);
        var icon = new lime.Sprite().setPosition(353, 530).setAnchorPoint(0.5,0.5).setSize(966,170).setFill('assets/menu/buttons/icons.png');
        layerMenu.appendChild(icon);
        icon.setMask(mask);
        var labelSound = new lime.Label().setText(('SOUND').toUpperCase()).setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(747, 650).setFontColor('#fff');
        layerMenu.appendChild(labelSound);

        //Quit-Button
        var mask = new lime.Sprite().setPosition(960, 530).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask);
        var icon = new lime.Sprite().setPosition(723, 530).setAnchorPoint(0.5,0.5).setSize(966,170).setFill('assets/menu/buttons/icons.png');
        layerMenu.appendChild(icon);
        icon.setMask(mask);
        var labelQuit = new lime.Label().setText(('QUIT').toUpperCase()).setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(960, 650).setFontColor('#fff');
        layerMenu.appendChild(labelQuit);
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

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/menu/backgrounds/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        var logo = new lime.Sprite().setSize(650, 149).setFill('assets/menu/logo/logo.png').setPosition(640, 100).setAnchorPoint(0.5, 0);
        layerMenu.appendChild(logo);
        
        //Create-Button
        var btn_createGame = new lime.RoundedRect().setFill('#7ca534').setRadius(25).setPosition(430, 510).setSize(320, 100).setStroke(7,'#fff');
            btn_createGame.label = new lime.Label().setAlign('center').setText('CREATE').setFontColor('#fff').setFontSize(55).setSize(320, 55);
            btn_createGame.appendChild(btn_createGame.label);
        layerMenu.appendChild(btn_createGame);    
        goog.events.listen(btn_createGame, lime.Button.Event.CLICK, function() {
            that.getCodeScene(false);
        });

        //Join-Button
        var btn_joinGame = new lime.RoundedRect().setFill('#7ca534').setRadius(25).setPosition(430, 625).setSize(320, 100).setStroke(7,'#fff');
            btn_joinGame.label = new lime.Label().setAlign('center').setText('JOIN').setFontColor('#fff').setFontSize(55).setSize(320, 55);
            btn_joinGame.appendChild(btn_joinGame.label);
        layerMenu.appendChild(btn_joinGame); 
        goog.events.listen(btn_joinGame, lime.Button.Event.CLICK, function() {
            that.loadGame(false);
        });

        //PlayOnline-Button
        var btn_play = new lime.RoundedRect().setFill('#7ca534').setRadius(25).setPosition(830, 510).setSize(320, 100).setStroke(7,'#fff');
            btn_play.label = new lime.Label().setAlign('center').setText('PLAY').setFontColor('#fff').setFontSize(55).setSize(320, 55);
            btn_play.appendChild(btn_play.label);
        layerMenu.appendChild(btn_play); 
        goog.events.listen(btn_play, lime.Button.Event.CLICK, function() {
            that.loadGame(false);
        });

        //Play_with_your_friend-Text
        var text_friendsGame = new lime.Label().setAlign('center').setText('PLAY WITH YOUR FRIEND').setFontColor('#fff').setFontSize(40).setSize(430, 55).setPosition(430, 350);
        layerMenu.appendChild(text_friendsGame);

        //Random_Game-Text
        var text_randomGame = new lime.Label().setAlign('center').setText('RANDOM GAME').setFontColor('#fff').setFontSize(40).setSize(700, 55).setPosition(830, 390);
        layerMenu.appendChild(text_randomGame);

    },

    getCodeScene: function() {
        "use strict";
        var that = this;

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/menu/backgrounds/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        var logo = new lime.Sprite().setSize(650, 149).setFill('assets/menu/logo/logo.png').setPosition(640, 100).setAnchorPoint(0.5, 0);
        layerMenu.appendChild(logo);

        //Your_Code-Text and Code_Field
        //var getCodeButton = new lime.Sprite().setFill('assets/bildpfad.png).setPosition(640, 350).setSize(435, 110);
        var getCodeButton= new lime.Label().setAlign('center').setText('YOUR CODE').setFontColor('#fff').setFontSize(50).setSize(300, 90).setPosition(640, 320);
        layerMenu.appendChild(getCodeButton);

        //Pop-up-Infotext
        var getCodeInfotext = new lime.Label().setAlign('center').setText('PLEASE GIVE THIS CODE TO YOUR FRIEND').setFontColor('#fff').setFontSize(40).setSize(300, 55).setPosition(1050, 300);
        layerMenu.appendChild(getCodeInfotext);


        //Next-Button
        var nextButton = new lime.Label().setAlign('center').setText('NEXT').setFontColor('#fff').setFontSize(40).setSize(700, 55).setPosition(640, 600);
        layerMenu.appendChild(nextButton);
        goog.events.listen(nextButton, lime.Button.Event.CLICK, function() {
            that.selectThemeScene(false);
        });

    },


        selectThemeScene: function() {
            "use strict";
            var that = this;

            var sceneMenu = new lime.Scene();

            // set current scene active
            obacht.director.replaceScene(sceneMenu);

            var layerMenu = new lime.Layer();
            sceneMenu.appendChild(layerMenu);

            var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/menu/backgrounds/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
            layerMenu.appendChild(background);

            var logo = new lime.Sprite().setSize(650, 149).setFill('assets/menu/logo/logo.png').setPosition(640, 100).setAnchorPoint(0.5, 0);
            layerMenu.appendChild(logo);

            //Select_World-Text
            var selectWorld = new lime.Label().setAlign('center').setText('SELECT A WORLD').setFontColor('#fff').setFontSize(50).setSize(400, 55).setPosition(640, 320);
            layerMenu.appendChild(selectWorld);

            //Next-Button
            var nextButton = new lime.Label().setAlign('center').setText('NEXT').setFontColor('#fff').setFontSize(40).setSize(700, 55).setPosition(640, 600);
            layerMenu.appendChild(nextButton);
            goog.events.listen(nextButton, lime.Button.Event.CLICK, function() {
                that.join(false);
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
        var startFrom = 115;
        var spacing = 105;
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
            var key = new lime.RoundedRect().setFill('#ff5a00').setRadius(25).setPosition(x, 530).setSize(95, 95).setStroke(7,'#fff');
            key.label = new lime.Label().setAlign('center').setText(text).setFontColor('#fff').setFontSize(70).setSize(95, 70);
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

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        // Background
        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/menu/backgrounds/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        var logo = new lime.Sprite().setSize(650, 149).setFill('assets/menu/logo/logo.png').setPosition(640, 100).setAnchorPoint(0.5, 0);
        layerMenu.appendChild(logo);

        var labelEnterCode = new lime.Label().setText('ENTER CODE').setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(640, 300).setFontColor('#fff');
        layerMenu.appendChild(labelEnterCode);
                
        // Current Code Field
        var field = new lime.RoundedRect().setFill('#7ca534').setRadius(25).setPosition(640, 390).setSize(400, 130).setStroke(7,'#fff');
        field.label = new lime.Label().setAlign('center').setText(getStyledPin()).setFontColor('#eef').setFontSize(100).setSize(400, 100).setFontWeight('bold');
        field.appendChild(field.label);
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

        //var submitButton = drawKeyboardButton(startFrom + spacing * 11, '#');
        //layerMenu.appendChild(submitButton);

        //Next-Button
        var nextButton = new lime.Label().setAlign('center').setText('NEXT').setFontColor('#fff').setFontSize(40).setSize(700, 55).setPosition(640, 600);
        layerMenu.appendChild(nextButton);
        goog.events.listen(nextButton, lime.Button.Event.CLICK, function() {
            that.loadGame(false);
        });


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

