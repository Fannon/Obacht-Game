/* global goog, lime, obacht, log */

goog.provide('obacht.Menu');

// Lime.js Requirements
goog.require('lime.Layer');


/**
 * Game Menu
 *
 * Inits the Menu and handles the different MenuScenes
 * Uses the MultiplayerService to join/create Rooms
 * Creates a new Game as one of its Scenes
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

    // If fastStart Option is set to true, immediatly start a random Game
    if (obacht.options.debug.fastStart) {
        obacht.mp.findMatch();
        obacht.mp.events.subscribeOnce('room_detail', function() {
            obacht.mp.playerReady();
            self.waitForPlayerScene();
        });
    }

};

obacht.Menu.prototype = {

    /**
     * Main Menu Scene
     */
    mainMenuScene: function() {
        "use strict";
        var self = this;

        // Reset Variables and Event Listeners
        obacht.cleanUp();

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Small Logo */
        var logoSmall = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obacht_small.png'))
            .setPosition(640, 130)
            .setSize(544, 114);

        /** Character */
        var character = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('character_right.png'))
            .setPosition(1055, 340)
            .setSize(450, 536);

        /** Play Button */
        var playButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('play.png'))
            .setPosition(640, 338)
            .setSize(368, 176);

        /** Play Button Label */
        var playLabel = new lime.Label()
            .setText('PLAY')
            .setFontColor('#fff')
            .setFontSize(90)
            .setPosition(640, 338)
            .setSize(400, 90)
            .setAlign('center');

        /** On Play Button -> New Game Scene @event */
        goog.events.listen(playButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
        });

        /** Help Button */
        var helpButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_help.png'))
            .setPosition(322, 540)
            .setSize(174, 160);

        /** Help Button Label */
        var helpLabel = new lime.Label()
            .setText('HELP')
            .setFontColor('#fff')
            .setFontSize(45
            ).setPosition(322, 650)
            .setSize(170, 45)
            .setAlign('center');

        /** Help Button Event -> Help Scene @event */
        goog.events.listen(helpButton, ['touchstart', 'mousedown'], function() {
            self.helpScene();
        });

        /** Info Button */
        var infoButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_info.png'))
            .setPosition(534, 540)
            .setSize(174, 160);

        /** Info Button Label */
        var infoLabel = new lime.Label()
            .setText('CREDITS')
            .setFontColor('#fff')
            .setFontSize(45)
            .setPosition(534, 650)
            .setSize(170, 45)
            .setAlign('center');

        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            self.creditsScene();
        });

        /** Sound Button */
        var soundButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_sound.png'))
            .setPosition(746, 540)
            .setSize(174, 160);

        var soundLabel = new lime.Label()
            .setText('SOUND')
            .setFontColor('#fff')
            .setFontSize(45)
            .setPosition(746, 650)
            .setSize(170, 45)
            .setAlign('center');

        goog.events.listen(soundButton, ['touchstart', 'mousedown'], function() {
            // TODO: change Icon
            // TODO: sound off
        });

        /** Quit Button */
        var quitButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_quit.png'))
            .setPosition(958, 540)
            .setSize(174, 160);

        /** Quit Button Text */
        var quitLabel = new lime.Label()
            .setText('QUIT')
            .setFontColor('#fff')
            .setFontSize(45)
            .setPosition(958, 650)
            .setSize(170, 45)
            .setAlign('center');

        goog.events.listen(quitButton, ['touchstart', 'mousedown'], function() {
            // TODO: quit Game
        });


        ///////////////////////////////
        // Draw Layer                //
        ///////////////////////////////

        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(character);
        menuLayer.appendChild(playButton);
        menuLayer.appendChild(playLabel);
        menuLayer.appendChild(helpButton);
        menuLayer.appendChild(helpLabel);
        menuLayer.appendChild(infoButton);
        menuLayer.appendChild(infoLabel);
        menuLayer.appendChild(soundButton);
        menuLayer.appendChild(soundLabel);
        menuLayer.appendChild(quitButton);
        menuLayer.appendChild(quitLabel);

        // set current scene active
        obacht.director.replaceScene(menuScene);
    },

    /**
     * New Game Scene
     * Join Random Game or Create/Join a custom one
     */
    newGameScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Small Logo */
        var logoSmall = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obacht_small.png'))
            .setPosition(640, 130)
            .setSize(544, 114);

        /** Play with a friend Background */
        var friendIcon = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('friend.png'))
            .setPosition(410, 310)
            .setSize(192, 220);

        var friendLabel = new lime.Label()
            .setText('PLAY WITH YOUR FRIEND')
            .setFontColor('#fff')
            .setFontSize(35)
            .setPosition(400, 350)
            .setSize(500, 55)
            .setAlign('center');

        /** Random Game Background */
        var randomIcon = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('random.png'))
            .setPosition(880, 310)
            .setSize(224, 224);

        var randomLabel = new lime.Label()
            .setText('RANDOM GAME')
            .setFontColor('#fff')
            .setFontSize(35)
            .setPosition(885, 350)
            .setSize(500, 55)
            .setAlign('center');

        /** Back Button */
        var backButton = new lime.Sprite().setFill(obacht.spritesheet.getFrame('back.png')).setPosition(75, 75).setSize(80, 96);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });


        ///////////////////////////////
        // Create Custom Game        //
        ///////////////////////////////

        /** Create Button */
        var createButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('options.png'))
            .setPosition(400, 480)
            .setSize(430, 138);

        var createLabel = new lime.Label()
            .setText('CREATE')
            .setFontColor('#fff')
            .setFontSize(60)
            .setPosition(400, 481)
            .setSize(400, 60)
            .setAlign('center');

        goog.events.listen(createButton, ['touchstart', 'mousedown'], function() {
            self.selectThemeScene();
        });


        ///////////////////////////////
        // Join Custom Game          //
        ///////////////////////////////

        /** Join Button */
        var joinButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('options.png'))
            .setPosition(400, 600)
            .setSize(430, 138);

        var joinLabel = new lime.Label()
            .setText('JOIN')
            .setFontColor('#fff')
            .setFontSize(60)
            .setPosition(400, 601)
            .setSize(400, 60)
            .setAlign('center');

        goog.events.listen(joinButton, ['touchstart', 'mousedown'], function() {
            self.joinGameScene();
        });


        ///////////////////////////////
        // New Random Game           //
        ///////////////////////////////

        /** Random Play Button */
        var randomPlayButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('options.png'))
            .setPosition(880, 480)
            .setSize(430, 138);

        var randomPlayLabel = new lime.Label()
            .setText('PLAY')
            .setFontColor('#fff')
            .setFontSize(60)
            .setPosition(880, 481)
            .setSize(400, 60)
            .setAlign('center');

        goog.events.listen(randomPlayButton, ['touchstart', 'mousedown'], function() {
            obacht.mp.findMatch();
            obacht.mp.events.subscribeOnce('room_detail', function() {
                obacht.mp.playerReady();
                self.waitForPlayerScene();
            });
        });


        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(friendIcon);
        menuLayer.appendChild(friendLabel);
        menuLayer.appendChild(randomIcon);
        menuLayer.appendChild(randomLabel);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(createButton);
        menuLayer.appendChild(createLabel);
        menuLayer.appendChild(joinButton);
        menuLayer.appendChild(joinLabel);
        menuLayer.appendChild(randomPlayButton);
        menuLayer.appendChild(randomPlayLabel);

        // set current scene active
        obacht.director.replaceScene(menuScene);

    },

    /**
     * Select Theme Scene
     */
    selectThemeScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Scene Content             //
        ///////////////////////////////

        /** Small Logo */
        var logoSmall = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obacht_small.png'))
            .setPosition(640, 130)
            .setSize(544, 114);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Select a World Label */
        var selectWorldLabel = new lime.Label()
            .setText('SELECT A WORLD')
            .setFontColor('#fff')
            .setFontSize(50)
            .setPosition(640, 300)
            .setSize(400, 50)
            .setAlign('center');

        /** Desert Button */
        var desert = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('theme_desert.png'))
            .setPosition(340, 485)
            .setSize(298, 270);

        goog.events.listen(desert, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('desert', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data) {
                self.getCodeScene(data);
            });
        });

        /** Water Button */
        var water = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('theme_water.png'))
            .setPosition(640, 485)
            .setSize(298, 270);

        goog.events.listen(water, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('water', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data) {
                self.getCodeScene(data);
            });
        });

        /** Meadow Button */
        var meadow = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('theme_meadow.png'))
            .setPosition(940, 485)
            .setSize(298, 270);

        goog.events.listen(meadow, ['touchstart', 'mousedown'], function() {
            obacht.mp.newRoom('meadow', {}, true, false);
            obacht.mp.events.subscribeOnce('room_detail', function(data) {
                self.getCodeScene(data);
            });
        });


        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(selectWorldLabel);
        menuLayer.appendChild(desert);
        menuLayer.appendChild(water);
        menuLayer.appendChild(meadow);

        // set current scene active
        obacht.director.replaceScene(menuScene);

    },


    /**
     * Get Code (PIN) Scene
     * @param data
     */
    getCodeScene: function(data) {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);

        var layerToolTip = new lime.Layer().setHidden(true);
        menuScene.appendChild(layerToolTip);


        ///////////////////////////////
        // Data                      //
        ///////////////////////////////

        // Pad the Pin with leading zeros, add spaces between Numbers
        var pin = this.padPin(data.pin, 4, 0);
        var pinArray = pin.split("");
        var pinFormatted = pinArray.join(' ');


        ///////////////////////////////
        // Scene Content             //
        ///////////////////////////////

        /** Small Logo */
        var logoSmall = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obacht_small.png'))
            .setPosition(640, 130)
            .setSize(544, 114);

        /** Character */
        var character = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('character_top.png'))
            .setPosition(290, 360)
            .setSize(580, 720);

        /** Back Button */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('back.png'))
            .setPosition(75, 75)
            .setSize(80, 96);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.selectThemeScene();
            obacht.mp.leaveRoom();
            obacht.mp.events.clear('room_detail');
        });

        /** Your Code Label */
        var codeLabel = new lime.Label()
            .setText('YOUR CODE')
            .setFontColor('#fff')
            .setFontSize(50)
            .setPosition(640, 300)
            .setSize(300, 50)
            .setAlign('center');

        /** Code Field */
        var field = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('code.png'))
            .setPosition(640, 405)
            .setSize(455, 154);

        var code = new lime.Label()
            .setText(pinFormatted)
            .setFontColor('#fff')
            .setFontSize(90)
            .setPosition(640, 408)
            .setSize(300, 90)
            .setAlign('center');

        /** small Infotext Icon */
        var infoButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_info_small.png'))
            .setPosition(800, 267)
            .setSize(80, 76);

        /** Show Pop-up @event */
        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            layerToolTip.setHidden(false);
        });

        /** Pop-up-Infotext */
        var popupButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('code_info_small.png'))
            .setPosition(1000, 290)
            .setSize(338, 234);

        var popupLabel = new lime.Label()
            .setText('PLEASE GIVE THIS CODE TO YOUR FRIEND')
            .setFontColor('#fff')
            .setFontSize(36)
            .setPosition(1018, 304)
            .setSize(280, 150)
            .setAlign('center');

        /** Hide Pop-up @event */
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            layerToolTip.setHidden(true);
        });

        // Set Creating Player Ready
        obacht.mp.playerReady();


        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(character);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(codeLabel);
        menuLayer.appendChild(field);
        menuLayer.appendChild(code);
        menuLayer.appendChild(infoButton);
        layerToolTip.appendChild(popupButton);
        layerToolTip.appendChild(popupLabel);

        // set current scene active
        obacht.director.replaceScene(menuScene);
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
        var codeArray = ['_', '_', '_', '_'];
        var code_label = [4];

        /** KeyboardButton Placement */
        var startFrom = 90;
        var spacing = 110;
        var keys = [];
        var key_labels = [10];

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        /////////////////////////////
        // Scene Content           //
        /////////////////////////////

        code_label[0] = new lime.Label()
            .setText(codeArray[0])
            .setFontColor('#fff')
            .setFontSize(90)
            .setPosition(520, 425)
            .setSize(100, 130);

        code_label[1] = new lime.Label()
            .setText(codeArray[1])
            .setFontColor('#fff')
            .setFontSize(90)
            .setPosition(600, 425)
            .setSize(100, 130);

        code_label[2] = new lime.Label()
            .setText(codeArray[2])
            .setFontColor('#fff')
            .setFontSize(90)
            .setPosition(680, 425)
            .setSize(100, 130);

        code_label[3] = new lime.Label()
            .setText(codeArray[3])
            .setFontColor('#fff')
            .setFontSize(90)
            .setPosition(760, 425)
            .setSize(100, 130);

        var layerToolTip = new lime.Layer().setHidden(true);

        /** Small Logo */
        var logoSmall = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obacht_small.png'))
            .setPosition(640, 130)
            .setSize(544, 114);

        /** Back Button */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet
            .getFrame('back.png'))
            .setPosition(75, 75)
            .setSize(80, 96);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
        });

        /** small Infotext Icon */
        var infoButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_info_small.png'))
            .setPosition(810, 267)
            .setSize(80, 76);

        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            /** Show Pop-up display */
            layerToolTip.setHidden(false);
        });

        /** Pop-up-Infotext */
        var popupButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('code_info_big.png'))
            .setPosition(1015, 318)
            .setSize(376, 326);

        var popupLabel = new lime.Label().setText('ENTER THE FOUR DIGIT CODE YOU GOT FROM YOUR FRIEND')
            .setFontColor('#fff')
            .setFontSize(36)
            .setPosition(1036, 295).setSize(280, 150).setAlign('center');

        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            /** Hide Pop-up display */
            layerToolTip.setHidden(true);
        });

        /** Enter Code Label */
        var codeLabel = new lime.Label()
            .setText('ENTER CODE')
            .setFontColor('#fff')
            .setFontSize(50)
            .setPosition(640, 300)
            .setSize(300, 50)
            .setAlign('center');

        /** Code Field */
        var field = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('code.png'))
            .setPosition(640, 405)
            .setSize(478, 154);


        /////////////////////////////
        // Create Number Buttons   //
        /////////////////////////////

        // Create Number-Keys
        var i;

        for (i = 1; i < 10; i++) {

            keys[i] = new lime.Sprite()
                .setFill(obacht.spritesheet.getFrame('key.png'))
                .setPosition(startFrom + spacing * (i - 1), 535)
                .setSize(142, 132);

            key_labels[i] = new lime.Label()
                .setAlign('center')
                .setText(i)
                .setFontColor('#fff')
                .setFontSize(70)
                .setSize(142, 70)
                .setPosition(startFrom + spacing * (i - 1) + 3, 537);
        }

        /** Create Zero-Key */
        keys[0] = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('key.png'))
            .setPosition(startFrom + spacing * 9, 535)
            .setSize(142, 132);

        key_labels[0] = new lime.Label()
            .setAlign('center')
            .setText(0)
            .setFontColor('#fff')
            .setFontSize(70)
            .setSize(142, 70)
            .setPosition(startFrom + spacing * 9 + 3, 537);

        /** Create Delete-Key */
        var keyDelete = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('key_back.png'))
            .setPosition(startFrom + spacing * 10 + 3, 535)
            .setSize(142, 137);


        /** Play-Button */
        var playButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('next2.png'))
            .setPosition(640, 650)
            .setSize(300, 126);

        var playLabel = new lime.Label()
            .setAlign('center')
            .setText('PLAY')
            .setFontColor('#fff')
            .setFontSize(50)
            .setSize(300, 50)
            .setPosition(640, 652);


        /////////////////////////////
        // Event Listeners //
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
            startGame();
        });


        /////////////////////////////
        // Draw Scene              //
        /////////////////////////////

        menuScene.appendChild(layerToolTip);
        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(infoButton);
        layerToolTip.appendChild(popupButton);
        layerToolTip.appendChild(popupLabel);
        menuLayer.appendChild(codeLabel);
        menuLayer.appendChild(field);

        for (i = 1; i < 10; i++) {
            menuLayer.appendChild(keys[i]);
            menuLayer.appendChild(key_labels[i]);
        }

        menuLayer.appendChild(keys[0]);
        menuLayer.appendChild(key_labels[0]);
        menuLayer.appendChild(keyDelete);
        menuLayer.appendChild(playButton);
        menuLayer.appendChild(playLabel);

        drawCode();

        // set current scene active
        obacht.director.replaceScene(menuScene);


        /////////////////////////////
        // Helper Functions        //
        /////////////////////////////

        /**
         * Returns PIN
         *
         * @returns {*}
         */
        function getPin() {
            return codeArray[0] + '' + codeArray[1] + '' + codeArray[2] + '' + codeArray[3];
        }

        /**
         * Draws current CodeArray into the Code Labels
         */
        function drawCode() {
            code_label[0].setText(codeArray[0]);
            code_label[1].setText(codeArray[1]);
            code_label[2].setText(codeArray[2]);
            code_label[3].setText(codeArray[3]);
            menuLayer.appendChild(code_label[0]);
            menuLayer.appendChild(code_label[1]);
            menuLayer.appendChild(code_label[2]);
            menuLayer.appendChild(code_label[3]);
        }

        /**
         * Add Number to PIN
         *
         * @param {Number} insertNumber
         */
        function addNumber(insertNumber) {
            for (i = 0; i <= 3; i++) {
                if (codeArray[i] === '_') {
                    codeArray[i] = insertNumber;
                    code_label[i].setText(codeArray[i]);
                    menuLayer.appendChild(code_label[i]);
                    break;
                }
            }
        }

        /**
         * Backspace PIN (Deletes last entered PIN)
         */
        function deleteNumber() {
            for (i = 3; i >= 0; i--) {
                if (codeArray[i] !== '_') {
                    codeArray[i] = '_';
                    code_label[i].setText(codeArray[i]);
                    menuLayer.appendChild(code_label[i]);
                    break;
                }
            }
        }

        /**
         * Check if PIN is valid and start Game if it is
         */
        function startGame() {
            if (codeArray[3] !== '_') {
                var pin = getPin();
                obacht.mp.joinRoom(pin, true);
                obacht.mp.events.subscribeOnce('room_detail', function() {
                    obacht.mp.playerReady();
                });
            } else {
                log.warn('PIN not valid');
                obacht.showPopup('error','PIN not valid');
            }
        }
    },

    /**
     * Game Over Scene
     * TODO: Not implemented yet
     */
    gameoverScene: function(data) {
        "use strict";

        var self = this;
        var gameoverText = '';
        var alreadyJoined = false;

        var gameoverScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        gameoverScene.appendChild(menuLayer);

        obacht.mp.events.subscribeOnce('join_room', function() {
            alreadyJoined = true;
        });


        ///////////////////////////////
        // Game Over Text            //
        ///////////////////////////////

        if (data.reason === 'player_left') {
            gameoverText = 'Player left the game!';
        } else if (data.pid === obacht.mp.pid) {
            gameoverText = 'YOU LOSE!';
        } else {
            gameoverText = 'YOU WIN';
        }

        /** Game over Text Label */
        var gameoverLabel = new lime.Label()
            .setAlign('center')
            .setText(gameoverText)
            .setFontColor('#fff')
            .setFontSize(50)
            .setSize(400, 50)
            .setPosition(250, 250)
            .setAlign('left');

        obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);
        obacht.cleanUp();


        ///////////////////////////////
        // Play Again                //
        ///////////////////////////////

        /** Play Again Button */
        var playAgainButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('options.png'))
            .setPosition(400, 480)
            .setSize(430, 138);

        var playAgainLabel = new lime.Label()
            .setText('Play Again')
            .setFontColor('#fff')
            .setFontSize(60)
            .setPosition(400, 481)
            .setSize(400, 60)
            .setAlign('center');

        /**
         * Play Again Event
         * If playing a Random Random Game this will open a new Random Game Request
         * If connected to a custom Game via PIN, it will try to create a new Private Game with the same Player
         * @event
         */
        goog.events.listen(playAgainButton, ['touchstart', 'mousedown'], function() {

            if (obacht.mp.roomDetail) {

                if (obacht.mp.friend) {
                    // New Custom Game with Friend from last Game

                    if (obacht.mp.roomDetail.creatingPlayerId === obacht.mp.pid) {
                        // If player is the host, create new Game
                        log.debug('Creating New Custom Game with Friend from last Game');
                        obacht.mp.newRoom(obacht.mp.getRandomTheme(), obacht.mp.roomDetail.options, true, obacht.mp.friend);
                        self.waitForPlayerScene();
                        if (alreadyJoined) {
                            obacht.mp.playerReady();
                        } else {
                            obacht.mp.events.subscribeOnce('join_room', function() {
                                obacht.mp.playerReady();
                            });
                        }
                    } else {
                        self.waitForPlayerScene();
                        if (alreadyJoined) {
                            obacht.mp.playerReady();
                        } else {
                            obacht.mp.events.subscribeOnce('join_room', function() {
                                obacht.mp.playerReady();
                            });
                        }
                    }
                } else {
                    // New Random Game
                    log.debug('New Random Game');
                    obacht.mp.findMatch();
                    obacht.mp.events.subscribeOnce('join_room', function() {
                        obacht.mp.playerReady();
                        self.waitForPlayerScene();
                    });
                }
            }
        });


        ///////////////////////////////
        // Quit to Main Menu         //
        ///////////////////////////////

        /** Quit to Main Menu Button */
        var quitButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('options.png'))
            .setPosition(400, 280)
            .setSize(430, 138);

        /** Quit to Main Menu Label */
        var quitLabel = new lime.Label()
            .setText('Quit')
            .setFontColor('#fff')
            .setFontSize(60)
            .setPosition(400, 281)
            .setSize(400, 60)
            .setAlign('center');

        /** Quit Event Listener -> Back to Main Menu Scene @event */
        goog.events.listen(quitButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });


        ///////////////////////////////
        // Draw the Scene            //
        ///////////////////////////////

        menuLayer.appendChild(gameoverLabel);
        menuLayer.appendChild(playAgainButton);
        menuLayer.appendChild(playAgainLabel);
        menuLayer.appendChild(quitButton);
        menuLayer.appendChild(quitLabel);

        obacht.director.replaceScene(gameoverScene);

    },

    /**
     * Wait for the other Player Scene
     * TODO: Not done yet!
     */
    waitForPlayerScene: function() {
        "use strict";
        var self = this;

        var waitForPlayerScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        waitForPlayerScene.appendChild(menuLayer);


        ///////////////////////////////
        // Scene Content             //
        ///////////////////////////////

        /** Waiting Graphic */
        var waiting = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('wait.png'))
            .setPosition(640, 330);
//            .setSize(544, 114);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            obacht.mp.events.clear('room_detail');
            self.mainMenuScene();
        });


        ///////////////////////////////
        // Draw the Scene            //
        ///////////////////////////////

        menuLayer.appendChild(waiting);
        menuLayer.appendChild(backButton);

        // set current scene active
        obacht.director.replaceScene(waitForPlayerScene);

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
    },

    /**
     * Menu Destructor
     */
    destruct: function() {
        "use strict";
        // TODO: Menu Destructor?
    }

};

