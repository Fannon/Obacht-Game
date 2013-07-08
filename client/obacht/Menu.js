/* global goog, lime, obacht, log */

goog.provide('obacht.Menu');

// Lime.js Requirements
goog.require('lime.Layer');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.Loop');
goog.require('lime.animation.Easing');



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

    lime.Label.installFont('Cartwheel', 'assets/fonts/Cartwheel.otf');
    lime.Label.defaultFont = 'Cartwheel';
    lime.Label.installFont('OpenSansRegular', 'assets/fonts/OpenSans-Regular.ttf');
    lime.Label.installFont('OpenSansBold', 'assets/fonts/OpenSans-Bold.ttf');

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

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);
        log.debug('mainMenuScene()');

        if(localStorage.getItem("sound") === 'on') {
            obacht.sound = true;
        } else {
            obacht.sound = false;
        }

        this.resetMenu();
//        this.checkSound();

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
            .setPosition(1010, 360)
            .setSize(540, 643);
            
        /** Wifi Hint */
        var wifiHint = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('internet_hint.png'))
            .setPosition(950, 600) //without Sound
            .setSize(291, 197);

        /** Play Button */
        var playButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('play.png'))
            .setPosition(640, 390)
            .setSize(408, 216);


        /** Play Button Label */
        var playLabel = new lime.Label()
            .setText('PLAY')
            .setFontColor('#fff')
            .setFontSize(100)
            .setPosition(640, 390)
            .setSize(400, 100)
            .setAlign('center');

        /** On Play Button -> New Game Scene @event */
        goog.events.listen(playButton, ['touchstart', 'mousedown'], function() {
            if (!obacht.mp.connected) {
                obacht.showPopup('mainMenuScene', 'Failed to connect to server.');
            } else {
                self.newGameScene();
            }
        });

        /** Help Button */
        var helpButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_help.png'))
            .setPosition(170, 470) //without Sound
            //.setPosition(120, 320) //with Sound
            .setSize(174, 160);

        /** Help Button Label */
        var helpLabel = new lime.Label()
            .setText('Help')
            .setFontColor('#fff')
            .setFontSize(45)
            .setPosition(340, 470) //without Sound
            //.setPosition(290, 320) //with Sound
            .setSize(140, 45)
            .setAlign('left');

        /** Help Button Event -> Help Scene @event */
        goog.events.listen(helpButton, ['touchstart', 'mousedown'], function() {
            self.obachtScene();
        });

        /** Credits Button */
        var infoButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('button_info.png'))
            .setPosition(300, 610) //without Sound
            //.setPosition(120, 460) //with Sound
            .setSize(174, 160);

        /** Credits Button Label */
        var infoLabel = new lime.Label()
            .setText('CREDITS')
            .setFontColor('#fff')
            .setFontSize(45)
            .setPosition(475, 610) //without Sound
            //.setPosition(290, 460) //with Sound
            .setSize(140, 45)
            .setAlign('left');

        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            self.creditsScene();
        });

        // /** Sound Button */
        // var soundButton = new lime.Sprite()
            // .setFill(obacht.spritesheet.getFrame('button_sound.png'))
            // .setPosition(120, 600)
            // .setSize(174, 160);
// 
        // var soundLabel = new lime.Label()
            // .setText('SOUND')
            // .setFontColor('#fff')
            // .setFontSize(45)
            // .setPosition(290, 600)
            // .setSize(140, 45)
            // .setAlign('left');
// 
        // // If Sound was remembered to be off, change the Display to OFF
        // if (!obacht.sound){
            // soundButton.setFill(obacht.spritesheet.getFrame('button_sound_off.png'));
        // }
// 
        // goog.events.listen(soundButton, ['touchstart', 'mousedown'], function() {
            // if (obacht.sound){
                // soundButton.setFill(obacht.spritesheet.getFrame('button_sound_off.png'));
                // obacht.sound = false;
                // localStorage.setItem("sound", "off");
                // obacht.menusound.stop();
                // log.debug('Sound OFF');
            // } else {
                // soundButton.setFill(obacht.spritesheet.getFrame('button_sound.png'));
                // obacht.sound = true;
                // localStorage.setItem("sound", "on");
                // obacht.menusound.play();
                // log.debug('Sound ON');
            // }
        // });



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
        //menuLayer.appendChild(soundButton);
        //menuLayer.appendChild(soundLabel);
        menuLayer.appendChild(wifiHint);

        // set current scene active
        obacht.director.replaceScene(menuScene);
    },

    /**
     * Obacht Explanation Scene
     *
     */
    obachtScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);

        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
           .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
           .setPosition(660, 130)
           .setSize(690, 94);

        /** Text Obacht **/
        var textObacht = new lime.Label()
            .setText('Ob•acht  [ˈoːbaχt] ')
            .setFontFamily('OpenSansBold')
            .setFontColor('#fff')
            .setFontSize(45)
            .setPosition(920, 300)
            .setSize(600, 45)
            .setAlign('left')

        var textObacht2 = new lime.Label()
            .setText('Bavarian exclamation for ‘Watch out!‘')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(33)
            .setLineHeight(1.3)
            .setPosition(870, 390)
            .setSize(500, 80)
            .setAlign('left')

        var textObacht3 = new lime.Label()
            .setText('Fast reaction is required in this game to save your Hogi‘s life.')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(33)
            .setLineHeight(1.3)
            .setPosition(845, 500)
            .setSize(450, 80)
            .setAlign('left')



        /** Hogi */
        var hogiSign = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('hogiSign.png'))
            .setPosition(-30, 220).setSize(614, 500)
            .setAnchorPoint(0,0);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.helpScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(hogiSign);
        menuLayer.appendChild(textObacht);
        menuLayer.appendChild(textObacht2);
        menuLayer.appendChild(textObacht3);


        // set current scene active
        obacht.director.replaceScene(menuScene);

    },

    /**
     * Help / Manual Scene
     *
     */
    helpScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);
        log.debug('helpScene()');


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        var textManualGeneral1a = new lime.Label()
            .setText('Two on-screen players each run on their own planet.')
            .setFontFamily('OpenSansBold')
            .setFontColor('#fff')
            .setFontSize(33)
            .setLineHeight(1.3)
            .setPosition(865, 250)
            .setSize(600, 33)
            .setAlign('left');


        var textManualGeneral1b = new lime.Label()
            .setText('This is where the fun starts!')
            .setFontFamily('OpenSansBold')
            .setFontColor('#fff')
            .setFontSize(33)
            .setLineHeight(1.3)
            .setPosition(865, 338)
            .setSize(600, 33)
            .setAlign('left');

        var textManualGeneral2 = new lime.Label()
            .setText('Take care of your ‘Hogi‘ and try to avoid running into traps.')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(33)
            .setLineHeight(1.3)
            .setPosition(865, 410)
            .setSize(600, 33)
            .setAlign('left');

        var textManualGeneral3 = new lime.Label()
            .setText('Even better, you can place traps in the way of your enemy‘s ‘Hogi‘ to make life difficult for him.')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(33)
            .setLineHeight(1.3)
            .setPosition(865, 520)
            .setSize(600, 33)
            .setAlign('left');

        /** Hogi */
        var hogi = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('hogi.png'))
            .setPosition(160, 256)
            .setSize(396, 475.2)
            .setAnchorPoint(0,0);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.obachtScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualWorldsScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(hogi);
        menuLayer.appendChild(textManualGeneral1a);
        menuLayer.appendChild(textManualGeneral1b);
        menuLayer.appendChild(textManualGeneral2);
        menuLayer.appendChild(textManualGeneral3);

        // set current scene active
        obacht.director.replaceScene(menuScene);

    },


    /**
     * Worlds Scene
     *
     */
    manualWorldsScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        /** Highlight Your Hogi **/
        var yourHogi = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('yourHogi.png'))
            .setPosition(409, 465)
            .setSize(240, 226);

        /** Highlight Enemy Hogi **/
        var enemyHogi = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('enemyHogi.png'))
            .setPosition(875, 375)
            .setSize(240, 226);

        // /** Highlight Animation **/
        // var fade = new lime.animation.Loop(new lime.animation.Sequence(
            // new lime.animation.ScaleTo(0.9).setDuration(1).setEasing(lime.animation.Easing.EASEOUT),
            // new lime.animation.ScaleTo(1).setDuration(1)
            // )
        // );
//
        // yourHogi.runAction(fade);
        // enemyHogi.runAction(fade);


        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 440)
            .setSize(710, 348.5);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.helpScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualHealthScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(yourHogi);
        menuLayer.appendChild(enemyHogi);



        // set current scene active
        obacht.director.replaceScene(menuScene);


    },


    /**
     * Manual Health Scene
     *
     */
     manualHealthScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        /** Highlight Your Life **/
        var yourLife = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('yourLife.png'))
            .setPosition(404, 573)
            .setSize(130, 120);

        /** Highlight Enemy Life **/
        var enemyLife = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('enemyLife.png'))
            .setPosition(493, 573)
            .setSize(130, 120);

        // /** Highlight Animation **/
        // var fade = new lime.animation.Loop(new lime.animation.Sequence(
            // new lime.animation.ScaleTo(0.90).setDuration(1).setEasing(lime.animation.Easing.EASEOUT),
            // new lime.animation.ScaleTo(1).setDuration(1)
            // )
        // );
//
        // yourLife.runAction(fade);
        // enemyLife.runAction(fade);


        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 440)
            .setSize(710, 348.5);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });


        /** Text Your Life **/
        var textYourLife = new lime.Label()
            .setText('Your Lives')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(50)
            .setPosition(280, 680)
            .setSize(600, 80)
            .setAlign('center');


        /** Text Enemy Life **/
        var textEnemyLife = new lime.Label()
            .setText('Enemy‘s Lives')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(50)
            .setPosition(645, 680)
            .setSize(600, 80)
            .setAlign('center');

        /** Be careful **/
        var beCareful = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('beCareful.png'))
            .setPosition(1080, 530)
            .setSize(302, 276);


        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.manualWorldsScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualObstaclesScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(enemyLife);
        menuLayer.appendChild(yourLife);
        menuLayer.appendChild(textYourLife);
        menuLayer.appendChild(textEnemyLife);
        menuLayer.appendChild(beCareful);


        // set current scene active
        obacht.director.replaceScene(menuScene);

    },


    /**
     * Manual Obstacles Scene
     *
     */
    manualObstaclesScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        var textAvoidCollision = new lime.Label()
            .setText('Avoid Collisions')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(62)
            .setPosition(640, 650)
            .setSize(600, 62)
            .setAlign('center');

        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 400)
            .setSize(710, 348.5);

        /** left hand **/
        var leftHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handLeft.png'))
            .setPosition(261, 517)
            .setSize(202, 406);

        /** right hand **/
        var rightHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handRight.png'))
            .setPosition(1020, 517)
            .setSize(202, 406);

        /** obstacles **/
        var obstacles = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obstacles.png'))
            .setPosition(620, 460)
            .setSize(204, 96);

        /** Highlight obstacles **/
        var highlightObstacleOne = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('yourLife.png'))
            .setPosition(550, 480)
            .setSize(130, 120);

        var highlightObstacleTwo = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('yourLife.png'))
            .setPosition(680, 455)
            .setSize(130, 120);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.manualCrouchScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualJumpScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(textAvoidCollision);
        menuLayer.appendChild(leftHand);
        menuLayer.appendChild(rightHand);
        menuLayer.appendChild(obstacles);
        menuLayer.appendChild(highlightObstacleOne);
        menuLayer.appendChild(highlightObstacleTwo);

        // set current scene active
        obacht.director.replaceScene(menuScene);

    },


    /**
     * Manual Jump Scene
     *
     */
    manualJumpScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        var textJump = new lime.Label()
            .setText('Tap to Jump')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(62)
            .setPosition(640, 650)
            .setSize(600, 62)
            .setAlign('center');

        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 400)
            .setSize(710, 348.5);

        /** left hand **/
        var leftHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handLeftJump.png'))
            .setPosition(300, 517)
            .setSize(282, 406);

        /** right hand **/
        var rightHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handRight.png'))
            .setPosition(1020, 517)
            .setSize(202, 406);

        /** tab **/
        var tab = new lime.Sprite()
            .setSize(206.4,192)
            .setFill(obacht.spritesheet.getFrame('tap.png'))
            .setPosition(420, 350);

        /** tabArea **/
        var tabArea = new lime.Sprite()
            .setSize(150,162)
            .setFill(obacht.spritesheet.getFrame('tapArea.png'))
            .setPosition(436, 324);

        /** tab Animation **/
        var fade = new lime.animation.Loop(new lime.animation.Sequence(
            new lime.animation.ScaleTo(1.1).setDuration(1).setEasing(lime.animation.Easing.EASEOUT),
            new lime.animation.ScaleTo(1).setDuration(1)
            )
        );

        tab.runAction(fade);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.manualHealthScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualCrouchScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(textJump);
        menuLayer.appendChild(tabArea);
        menuLayer.appendChild(tab);
        menuLayer.appendChild(leftHand);
        menuLayer.appendChild(rightHand);

        // set current scene active
        obacht.director.replaceScene(menuScene);

    },


    /**
     * Manual Crouch Scene
     *
     */
    manualCrouchScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        var textCrouch = new lime.Label()
            .setText('Hold to Crouch')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(62)
            .setPosition(640, 650)
            .setSize(600, 62)
            .setAlign('center');

        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 400)
            .setSize(710, 348.5);

        /** left hand **/
        var leftHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handLeftCrouch.png'))
            .setPosition(300, 517)
            .setSize(276, 406);

        /** right hand **/
        var rightHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handRight.png'))
            .setPosition(1020, 517)
            .setSize(202, 406);

        /** tab **/
        var tab = new lime.Sprite()
            .setSize(206.4,192)
            .setFill(obacht.spritesheet.getFrame('tap.png'))
            .setPosition(420, 475);

        /** tabArea **/
        var tabArea = new lime.Sprite()
            .setSize(150,162)
            .setFill(obacht.spritesheet.getFrame('tapArea.png'))
            .setPosition(436, 477);

        /** tab Animation **/
        var fade = new lime.animation.Loop(new lime.animation.Sequence(
            new lime.animation.ScaleTo(1.1).setDuration(1).setEasing(lime.animation.Easing.EASEOUT),
            new lime.animation.ScaleTo(1).setDuration(1)
            )
        );

        tab.runAction(fade);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.manualJumpScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualCollectBoniScene();
        });


        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(textCrouch);
        menuLayer.appendChild(tabArea);
        menuLayer.appendChild(tab);
        menuLayer.appendChild(leftHand);
        menuLayer.appendChild(rightHand);


        // set current scene active
        obacht.director.replaceScene(menuScene);

    },

    /**
     * Manual Collect Boni Scene
     *
     */
    manualCollectBoniScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        var textAvoidCollision = new lime.Label()
            .setText('COLLECT TRAPS')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(62)
            .setPosition(640, 650)
            .setSize(600, 62)
            .setAlign('center');

        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 400)
            .setSize(710, 348.5);

        /** left hand **/
        var leftHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handLeft.png'))
            .setPosition(261, 517)
            .setSize(202, 406);

        /** right hand **/
        var rightHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handRightCollect.png'))
            .setPosition(900, 517)
            .setSize(444, 406);

        /** boni **/
        var boni = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('collectObstacle.png'))
            .setPosition(640, 400)
            .setSize(130, 130);

        /** Be faster **/
        var beFaster = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('collectObstaclesHighlight.png'))
            .setPosition(1080, 530)
            .setSize(302, 276);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.manualObstaclesScene();
        });

        /** Arrow Next Scene */
        var arrowNext = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowNext.png')).setPosition(1200, 360).setSize(196,182);
        goog.events.listen(arrowNext, ['touchstart', 'mousedown'], function() {
            self.manualThrowBoniScene();
        });

        /** tab **/
        var tab = new lime.Sprite()
            .setSize(206.4,192)
            .setFill(obacht.spritesheet.getFrame('tap.png'))
            .setPosition(660, 420);


        /** tab Animation **/
        var fade = new lime.animation.Loop(new lime.animation.Sequence(
            new lime.animation.ScaleTo(1.1).setDuration(1).setEasing(lime.animation.Easing.EASEOUT),
            new lime.animation.ScaleTo(1).setDuration(1)
            )
        );

        tab.runAction(fade);

        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowNext);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(textAvoidCollision);
        menuLayer.appendChild(leftHand);
        menuLayer.appendChild(boni);
        menuLayer.appendChild(tab);
        menuLayer.appendChild(rightHand);
        menuLayer.appendChild(beFaster);

        // set current scene active
        obacht.director.replaceScene(menuScene);

    },


    /**
     * Manual Throw Boni Scene
     *
     */
    manualThrowBoniScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Manual */
        var headlineManual = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineManual.png'))
            .setPosition(660, 130)
            .setSize(690, 94);

        var textAvoidCollision = new lime.Label()
            .setText('Place TRAPS')
            .setFontFamily('Cartwheel')
            .setFontColor('#fff')
            .setFontSize(62)
            .setPosition(640, 650)
            .setSize(600, 62)
            .setAlign('center');

        /** Smartphone **/
        var smartphone = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('phone.png'))
            .setPosition(640, 400)
            .setSize(710, 348.5);

        /** left hand **/
        var leftHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handLeft.png'))
            .setPosition(261, 517)
            .setSize(202, 406);

        /** right hand **/
        var rightHand = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('handRightThrow.png'))
            .setPosition(1001, 505)
            .setSize(240, 430);

        /** throw obstacles **/
        var throwObstacles = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('throwObstacles.png'))
            .setPosition(718, 267)
            .setSize(380, 150);

        /** tab **/
        var tab = new lime.Sprite()
            .setSize(206.4,192)
            .setFill(obacht.spritesheet.getFrame('tap.png'))
            .setPosition(880, 280);

        /** tab Animation **/
        var fade = new lime.animation.Loop(new lime.animation.Sequence(
            new lime.animation.ScaleTo(1.1).setDuration(1).setEasing(lime.animation.Easing.EASEOUT),
            new lime.animation.ScaleTo(1).setDuration(1)
        )
        );

        tab.runAction(fade);

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** Arrow Previous Scene */
        var arrowPrevious = new lime.Sprite().setFill(obacht.spritesheet.getFrame('arrowPrevious.png')).setPosition(80, 360).setSize(196,182);
        goog.events.listen(arrowPrevious, ['touchstart', 'mousedown'], function() {
            self.manualCollectBoniScene();
        });



        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineManual);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(arrowPrevious);
        menuLayer.appendChild(smartphone);
        menuLayer.appendChild(textAvoidCollision);
        menuLayer.appendChild(leftHand);
        menuLayer.appendChild(tab);
        menuLayer.appendChild(throwObstacles);
        menuLayer.appendChild(rightHand);


        // set current scene active
        obacht.director.replaceScene(menuScene);

    },



    /**
     * Credits Scene
     *
     */
    creditsScene: function() {
        "use strict";
        var self = this;

        var menuScene = new lime.Scene();
        var menuLayer = new lime.Layer();
        menuScene.appendChild(menuLayer);
        log.debug('creditsScene()');


        ///////////////////////////////
        // Layer Content             //
        ///////////////////////////////

        /** Headline Credits */
        var headlineCredits = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('headlineCredits.png'))
            .setPosition(660, 130)
            .setSize(510, 116);

        var textCredits = new lime.Label()
            .setText('The mobile multiplayer game OBACHT was developed by a project team at the Augsburg University of Applied Sciences.')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(30)
            .setPosition(640, 230)
            .setSize(1100, 30)
            .setAlign('center')
            .setLineHeight(1.3);

        var textMartinLukas = new lime.Label()
            .setText('Martin Hofmann | Lukas Jaborsky')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(28)
            .setPosition(640, 390)
            .setSize(710, 28)
            .setAlign('center');

        var textFabianAlina = new lime.Label()
            .setText('Fabian B\u00fchler | Alina Fink')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(28)
            .setPosition(640, 540)
            .setSize(710, 28)
            .setAlign('center');

        var textEduardSimon = new lime.Label()
            .setText('Eduard Heitz | Simon Heimler')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(28)
            .setPosition(640, 440)
            .setSize(710, 28)
            .setAlign('center');

        var textSebastianClaudia = new lime.Label()
            .setText('Sebastian Huber | Claudia K\u00f6lbl')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(28)
            .setPosition(640, 490)
            .setSize(710, 28)
            .setAlign('center');

        var textProfs = new lime.Label()
            .setText('Prof. Dr. Wolfgang Kowarschick | Prof. Michael Stoll')
            .setFontFamily('OpenSansRegular')
            .setFontColor('#fff')
            .setFontSize(28)
            .setPosition(640, 340)
            .setSize(900, 28)
            .setAlign('center');


        /** Credits PNG */
        var credits = new lime.Sprite()
            .setFill(obacht.spritesheet
                .getFrame('credits.png'))
            .setPosition(640, 540).setSize(1280, 360);


        /** Back Button */
        var backButton = new lime.Sprite().setFill(obacht.spritesheet.getFrame('back.png')).setPosition(75, 75).setSize(80, 96);
        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });


        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////

        menuLayer.appendChild(headlineCredits);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(textCredits);
        menuLayer.appendChild(textFabianAlina);
        menuLayer.appendChild(textEduardSimon);
        menuLayer.appendChild(textSebastianClaudia);
        menuLayer.appendChild(textMartinLukas);
        menuLayer.appendChild(textProfs);
        menuLayer.appendChild(credits);

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
        log.debug('newGameScene()');


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
            obacht.mp.events.subscribeOnce('room_detail', function() {
                obacht.mp.playerReady();
                self.waitForPlayerScene();
            });
            obacht.mp.findMatch();
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
        log.debug('selectThemeScene()');


        ///////////////////////////////
        // Scene Content             //
        ///////////////////////////////

        /** Small Logo */
        var logoSmall = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('obacht_small.png'))
            .setPosition(640, 130)
            .setSize(544, 114);

        /** Back Button */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('back.png'))
            .setPosition(75, 75)
            .setSize(80, 96);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.newGameScene();
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
        log.debug('getCodeScene()');

        var popupActive = false;

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


        /** Pop-up-Infotext */
        var popupButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('code_info_small.png'))
            .setPosition(1000, 290)
            .setSize(338, 234)
            .setHidden(true);

        var popupLabel = new lime.Label()
            .setText('PLEASE GIVE THIS CODE TO YOUR FRIEND')
            .setFontColor('#fff')
            .setFontSize(36)
            .setPosition(1018, 304)
            .setSize(280, 150)
            .setAlign('center')
            .setHidden(true);



        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(character);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(codeLabel);
        menuLayer.appendChild(field);
        menuLayer.appendChild(code);
        menuLayer.appendChild(infoButton);
        menuLayer.appendChild(popupButton);
        menuLayer.appendChild(popupLabel);


        /** Show/Hide Pop-up @event */
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            popupButton.setHidden(true);
            popupLabel.setHidden(true);
        });

        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            if (popupActive === true)
            {
                popupActive = false;
                popupButton.setHidden(true);
                popupLabel.setHidden(true);

            }else{
                popupActive = true;
                popupButton.setHidden(false);
                popupLabel.setHidden(false);

            }

        });


        // Set Creating Player Ready
        obacht.mp.playerReady();


        ///////////////////////////////
        // Draw Scene                //
        ///////////////////////////////



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
        log.debug('joinGameScene()');

        var popupActive = false;


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

        /** Pop-up-Infotext */
        var popupButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('code_info_big.png'))
            .setPosition(1015, 318)
            .setSize(376, 326)
            .setHidden(true);

        var popupLabel = new lime.Label().setText('ENTER THE FOUR DIGIT CODE YOU GOT FROM YOUR FRIEND')
            .setFontColor('#fff')
            .setFontSize(36)
            .setPosition(1036, 295).setSize(280, 150).setAlign('center')
            .setHidden(true);

        /** Show/Hide Pop-up @event */
        goog.events.listen(popupButton, ['touchstart', 'mousedown'], function() {
            popupButton.setHidden(true);
            popupLabel.setHidden(true);
        });

        goog.events.listen(infoButton, ['touchstart', 'mousedown'], function() {
            if (popupActive === true)
            {
                popupActive = false;
                popupButton.setHidden(true);
                popupLabel.setHidden(true);

            }else{
                popupActive = true;
                popupButton.setHidden(false);
                popupLabel.setHidden(false);

            }

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
                .setSize(80, 70)
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
            .setSize(80, 70)
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

        menuLayer.appendChild(logoSmall);
        menuLayer.appendChild(backButton);
        menuLayer.appendChild(infoButton);
        menuLayer.appendChild(popupButton);
        menuLayer.appendChild(popupLabel);
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

        function checkSound() {
            function getPin() {
                return codeArray[0] + '' + codeArray[1] + '' + codeArray[2] + '' + codeArray[3];
            }
        }


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
                obacht.showPopup('joinGameScene', 'Pin not valid!');
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
        log.debug('gameOverScene()');

        obacht.mp.events.subscribeOnce('join_room', function() {
            alreadyJoined = true;
        });

        obacht.mp.leaveRoom(obacht.mp.roomDetail.pin);

        obacht.cleanUp();


        ///////////////////////////////
        // Play Again                //
        ///////////////////////////////

        /** Play Again Button */
        var playAgainButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('options.png'))
            .setPosition(640, 600)
            .setSize(430, 138);

        var playAgainLabel = new lime.Label()
            .setText('Play Again')
            .setFontColor('#fff')
            .setFontSize(60)
            .setPosition(640, 600)
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

        /** Back Button - Door */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('exit.png'))
            .setPosition(65, 75)
            .setSize(92, 112);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            self.mainMenuScene();
        });

        /** You Win */
        var youWin = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('you_win.png'))
            .setPosition(640, 360)
            .setSize(942, 200);

        /** You Lose */
        var youLose = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('you_lose.png'))
            .setPosition(640, 360)
            .setSize(1020, 198);


        ///////////////////////////////
        // Draw Scene              //
        ///////////////////////////////

        if (data.pid === obacht.mp.pid) {
            menuLayer.appendChild(youLose);
            menuLayer.appendChild(playAgainButton);
            menuLayer.appendChild(playAgainLabel);
        } else {
            menuLayer.appendChild(youWin);
            menuLayer.appendChild(playAgainButton);
            menuLayer.appendChild(playAgainLabel);
        }

        menuLayer.appendChild(backButton);

        obacht.director.replaceScene(gameoverScene);

        if (data.reason === 'player_left') {
            obacht.showPopup('mainMenuScene', 'Player left the game!');
        }

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
        log.debug('waitForPlayerScene()');


        ///////////////////////////////
        // Scene Content             //
        ///////////////////////////////

        /** Waiting Graphic */
        var waiting = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('wait.png'))
            .setPosition(640, 360)
            .setSize(556, 186);

        /** Back Button */
        var backButton = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('back.png'))
            .setPosition(75, 75)
            .setSize(80, 96);

        goog.events.listen(backButton, ['touchstart', 'mousedown'], function() {
            obacht.mp.events.clear('room_detail');
            self.newGameScene();
        });


        ///////////////////////////////
        // Draw the Scene            //
        ///////////////////////////////

        menuLayer.appendChild(waiting);
        menuLayer.appendChild(backButton);

        // set current scene active
        obacht.director.replaceScene(waitForPlayerScene);

    },


    /////////////////////////////
    // Helper Functions        //
    /////////////////////////////

    /**
     * Resets the Menu State and subscribed Events
     */
    resetMenu: function() {
        "use strict";
        // Reset Variables and Event Listeners
        obacht.mp.events.clear('join_room');
        obacht.mp.events.clear('room_detail');
        obacht.mp.events.clear('room_invite');
    },

    checkSound: function() {
        "use strict";


        ///////////////////////////////
        // Play Menu Sound           //
        ///////////////////////////////

        lime.scheduleManager.scheduleWithDelay(function(){
            if(obacht.menusound.isPlaying()===true && obacht.sound===false){
                obacht.menusound.stop();
            }
            if(obacht.menusound.isPlaying()===false && obacht.sound===true){
                obacht.menusound.play();
            }
            if(obacht.gamesound.isPlaying()===true){
                obacht.gamesound.stop();
            }
        },obacht.menusound,obacht.gamesound,obacht.sound,150);
    },



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

