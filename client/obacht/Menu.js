/* global goog, lime, obacht */
/* jshint devel:true */

goog.provide('obacht.Menu');

// Lime.js Requirements
goog.require('lime.Layer');
goog.require('lime.fill.Frame');
goog.require('lime.Button');

// Obacht Requirements
goog.require('obacht.PlayerController');
goog.require('obacht.Game');

/**
 * Game Menu
 *
 * Inits the Menu and handles the different MenuScenes
 * Uses the MultiplayerService to join/create Rooms
 * Creates a new Game as one of its Scenes
 *
 * TODO: Use Config
 *
 * @constructor
 */
obacht.Menu = function() {
    "use strict";

    //////////////////////////////
    // Variables                //
    //////////////////////////////

    var self = this;
    lime.Label.defaultFont = 'Cartwheel';
    lime.Label.installFont('Cartwheel', 'assets/fonts/Cartwheel.otf');


    //////////////////////////////
    // Events                   //
    //////////////////////////////

    /**
     * Subscribe Game Ready Event -> Start Game
     * @event
     */
    obacht.mp.events.subscribe('game_ready', function(){
        self.loadGameScene();

        /**
         * Subscribe Game Over Event
         * @event
         */
        obacht.mp.events.subscribeOnce('game_over', function(data){
            self.gameoverScene(data);
        });
    });

    // Start first Scene
    this.mainMenuScene();
//    this.gameoverScene({
//        reason: 'player_left'
//    });

};

/**
 * Menu Button
 *
 * @param pos_x
 * @param pos_y
 * @param size_x
 * @param size_y
 * @param posMask_x
 * @param posMask_y
 * @param sizeMask_w
 * @param sizeMask_h
 * @param layerMenu
 * @returns {*}
 * @constructor
 */
obacht.Menu.Button = function(pos_x, pos_y, size_x, size_y, posMask_x, posMask_y, sizeMask_w, sizeMask_h, layerMenu) {
    "use strict";
    var button = new lime.Sprite().setSize(size_x, size_y).setFill('assets/gfx/menu_spritesheet.png').setPosition(pos_x, pos_y).setAnchorPoint(0, 0);
    layerMenu.appendChild(button);
    var maskButton = new lime.Sprite().setPosition(posMask_x, posMask_y).setAnchorPoint(0.5,0.5).setSize(sizeMask_w, sizeMask_h);
    layerMenu.appendChild(maskButton);
    button.setMask(maskButton);
    return maskButton;
};

/**
 * Menu Label
 *
 * @param text
 * @param size
 * @param x
 * @param y
 * @param w
 * @param h
 * @param layerMenu
 * @returns {*}
 * @constructor
 */
obacht.Menu.Label = function(text, size, x, y, w, h, layerMenu){
    "use strict";
    var label = new lime.Label().setText(text).setFontColor('#fff').setFontSize(size).setPosition(x, y).setSize(w,h).setAlign('center');
    layerMenu.appendChild(label);
    return label;
};

obacht.Menu.prototype = {

    /**
     * Loading Scene
     */
    loadingScene: function() {
        "use strict";
        var self = this;

        var loadingScene = new lime.Scene();

        var layerMenu = new lime.Layer();
        loadingScene.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //BIG LOGO FOR LOADING-SCREEN
        var logo_big = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(190, -750).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_big);
        var mask_logo_big = new lime.Sprite().setPosition(640, 360).setAnchorPoint(0.5,0.5).setSize(1000, 200);
        layerMenu.appendChild(mask_logo_big);
        logo_big.setMask(mask_logo_big);
        goog.events.listen(logo_big, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        // Loading ... Label
        // TODO: Performanter lösen.. nur wie?
        var loadingText = 'Loading ';
        var loadingStatus = '.';
        var loadingLabel = new obacht.Menu.Label(loadingText + loadingStatus, 40, 740, 520, 400, 90, layerMenu).setAlign('left');

        setInterval(function(){
            layerMenu.removeChild(loadingLabel);
            loadingStatus += '.';

            loadingLabel = new obacht.Menu.Label(loadingText + loadingStatus, 40, 740, 520, 400, 90, layerMenu).setAlign('left');
            if (loadingStatus === '.....') {
                loadingStatus = '';
            }

        }, 950);

        // set current scene active
        obacht.director.replaceScene(loadingScene);

    },


    /**
     * Main Menu Scene
     */
    mainMenuScene: function() {
        "use strict";
        var self = this;

        // Reset Variables and Event Listeners
        obacht.mp.events.clear('room_detail');
        obacht.mp.friend = false;
        if (obacht.mp.roomDetail) {
            obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);
        }

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //Small Logo
        var logo_small = new obacht.Menu.Button(360, -570, 1704, 1208, 640, 130, 600, 150, layerMenu);

        //Play-Button
        var playButton = new obacht.Menu.Button(-760, 65, 1704, 1208, 640, 338, 400, 200, layerMenu);
        var playLabel = new obacht.Menu.Label('PLAY', 90, 640, 338, 400, 90, layerMenu);
        goog.events.listen(playButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
        });

        //Help-Button
        var helpButton = new obacht.Menu.Button(-458, 80, 1704, 1208, 315, 540, 170, 170, layerMenu);
        var helpLabel = new obacht.Menu.Label('HELP', 45, 309, 650, 170, 45, layerMenu);
        goog.events.listen(helpButton, ['touchstart', 'mousedown'], function() {
            self.helpScene();
        });

        //Credits-Button
        var creditsButton = new obacht.Menu.Button(-432, 80, 1704, 1208, 538, 540, 170, 170, layerMenu);
        var creditsLabel = new obacht.Menu.Label('CREDITS', 45, 525, 650, 170, 45, layerMenu);
        goog.events.listen(creditsButton, ['touchstart', 'mousedown'], function() {
            self.creditsScene();
        });

        //Sound-Button
        var soundButton = new obacht.Menu.Button(-500, -163, 1704, 1208, 753, 540, 170, 170, layerMenu);
        var soundLabel = new obacht.Menu.Label('SOUND', 45, 749, 650, 170, 45, layerMenu);
        goog.events.listen(soundButton, ['touchstart', 'mousedown'], function() {
            //change Icon
            //sound off
        });

        //Quit-Button
        var quitButton = new obacht.Menu.Button(-350, 80, 1704, 1208, 963, 540, 170, 170, layerMenu);
        var quitLabel = new obacht.Menu.Label('QUIT', 45, 963, 650, 170, 45, layerMenu);
        goog.events.listen(quitButton, ['touchstart', 'mousedown'], function() {
            //quit Game
        });

    },

    /**
     * New Game Scene
     * Join Random Game or Create/Join a custom one
     */
    newGameScene: function() {
        "use strict";
        var self = this;

        var sceneMenu = new lime.Scene();
        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        // Background
        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //Play with a friend Background
        var friendIcon = new obacht.Menu.Button(-680, 65, 1704, 1208, 410, 310, 220, 220, layerMenu);
        var friendLabel = new obacht.Menu.Label('PLAY WITH YOUR FRIEND', 35, 400, 350, 500, 55, layerMenu);

        // Random Game Background
        var randomIcon = new obacht.Menu.Button(-655, -180, 1704, 1208, 880, 310, 220, 220, layerMenu);
        var randomLabel = new obacht.Menu.Label('RANDOM GAME', 35, 885, 350, 500, 55, layerMenu);

        //Small Logo
        var smallLogoButton = new obacht.Menu.Button(360, -570, 1704, 1208, 640, 130, 600, 150, layerMenu);

        //Back Button
        var backButton = new obacht.Menu.Button(10, 10, 1704, 1208, 57, 57, 115, 115, layerMenu);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });


        ///////////////////////////////
        // Create Custom Game        //
        ///////////////////////////////

        var createButton = new obacht.Menu.Button(-910, 400, 1533, 1087, 400, 480, 450, 160, layerMenu);
        var createLabel = new obacht.Menu.Label('CREATE', 60, 400, 485, 400, 70, layerMenu);
        goog.events.listen(createButton, ['touchstart', 'mousedown'], function() {
            self.selectThemeScene();
        });


        ///////////////////////////////
        // Join Custom Game          //
        ///////////////////////////////

        var joinButton = new obacht.Menu.Button(-910, 515, 1533, 1087, 400, 600, 450, 160, layerMenu);
        var joinLabel = new obacht.Menu.Label('JOIN', 60, 400, 600, 400, 70, layerMenu);
        goog.events.listen(joinButton, ['touchstart', 'mousedown'], function() {
            self.joinGameScene();
        });


        ///////////////////////////////
        // New Random Game           //
        ///////////////////////////////

        var randomPlayButton = new obacht.Menu.Button(-440, 400, 1533, 1087, 870, 480, 450, 160, layerMenu);
        var randomPlayLabel = new obacht.Menu.Label('PLAY', 60, 870, 485, 400, 70, layerMenu);
        goog.events.listen(randomPlayButton, ['touchstart', 'mousedown'], function() {
            obacht.mp.findMatch();
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                obacht.mp.playerReady();
                self.waitForPlayerScene();
            });
        });

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

    },

    /**
     * Select Theme Scene
     */
    selectThemeScene: function() {
        "use strict";
        var self = this;

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //Small Logo
        var logo_small = new obacht.Menu.Button(360, -570, 1704, 1208, 640, 130, 600, 150, layerMenu);

        //Back - Door
        var backButton = new obacht.Menu.Button(-990, 10, 1704, 1208, 57, 57, 130, 130, layerMenu);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        //Select_World-Text
        var selectWorldLabel = new obacht.Menu.Label('SELECT A WORLD', 50, 640, 320, 400, 90, layerMenu);

        //Theme-Desert
        var desert = new obacht.Menu.Button(-177, -5, 1704, 1208, 340, 485, 300, 300, layerMenu);
        goog.events.listen(desert, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('desert', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                self.getCodeScene(data);
            });
        });

        //Theme-Water
        var water = new obacht.Menu.Button(-675, -450, 1704, 1208, 640, 485, 300, 300, layerMenu);
        goog.events.listen(water, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('water', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                self.getCodeScene(data);
            });
        });

        //Theme-Meadow
        var meadow = new obacht.Menu.Button(-60, -213, 1704, 1208, 940, 485, 300, 300, layerMenu);
        goog.events.listen(meadow, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('meadow', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                self.getCodeScene(data);
            });
        });
    },


    /**
     * Get Code (PIN) Scene
     * @param data
     */
    getCodeScene: function(data) {

        "use strict";
        var self = this;

        // Pad the Pin with leading zeros, add spaces between Numbers
        var pin = this.padPin(data.pin, 4, 0);
        var pinArray = pin.split("");
        var pinFormatted = pinArray.join(' ');

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        var layerToolTip = new lime.Layer().setHidden(true);
        sceneMenu.appendChild(layerToolTip);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //Small Logo
        var logo_small = new obacht.Menu.Button(360, -570, 1704, 1208, 640, 130, 600, 150, layerMenu);

        //Back
        var backButton = new obacht.Menu.Button(10, 10, 1704, 1208, 57, 57, 115, 115, layerMenu);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.selectThemeScene();
            obacht.mp.leaveRoom();
            obacht.mp.events.clear('room_detail');
        });

        //Code_Field
        var codeLabel = new obacht.Menu.Label('YOUR CODE', 50, 640, 320, 300, 90, layerMenu);
        var field = new obacht.Menu.Button(290, 315, 1704, 1208, 640, 405, 480, 160, layerMenu);
        var codeNumbersLabel =  obacht.Menu.Label(pinFormatted, 90, 640, 425, 400, 130, layerMenu);

        //small Infotext Icon
        var infoButton = new obacht.Menu.Button(-350, 215, 1704, 1208, 805, 265, 90, 90, layerMenu);
        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            //Pop-up display;
            layerToolTip.setHidden(false);
        });

        //Pop-up-Infotext
        var popupButton = new obacht.Menu.Button(820, -190, 1704, 1208, 1000, 260, 350, 260, layerToolTip);
        var popupLabel = new obacht.Menu.Label('PLEASE GIVE THIS CODE TO YOUR FRIEND', 36, 1018, 250, 280, 55, layerToolTip);
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            //Pop-up display none;
            layerToolTip.setHidden(true);
        });

        obacht.mp.playerReady();

    },


    /**
     * Game Loading Scene
     * Starts the Game and everything self needs to be ready for self.
     */
    loadGameScene: function() {
        "use strict";

        var gameScene = new lime.Scene();
        obacht.director.replaceScene(gameScene);


        /////////////////////////////
        // Start new Game          //
        /////////////////////////////

        obacht.playerController = new obacht.PlayerController();
        obacht.currentGame = new obacht.Game();
        gameScene.appendChild(obacht.currentGame.layer);

    },

    /**
     * Join Custom Game Scene
     */
    joinGameScene: function() {
        "use strict";

        /////////////////////////////
        // Variables               //
        /////////////////////////////

        var self = this;

        /** Array for PIN */
        var codeArray = ['_','_','_','_'];

        var code_label = [4];
        code_label[0] = new lime.Label().setText(codeArray[0]).setFontColor('#fff').setFontSize(90).setPosition(520, 425).setSize(100, 130);
        code_label[1] = new lime.Label().setText(codeArray[1]).setFontColor('#fff').setFontSize(90).setPosition(600, 425).setSize(100, 130);
        code_label[2] = new lime.Label().setText(codeArray[2]).setFontColor('#fff').setFontSize(90).setPosition(680, 425).setSize(100, 130);
        code_label[3] = new lime.Label().setText(codeArray[3]).setFontColor('#fff').setFontSize(90).setPosition(760, 425).setSize(100, 130);

        var codeposition = 0;

        // KeyboardButton Placement
        var startFrom1 = -670;
        var startFrom2 = 90;
        var spacing = 110;
        var keys = [];
        var key_labels = [10];


        /////////////////////////////
        // Helper Functions //
        /////////////////////////////

        /**
         * Returns PIN
         *
         * @returns {*}
         */
        self.getPin = function() {
            return codeArray[0] + '' + codeArray[1] + '' + codeArray[2] + '' + codeArray[3];
        };

        var draw_Code = function() {
            code_label[0].setText(codeArray[0]);
            code_label[1].setText(codeArray[1]);
            code_label[2].setText(codeArray[2]);
            code_label[3].setText(codeArray[3]);
            layerMenu.appendChild(code_label[0]);
            layerMenu.appendChild(code_label[1]);
            layerMenu.appendChild(code_label[2]);
            layerMenu.appendChild(code_label[3]);
        };

        var drawKeyboardButton = function(x1, x2) {
            var key = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(x1, -100).setAnchorPoint(0, 0);
            layerMenu.appendChild(key);
            var maskKey = new lime.Sprite().setPosition(x2, 530).setAnchorPoint(0.5,0.5).setSize(130, 130);
            layerMenu.appendChild(maskKey);
            key.setMask(maskKey);
            return key;
        };

        /**
         * Add Number to PIN
         *
         * @param {Number} insertNumber
         */
        var addNumber = function(insertNumber) {
            for (i = 0; i <= 3; i++) {
                if (codeArray[i] === '_') {
                    codeArray[i] = insertNumber;
                    code_label[i].setText(codeArray[i]);
                    layerMenu.appendChild(code_label[i]);
                    return;
                }
            }
        };

        /**
         * Backspace PIN (Deletes last entered PIN)
         */
        var deleteNumber = function() {
            for (i = 3; i >= 0; i--) {
                if (codeArray[i] !== '_') {
                    codeArray[i] = '_';
                    code_label[i].setText(codeArray[i]);
                    layerMenu.appendChild(code_label[i]);
                    return;
                }
            }
        };

        self.startGame = function() {
            if (codeArray[0] !== '_' && codeArray[1] !== '_' && codeArray[2] !== '_' && codeArray[3] !== '_') {

                var pin = self.getPin();
                obacht.mp.joinRoom(pin, true);
                obacht.mp.events.subscribeOnce('room_detail', function(data){
                    obacht.mp.playerReady();
                });
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

        var layerToolTip = new lime.Layer().setHidden(true);
        sceneMenu.appendChild(layerToolTip);

        // Background
        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //Small Logo
        var smallLogoButton = new obacht.Menu.Button(360, -570, 1704, 1208, 640, 130, 600, 150, layerMenu);

        //Back
        var backButton = new obacht.Menu.Button(10, 10, 1704, 1208, 57, 57, 115, 115, layerMenu);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
        });

        //small Infotext Icon
        var infoButton = new obacht.Menu.Button(-345, 215, 1704, 1208, 810, 265, 90, 90, layerMenu);
        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            //Pop-up display;
            layerToolTip.setHidden(false);
        });

        //Pop-up-Infotext
        var popupButton = new obacht.Menu.Button(220, 145, 1704, 1208, 1020, 315, 400, 370, layerToolTip);
        var popupLabel = new obacht.Menu.Label('ENTER THE FOUR DIGIT CODE YOU GOT FROM YOUR FRIEND', 36, 1040, 248, 280, 55, layerToolTip);
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            //Pop-up display none;
            layerToolTip.setHidden(true);
        });

        //Code_Field
        var enterCodeLabel = new obacht.Menu.Label('ENTER CODE', 50, 640, 320, 300, 90, layerMenu);
        var fieldButton = new obacht.Menu.Button(290, 315, 1704, 1208, 640, 405, 480, 160, layerMenu);
        draw_Code();

        /////////////////////////////
        // Create Buttons //
        /////////////////////////////

        //Number-Keys
        for (var i = 1; i < 10; i++) {
            keys[i] = drawKeyboardButton(startFrom1 + spacing * (i-1), startFrom2 + spacing * (i-1));
            layerMenu.appendChild(keys[i]);
            key_labels[i] = new lime.Label().setAlign('center').setText(i).setFontColor('#fff').setFontSize(70).setSize(95, 70).setPosition(startFrom2 + spacing * (i-1),525);
            layerMenu.appendChild(key_labels[i]);
        }

        //Zero-Key
        keys[0] = drawKeyboardButton(startFrom1 + spacing * 9, startFrom2 + spacing * 9);
        layerMenu.appendChild(keys[0]);
        key_labels[0] = new lime.Label().setAlign('center').setText(0).setFontColor('#fff').setFontSize(70).setSize(95, 70).setPosition(startFrom2 + spacing * 9,525);
        layerMenu.appendChild(key_labels[0]);

        //Delete-Key
        var keyDelete = new obacht.Menu.Button(0, 68, 1772, 1256, 1190, 525, 130, 130, layerMenu);

        //Play-Button
        var playButton = new obacht.Menu.Button(85, -278, 1704, 1208, 640, 640, 350, 130, layerMenu);
        var playLabel = new obacht.Menu.Label('PLAY', 40, 637, 650, 700, 60, layerMenu);


        /////////////////////////////
        // Register EventListeners //
        /////////////////////////////

        goog.events.listen(key_labels[1], ['touchstart', 'mousedown'], function() {
            addNumber(1);
        });
        goog.events.listen(key_labels[2], ['touchstart', 'mousedown'], function() {
            addNumber(2);
        });
        goog.events.listen(key_labels[3], ['touchstart', 'mousedown'], function() {
            addNumber(3);
        });
        goog.events.listen(key_labels[4], ['touchstart', 'mousedown'], function() {
            addNumber(4);
        });
        goog.events.listen(key_labels[5], ['touchstart', 'mousedown'], function() {
            addNumber(5);
        });
        goog.events.listen(key_labels[6], ['touchstart', 'mousedown'], function() {
            addNumber(6);
        });
        goog.events.listen(key_labels[7], ['touchstart', 'mousedown'], function() {
            addNumber(7);
        });
        goog.events.listen(key_labels[8], ['touchstart', 'mousedown'], function() {
            addNumber(8);
        });
        goog.events.listen(key_labels[9], ['touchstart', 'mousedown'], function() {
            addNumber(9);
        });
        goog.events.listen(key_labels[0], ['touchstart', 'mousedown'], function() {
            addNumber(0);
        });
        goog.events.listen(keyDelete, ['touchstart', 'mousedown'], function() {
            deleteNumber();
        });
        goog.events.listen(playButton, ['touchstart', 'mousedown'], function() {
            self.startGame();
        });

    },

    /**
     * Game Over Scene
     * TODO: Not implemented yet
     */
    gameoverScene: function(data) {
        "use strict";

        var self = this;
        var gameoverText = '';

        var gameoverScene = new lime.Scene();
        var layerMenu = new lime.Layer();
        gameoverScene.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        if (data.reason === 'player_left' ) {
            gameoverText = 'Player left the game!';
        } else if (data.pid === obacht.mp.pid){
            gameoverText = 'YOU LOSE!';
        } else {
            gameoverText = 'YOU WIN';
        }

        var gameoverLabel = new obacht.Menu.Label(gameoverText, 40, 740, 320, 400, 90, layerMenu).setAlign('left');


        obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);


        ///////////////////////////////
        // Play Again                //
        ///////////////////////////////

        var createButton = new obacht.Menu.Button(-910, 400, 1533, 1087, 400, 480, 450, 160, layerMenu);
        var createLabel = new obacht.Menu.Label('Play Again', 60, 400, 485, 400, 70, layerMenu);


        var serverReady = false;
        obacht.mp.events.subscribeOnce('join_room', function(data){
            serverReady = true;
        });

        goog.events.listen(createButton, ['touchstart', 'mousedown'], function() {

            if (obacht.mp.roomDetail) {

                if (obacht.mp.friend) {
                    // New Custom Game with Friend from last Game

                    if (obacht.mp.roomDetail.creatingPlayerId === obacht.mp.pid) {
                        // If player is the host, create new Game
                        console.log('Creating New Custom Game with Friend from last Game');
                        obacht.mp.newRoom(obacht.mp.getRandomTheme(), obacht.mp.roomDetail.options, true, obacht.mp.friend);
                        if (serverReady) {
                            obacht.mp.playerReady();
                        } else {
                            obacht.mp.events.subscribeOnce('join_room', function(){
                                obacht.mp.playerReady();
                            });
                        }
                        self.waitForPlayerScene();
                    } else {
                        if (serverReady) {
                            obacht.mp.playerReady();
                        } else {
                            obacht.mp.events.subscribeOnce('join_room', function(){
                                obacht.mp.playerReady();
                            });
                        }
                        self.waitForPlayerScene();
                    }
                } else {
                    // New Random Game
                    console.log('New Random Game');
                    obacht.mp.findMatch();
                    obacht.mp.events.subscribeOnce('join_room', function(){
                        obacht.mp.playerReady();
                        self.waitForPlayerScene();
                    });
                }
            }
        });


        ///////////////////////////////
        // Quit to Main Menu         //
        ///////////////////////////////

        var joinButton = new obacht.Menu.Button(-910, 515, 1533, 1087, 400, 600, 450, 160, layerMenu);
        var joinLabel = new obacht.Menu.Label('Quit', 60, 400, 600, 400, 70, layerMenu);
        goog.events.listen(joinButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        // set current scene active
        obacht.director.replaceScene(gameoverScene);

    },

    /**
     * Wait for the other Player Scene
     * TODO: Not done yet!
     */
    waitForPlayerScene: function() {
        "use strict";
        var self = this;

        var loadingScene = new lime.Scene();

        var layerMenu = new lime.Layer();
        loadingScene.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //BIG LOGO FOR LOADING-SCREEN
        var logo_big = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(190, -750).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_big);
        var mask_logo_big = new lime.Sprite().setPosition(640, 360).setAnchorPoint(0.5,0.5).setSize(1000, 200);
        layerMenu.appendChild(mask_logo_big);
        logo_big.setMask(mask_logo_big);


        //Back - Door
        var backButton = new obacht.Menu.Button(-990, 10, 1704, 1208, 57, 57, 130, 130, layerMenu);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            obacht.mp.events.clear('room_detail');
            self.mainMenuScene();
        });

        var loadingText = 'Waiting for Player ';
        var loadingStatus = '.';
        var loadingLabel = new obacht.Menu.Label(loadingText + loadingStatus, 40, 550, 520, 400, 90, layerMenu).setAlign('left');

        setInterval(function(){
            layerMenu.removeChild(loadingLabel);
            loadingStatus += '.';

            loadingLabel = new obacht.Menu.Label(loadingText + loadingStatus, 40, 550, 520, 400, 90, layerMenu).setAlign('left');
            if (loadingStatus === '.....') {
                loadingStatus = '';
            }

        }, 950);

        // set current scene active
        obacht.director.replaceScene(loadingScene);

    },

    /**
     * Help / Tutorial Scene
     * TODO: todo
     */
    helpScene: function() {
        "use strict";

    },

    /**
     * Credits Scene
     * TODO: todo
     */
    creditsScene: function() {
        "use strict";

    },

    /////////////////////////////
    // Helper Functions        //
    /////////////////////////////


    /**
     * Adds (left) Padding to the PIN Number
     *
     * @param n
     * @param width
     * @param z
     * @returns {string}
     */
    padPin: function(n, width, z) {
        "use strict";
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

};

