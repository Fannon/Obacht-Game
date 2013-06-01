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

//Spritesheets Requirements
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.menuSpritesheet.json');
goog.require('lime.SpriteSheet');


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

    this.spritesheet = new lime.SpriteSheet('assets/spritesheets/menuSpritesheet.png',lime.ASSETS.menuSpritesheet.json,lime.parser.JSON);

    console.log('PERFORMANCE: MENU - CURRENT DOM ELEMENTS: ' + document.getElementsByTagName('*').length);


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
         * Subscribe (once) Game Over Event
         * @event
         */
        obacht.mp.events.subscribeOnce('game_over', function(data){
            self.gameoverScene(data);
            obacht.cleanUp();
        });
    });

    // Start first Scene
    this.mainMenuScene();

    // If fastStart Option is set to true, immediatly start a random Game
    if (obacht.options.fastStart) {
        obacht.mp.findMatch();
        obacht.mp.events.subscribeOnce('room_detail', function(data){
            obacht.mp.playerReady();
            self.waitForPlayerScene();
        });
    }

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
        // TODO: Loading GIF
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
        obacht.cleanUp();


        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        /** Small Logo */
        var logoSmall = new lime.Sprite().setFill(this.spritesheet.getFrame('obacht_small.png')).setPosition(640,130).setSize(544,114);

        /** Play Button */
        var playButton = new lime.Sprite().setFill(this.spritesheet.getFrame('play.png')).setPosition(640,338).setSize(368,176);
        var playLabel = new lime.Label().setText('PLAY').setFontColor('#fff').setFontSize(90).setPosition(640,338).setSize(400,90).setAlign('center');
        goog.events.listen(playButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
        });

        /** Help Button */
        var helpButton = new lime.Sprite().setFill(this.spritesheet.getFrame('button_help.png')).setPosition(322,540).setSize(174,160);
        var helpLabel = new lime.Label().setText('HELP').setFontColor('#fff').setFontSize(45).setPosition(322,650).setSize(170,45).setAlign('center');
        goog.events.listen(helpButton, ['touchstart', 'mousedown'], function() {
            self.helpScene();
        });

        /** Info Button */
        var infoButton = new lime.Sprite().setFill(this.spritesheet.getFrame('button_info.png')).setPosition(534,540).setSize(174,160);
        var infoLabel = new lime.Label().setText('CREDITS').setFontColor('#fff').setFontSize(45).setPosition(534,650).setSize(170,45).setAlign('center');
        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            self.creditsScene();
        });

        /** Sound Button */
        var soundButton = new lime.Sprite().setFill(this.spritesheet.getFrame('button_sound.png')).setPosition(746,540).setSize(174,160);
        var soundLabel = new lime.Label().setText('SOUND').setFontColor('#fff').setFontSize(45).setPosition(746,650).setSize(170,45).setAlign('center');
        goog.events.listen(soundButton, ['touchstart', 'mousedown'], function() {
            //change Icon
            //sound off
        });

        /** Quit Button */
        var quitButton = new lime.Sprite().setFill(this.spritesheet.getFrame('button_quit.png')).setPosition(958,540).setSize(174,160);
        var quitLabel = new lime.Label().setText('QUIT').setFontColor('#fff').setFontSize(45).setPosition(958,650).setSize(170,45).setAlign('center');
        goog.events.listen(quitButton, ['touchstart', 'mousedown'], function() {
            //quit Game
        });


        layerMenu.appendChild(logoSmall);
        layerMenu.appendChild(playButton);
        layerMenu.appendChild(playLabel);
        layerMenu.appendChild(helpButton);
        layerMenu.appendChild(helpLabel);
        layerMenu.appendChild(infoButton);
        layerMenu.appendChild(infoLabel);
        layerMenu.appendChild(soundButton);
        layerMenu.appendChild(soundLabel);
        layerMenu.appendChild(quitButton);
        layerMenu.appendChild(quitLabel);
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

        /** Small Logo */
        var logoSmall = new lime.Sprite().setFill(this.spritesheet.getFrame('obacht_small.png')).setPosition(640,130).setSize(544,114);

        /** Play with a friend Background */
        var friendIcon = new lime.Sprite().setFill(this.spritesheet.getFrame('friend.png')).setPosition(410,310).setSize(192,220);
        var friendLabel = new lime.Label().setText('PLAY WITH YOUR FRIEND').setFontColor('#fff').setFontSize(35).setPosition(400,350).setSize(500,55).setAlign('center');

        /** Random Game Background */
        var randomIcon = new lime.Sprite().setFill(this.spritesheet.getFrame('random.png')).setPosition(880,310).setSize(224,224);
        var randomLabel = new lime.Label().setText('RANDOM GAME').setFontColor('#fff').setFontSize(35).setPosition(885,350).setSize(500,55).setAlign('center');

        /** Back Button */
        var backButton = new lime.Sprite().setFill(this.spritesheet.getFrame('back.png')).setPosition(75,75).setSize(80,96);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });


        ///////////////////////////////
        // Create Custom Game        //
        ///////////////////////////////

        /** Create Button */
        var createButton = new lime.Sprite().setFill(this.spritesheet.getFrame('options.png')).setPosition(400,480).setSize(430,138);
        var createLabel = new lime.Label().setText('CREATE').setFontColor('#fff').setFontSize(60).setPosition(400,481).setSize(400,60).setAlign('center');
        goog.events.listen(createButton, ['touchstart', 'mousedown'], function() {
            self.selectThemeScene();
        });


        ///////////////////////////////
        // Join Custom Game          //
        ///////////////////////////////

        /** Join Button */
        var joinButton = new lime.Sprite().setFill(this.spritesheet.getFrame('options.png')).setPosition(400,600).setSize(430,138);
        var joinLabel = new lime.Label().setText('JOIN').setFontColor('#fff').setFontSize(60).setPosition(400,601).setSize(400,60).setAlign('center');
        goog.events.listen(joinButton, ['touchstart', 'mousedown'], function() {
            self.joinGameScene();
        });


        ///////////////////////////////
        // New Random Game           //
        ///////////////////////////////

        /** Random Play Button */
        var randomPlayButton = new lime.Sprite().setFill(this.spritesheet.getFrame('options.png')).setPosition(880,480).setSize(430,138);
        var randomPlayLabel = new lime.Label().setText('PLAY').setFontColor('#fff').setFontSize(60).setPosition(880,481).setSize(400,60).setAlign('center');
        goog.events.listen(randomPlayButton, ['touchstart', 'mousedown'], function() {
            obacht.mp.findMatch();
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                obacht.mp.playerReady();
                self.waitForPlayerScene();
            });
        });

        layerMenu.appendChild(logoSmall);
        layerMenu.appendChild(friendIcon);
        layerMenu.appendChild(friendLabel);
        layerMenu.appendChild(randomIcon);
        layerMenu.appendChild(randomLabel);
        layerMenu.appendChild(backButton);
        layerMenu.appendChild(createButton);
        layerMenu.appendChild(createLabel);
        layerMenu.appendChild(joinButton);
        layerMenu.appendChild(joinLabel);
        layerMenu.appendChild(randomPlayButton);
        layerMenu.appendChild(randomPlayLabel);

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

        /** Small Logo */
        var logoSmall = new lime.Sprite().setFill(this.spritesheet.getFrame('obacht_small.png')).setPosition(640,130).setSize(544,114);

        /** Back Button - Door */
        var backButton = new lime.Sprite().setFill(this.spritesheet.getFrame('exit.png')).setPosition(65,75).setSize(92,112);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Select a World Label */
        var selectWorldLabel = new lime.Label().setText('SELECT A WORLD').setFontColor('#fff').setFontSize(50).setPosition(640, 300).setSize(400,50).setAlign('center');

        /** Desert Button */
        var desert = new lime.Sprite().setFill(this.spritesheet.getFrame('theme_desert.png')).setPosition(340, 485).setSize(298,270);
        goog.events.listen(desert, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('desert', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                self.getCodeScene(data);
            });
        });

        /** Water Button */
        var water = new lime.Sprite().setFill(this.spritesheet.getFrame('theme_water.png')).setPosition(640, 485).setSize(298,270);
        goog.events.listen(water, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('water', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                self.getCodeScene(data);
            });
        });

        /** Meadow Button */
        var meadow = new lime.Sprite().setFill(this.spritesheet.getFrame('theme_meadow.png')).setPosition(940, 485).setSize(298,270);
        goog.events.listen(meadow, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('meadow', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data){
                self.getCodeScene(data);
            });
        });
        
        layerMenu.appendChild(logoSmall);
        layerMenu.appendChild(backButton);
        layerMenu.appendChild(selectWorldLabel);
        layerMenu.appendChild(desert);
        layerMenu.appendChild(water);
        layerMenu.appendChild(meadow);

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

        var layerToolTip = new lime.Layer().setHidden(true);
        sceneMenu.appendChild(layerToolTip);
        
        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);


        /** Small Logo */
        var logoSmall = new lime.Sprite().setFill(this.spritesheet.getFrame('obacht_small.png')).setPosition(640,130).setSize(544,114);

        /** Back Button */
        var backButton = new lime.Sprite().setFill(this.spritesheet.getFrame('back.png')).setPosition(75,75).setSize(80,96);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.selectThemeScene();
            obacht.mp.leaveRoom();
            obacht.mp.events.clear('room_detail');
        });

        /** Your Code Label */
        var codeLabel = new lime.Label().setText('YOUR CODE').setFontColor('#fff').setFontSize(50).setPosition(640, 300).setSize(300,50).setAlign('center');

        /** Code Field */
        var field = new lime.Sprite().setFill(this.spritesheet.getFrame('code.png')).setPosition(640, 405).setSize(478,154);
        var code =  new lime.Label().setText(pinFormatted).setFontColor('#fff').setFontSize(90).setPosition(640, 408).setSize(300,90).setAlign('center');

        /** small Infotext Icon */
        var infoButton = new lime.Sprite().setFill(this.spritesheet.getFrame('button_info_small.png')).setPosition(800, 267).setSize(80,76);
        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            /** Show Pop-up display */
            layerToolTip.setHidden(false);
        });

        /** Pop-up-Infotext */
        var popupButton = new lime.Sprite().setFill(this.spritesheet.getFrame('code_info_small.png')).setPosition(1000, 290).setSize(338,234);
        var popupLabel = new lime.Label().setText('PLEASE GIVE THIS CODE TO YOUR FRIEND').setFontColor('#fff').setFontSize(36).setPosition(1018, 304).setSize(280, 150).setAlign('center');
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            /** Hide Pop-up display */
            layerToolTip.setHidden(true);
        });

        obacht.mp.playerReady();

        layerMenu.appendChild(logoSmall);
        layerMenu.appendChild(backButton);
        layerMenu.appendChild(codeLabel);
        layerMenu.appendChild(field);
        layerMenu.appendChild(code);
        layerMenu.appendChild(infoButton);
        layerToolTip.appendChild(popupButton);
        layerToolTip.appendChild(popupLabel);

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

        if (obacht.currentGame) {
            obacht.cleanUp();
        }

        obacht.playerController = new obacht.PlayerController();
        obacht.currentGame = new obacht.Game();

        gameScene.appendChild(obacht.currentGame.layer);
        gameScene.appendChild(obacht.playerController.layer);
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


        /** KeyboardButton Placement */
        var startFrom = 90;
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

        /** Small Logo */
        var logoSmall = new lime.Sprite().setFill(this.spritesheet.getFrame('obacht_small.png')).setPosition(640,130).setSize(544,114);

        /** Back Button */
        var backButton = new lime.Sprite().setFill(this.spritesheet.getFrame('back.png')).setPosition(75,75).setSize(80,96);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
        });

        /** small Infotext Icon */
        var infoButton = new lime.Sprite().setFill(this.spritesheet.getFrame('button_info_small.png')).setPosition(810, 267).setSize(80,76);
        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            /** Show Pop-up display */
            layerToolTip.setHidden(false);
        });

        /** Pop-up-Infotext */
        var popupButton = new lime.Sprite().setFill(this.spritesheet.getFrame('code_info_big.png')).setPosition(1015, 318).setSize(376,326);
        var popupLabel = new lime.Label().setText('ENTER THE FOUR DIGIT CODE YOU GOT FROM YOUR FRIEND').setFontColor('#fff').setFontSize(36).setPosition(1036, 295).setSize(280, 150).setAlign('center');
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            /** Hide Pop-up display */
            layerToolTip.setHidden(true);
        });
        
        /** Enter Code Label */
        var codeLabel = new lime.Label().setText('ENTER CODE').setFontColor('#fff').setFontSize(50).setPosition(640, 300).setSize(300,50).setAlign('center');

        /** Code Field */
        var field = new lime.Sprite().setFill(this.spritesheet.getFrame('code.png')).setPosition(640, 405).setSize(478,154);
        
        layerMenu.appendChild(logoSmall);
        layerMenu.appendChild(backButton);
        layerMenu.appendChild(infoButton);
        layerToolTip.appendChild(popupButton);
        layerToolTip.appendChild(popupLabel);
        layerMenu.appendChild(codeLabel);
        layerMenu.appendChild(field);

        draw_Code();
        
        /////////////////////////////
        // Create Buttons //
        /////////////////////////////

        /** Create Number-Keys */
        var i;
        for (i = 1; i < 10; i++) {
            keys[i] = new lime.Sprite().setFill(this.spritesheet.getFrame('key.png')).setPosition(startFrom + spacing * (i-1), 535).setSize(142,132);
            layerMenu.appendChild(keys[i]);
            key_labels[i] = new lime.Label().setAlign('center').setText(i).setFontColor('#fff').setFontSize(70).setSize(142, 70).setPosition(startFrom + spacing * (i-1)+3,537);
            layerMenu.appendChild(key_labels[i]);
        };

        /** Create Zero-Key */
        keys[0] = new lime.Sprite().setFill(this.spritesheet.getFrame('key.png')).setPosition(startFrom + spacing * 9, 535).setSize(142,132);
        layerMenu.appendChild(keys[0]);
        key_labels[0] = new lime.Label().setAlign('center').setText(0).setFontColor('#fff').setFontSize(70).setSize(142, 70).setPosition(startFrom + spacing * 9+3,537);
        layerMenu.appendChild(key_labels[0]);

        /** Create Delete-Key */
        var keyDelete = new lime.Sprite().setFill(this.spritesheet.getFrame('key_back.png')).setPosition(startFrom + spacing * 10+3, 535).setSize(142,137);
        layerMenu.appendChild(keyDelete);

        /** Play-Button */
        var playButton = new lime.Sprite().setFill(this.spritesheet.getFrame('next2.png')).setPosition(640, 650).setSize(300,126);
        var playLabel = new lime.Label().setAlign('center').setText('PLAY').setFontColor('#fff').setFontSize(50).setSize(300, 50).setPosition(640, 652);
        layerMenu.appendChild(playButton);
        layerMenu.appendChild(playLabel);


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

        if (data.reason === 'player_left' ) {
            gameoverText = 'Player left the game!';
        } else if (data.pid === obacht.mp.pid){
            gameoverText = 'YOU LOSE!';
        } else {
            gameoverText = 'YOU WIN';
        }

        var gameoverLabel = new obacht.Menu.Label(gameoverText, 40, 740, 320, 400, 90, layerMenu).setAlign('left');


        obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);
        obacht.cleanUp();


        ///////////////////////////////
        // Play Again                //
        ///////////////////////////////

        var createButton = new obacht.Menu.Button(-910, 400, 1533, 1087, 400, 480, 450, 160, layerMenu);
        var createLabel = new obacht.Menu.Label('Play Again', 60, 400, 485, 400, 70, layerMenu);

        var alreadyJoined = false;

        obacht.mp.events.subscribeOnce('join_room', function(data){
            alreadyJoined = true;
        });

        goog.events.listen(createButton, ['touchstart', 'mousedown'], function() {

            if (obacht.mp.roomDetail) {

                if (obacht.mp.friend) {
                    // New Custom Game with Friend from last Game

                    if (obacht.mp.roomDetail.creatingPlayerId === obacht.mp.pid) {
                        // If player is the host, create new Game
                        console.log('Creating New Custom Game with Friend from last Game');
                        obacht.mp.newRoom(obacht.mp.getRandomTheme(), obacht.mp.roomDetail.options, true, obacht.mp.friend);
                        self.waitForPlayerScene();
                        if (alreadyJoined) {
                            obacht.mp.playerReady();
                        } else {
                            obacht.mp.events.subscribeOnce('join_room', function(){
                                obacht.mp.playerReady();
                            });
                        }
                    } else {
                        self.waitForPlayerScene();
                        if (alreadyJoined) {
                            obacht.mp.playerReady();
                        } else {
                            obacht.mp.events.subscribeOnce('join_room', function(){
                                obacht.mp.playerReady();
                            });
                        }
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

