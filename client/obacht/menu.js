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

//BIG LOGO FOR LOADING-SCREEN
        // var logo_big = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(190, -750).setAnchorPoint(0, 0);
        // layerMenu.appendChild(logo_big);
        // var mask_logo_big = new lime.Sprite().setPosition(640, 360).setAnchorPoint(0.5,0.5).setSize(1000, 200);
        // layerMenu.appendChild(mask_logo_big);
        // logo_big.setMask(mask_logo_big);
        
        
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

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

		//Small Logo
        var logo_small = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(360, -570).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_small);
        var mask_logo_small = new lime.Sprite().setPosition(640, 130).setAnchorPoint(0.5,0.5).setSize(600, 150);
        layerMenu.appendChild(mask_logo_small);
        logo_small.setMask(mask_logo_small);
       
        //Play-Button
        var playButton = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-760, 65).setAnchorPoint(0, 0);
        layerMenu.appendChild(playButton);
        var mask_playButton = new lime.Sprite().setPosition(640, 338).setAnchorPoint(0.5,0.5).setSize(400, 200);
        layerMenu.appendChild(mask_playButton);
        playButton.setMask(mask_playButton);                
        var playButton_label = new lime.Label().setText('PLAY').setFontColor('#fff').setFontSize(90).setPosition(640, 348);
        layerMenu.appendChild(playButton_label);
        goog.events.listen(mask_playButton, lime.Button.Event.CLICK, function() {
            that.newGameScene();
        });

        //Help-Button
        var help = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-458, 80).setAnchorPoint(0, 0);
        layerMenu.appendChild(help);
        var mask_help = new lime.Sprite().setPosition(315, 540).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask_help);
        help.setMask(mask_help);
        var labelHelp = new lime.Label().setText('HELP').setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(309, 650).setFontColor('#fff');
        layerMenu.appendChild(labelHelp);
                
        //Credits-Button
        var credits = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-432, 80).setAnchorPoint(0, 0);
        layerMenu.appendChild(credits);
        var mask_credits = new lime.Sprite().setPosition(538, 540).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask_credits);
        credits.setMask(mask_credits);
        var labelCredits = new lime.Label().setText('CREDITS').setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(525, 650).setFontColor('#fff');
        layerMenu.appendChild(labelCredits);
        
        //Sound-Button
        var sound = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-500, -163).setAnchorPoint(0, 0);
        layerMenu.appendChild(sound);
        var mask_sound = new lime.Sprite().setPosition(753, 540).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask_sound);
        sound.setMask(mask_sound);
        var labelSound = new lime.Label().setText('SOUND').setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(749, 650).setFontColor('#fff');
        layerMenu.appendChild(labelSound);

        //Quit-Button
        var quit = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-350, 80).setAnchorPoint(0, 0);
        layerMenu.appendChild(quit);
        var mask_quit = new lime.Sprite().setPosition(963, 540).setAnchorPoint(0.5,0.5).setSize(170, 170);
        layerMenu.appendChild(mask_quit);
        quit.setMask(mask_quit);
        var labelQuit = new lime.Label().setText('QUIT').setFontSize(45).setAnchorPoint(0.5, 0.5).setPosition(963, 650).setFontColor('#fff');
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

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

		//Small Logo
        var logo_small = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(360, -570).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_small);
        var mask_logo_small = new lime.Sprite().setPosition(640, 130).setAnchorPoint(0.5,0.5).setSize(600, 150);
        layerMenu.appendChild(mask_logo_small);
        logo_small.setMask(mask_logo_small);
        
		//Back
        var back = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(10, 10).setAnchorPoint(0, 0);
        layerMenu.appendChild(back);
        var mask_back = new lime.Sprite().setPosition(0, 0).setAnchorPoint(0, 0).setSize(115, 115);
        layerMenu.appendChild(mask_back);
        back.setMask(mask_back);
        goog.events.listen(mask_back, lime.Button.Event.CLICK, function() {
            that.mainMenuScene();
        });

        //Create-Button
        var create = new lime.Sprite().setSize(1533, 1087).setFill('assets/gfx/menu_spritesheet.png').setPosition(-910, 400).setAnchorPoint(0, 0);
        layerMenu.appendChild(create);
        var mask_create = new lime.Sprite().setPosition(400, 480).setAnchorPoint(0.5,0.5).setSize(450, 160);
        layerMenu.appendChild(mask_create);
        create.setMask(mask_create);
        var create_label = new lime.Label().setText('CREATE').setFontColor('#fff').setFontSize(60).setPosition(390, 485);
        layerMenu.appendChild(create_label);
        goog.events.listen(mask_create, lime.Button.Event.CLICK, function() {
            that.getCodeScene();
        });

        //Join-Button
        var join = new lime.Sprite().setSize(1533, 1087).setFill('assets/gfx/menu_spritesheet.png').setPosition(-910, 515).setAnchorPoint(0, 0);
        layerMenu.appendChild(join);
        var mask_join = new lime.Sprite().setPosition(400, 600).setAnchorPoint(0.5,0.5).setSize(450, 160);
        layerMenu.appendChild(mask_join);
        join.setMask(mask_join); 
        var join_label = new lime.Label().setText('JOIN').setFontColor('#fff').setFontSize(60).setPosition(390, 600);
        layerMenu.appendChild(join_label);
        goog.events.listen(mask_join, lime.Button.Event.CLICK, function() {
            that.join();
        });

        //Random-Button
        var random = new lime.Sprite().setSize(1533, 1087).setFill('assets/gfx/menu_spritesheet.png').setPosition(-440, 400).setAnchorPoint(0, 0);
        layerMenu.appendChild(random);
        var mask_random = new lime.Sprite().setPosition(870, 480).setAnchorPoint(0.5,0.5).setSize(450, 160);
        layerMenu.appendChild(mask_random);
        random.setMask(mask_random);   
        var random_label = new lime.Label().setText('PLAY').setFontColor('#fff').setFontSize(60).setPosition(870, 485);
        layerMenu.appendChild(random_label);
        goog.events.listen(mask_random, lime.Button.Event.CLICK, function() {
            that.loadGame();
        });

        //Play_with_your_friend-Text
        var friendIcon = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-680, 65).setAnchorPoint(0, 0);
        layerMenu.appendChild(friendIcon);
        var mask_friendIcon = new lime.Sprite().setPosition(410, 310).setAnchorPoint(0.5,0.5).setSize(220, 220);
        layerMenu.appendChild(mask_friendIcon);
        friendIcon.setMask(mask_friendIcon);
        var text_friendsGame = new lime.Label().setAlign('center').setText('PLAY WITH YOUR FRIEND').setFontColor('#fff').setFontSize(35).setSize(500, 55).setPosition(400, 350);
        layerMenu.appendChild(text_friendsGame);

        //Random_Game-Text
        var randomIcon = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-655, -180).setAnchorPoint(0, 0);
        layerMenu.appendChild(randomIcon);
        var mask_randomIcon = new lime.Sprite().setPosition(880, 310).setAnchorPoint(0.5,0.5).setSize(240, 220);
        layerMenu.appendChild(mask_randomIcon);
        randomIcon.setMask(mask_randomIcon);
        var text_randomIcon = new lime.Label().setAlign('center').setText('RANDOM GAME').setFontColor('#fff').setFontSize(35).setSize(700, 55).setPosition(885, 350);
        layerMenu.appendChild(text_randomIcon);

    },

    getCodeScene: function() {
        "use strict";
        var that = this;

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

		//Small Logo
        var logo_small = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(360, -570).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_small);
        var mask_logo_small = new lime.Sprite().setPosition(640, 130).setAnchorPoint(0.5,0.5).setSize(600, 150);
        layerMenu.appendChild(mask_logo_small);
        logo_small.setMask(mask_logo_small);

		//Back
        var back = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(10, 10).setAnchorPoint(0, 0);
        layerMenu.appendChild(back);
        var mask_back = new lime.Sprite().setPosition(0, 0).setAnchorPoint(0, 0).setSize(115, 115);
        layerMenu.appendChild(mask_back);
        back.setMask(mask_back);
        goog.events.listen(mask_back, lime.Button.Event.CLICK, function() {
            that.newGameScene();
        });
        
        //Your_Code-Text and Code_Field
        var yourCode= new lime.Label().setAlign('center').setText('YOUR CODE').setFontColor('#fff').setFontSize(50).setSize(300, 90).setPosition(640, 320);
        layerMenu.appendChild(yourCode);

        var field = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(290, 315).setAnchorPoint(0, 0);
        layerMenu.appendChild(field);
        var mask_field = new lime.Sprite().setPosition(640, 405).setAnchorPoint(0.5,0.5).setSize(480, 160);
        layerMenu.appendChild(mask_field);
        field.setMask(mask_field);
        
        //small Infotext Icon
        var infoIcon = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-350, 215).setAnchorPoint(0, 0);
        layerMenu.appendChild(infoIcon);
        var mask_infoIcon = new lime.Sprite().setPosition(805, 265).setAnchorPoint(0.5,0.5).setSize(90, 90);
        layerMenu.appendChild(mask_infoIcon);
        infoIcon.setMask(mask_infoIcon);
        
        //Pop-up-Infotext
        var popInfo = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(820, -190).setAnchorPoint(0, 0);
        layerMenu.appendChild(popInfo);
        var mask_popInfo = new lime.Sprite().setPosition(1000, 260).setAnchorPoint(0.5,0.5).setSize(350, 260);
        layerMenu.appendChild(mask_popInfo);
        popInfo.setMask(mask_popInfo);
        var CodeInfotext = new lime.Label().setAlign('center').setText('PLEASE GIVE THIS CODE TO YOUR FRIEND').setFontColor('#fff').setFontSize(36).setSize(280, 55).setPosition(1018, 250);
        layerMenu.appendChild(CodeInfotext);

        var code_label = new lime.Label().setText('5 6 8 7').setFontColor('#fff').setFontSize(90).setPosition(640, 425).setSize(400, 130);
        layerMenu.appendChild(code_label);

        //Next-Button
        var next = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(85, -276).setAnchorPoint(0, 0);
        layerMenu.appendChild(next);
        var mask_next = new lime.Sprite().setPosition(640, 640).setAnchorPoint(0.5,0.5).setSize(350, 130);
        layerMenu.appendChild(mask_next);
        next.setMask(mask_next);
        var next_label = new lime.Label().setAlign('center').setText('NEXT').setFontColor('#fff').setFontSize(40).setSize(700, 55).setPosition(640, 650);
        layerMenu.appendChild(next_label);
        goog.events.listen(mask_next, lime.Button.Event.CLICK, function() {
            that.selectThemeScene();
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

        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

		//Small Logo
        var logo_small = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(360, -570).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_small);
        var mask_logo_small = new lime.Sprite().setPosition(640, 130).setAnchorPoint(0.5,0.5).setSize(600, 150);
        layerMenu.appendChild(mask_logo_small);
        logo_small.setMask(mask_logo_small);

		//Back
        var back = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(10, 10).setAnchorPoint(0, 0);
        layerMenu.appendChild(back);
        var mask_back = new lime.Sprite().setPosition(0, 0).setAnchorPoint(0, 0).setSize(115, 115);
        layerMenu.appendChild(mask_back);
        back.setMask(mask_back);
        goog.events.listen(mask_back, lime.Button.Event.CLICK, function() {
            that.getCodeScene();
        });
        
        
        //Select_World-Text
        var selectWorld = new lime.Label().setAlign('center').setText('SELECT A WORLD').setFontColor('#fff').setFontSize(50).setSize(400, 55).setPosition(640, 250);
        layerMenu.appendChild(selectWorld);

		//Theme-Desert
        var desert = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-177, -65).setAnchorPoint(0, 0);
        layerMenu.appendChild(desert);
        var mask_desert = new lime.Sprite().setPosition(340, 425).setAnchorPoint(0.5,0.5).setSize(300, 300);
        layerMenu.appendChild(mask_desert);
        desert.setMask(mask_desert);
        goog.events.listen(mask_desert, lime.Button.Event.CLICK, function() {
            that.loadGame();
        });
                
		//Theme-Water
        var water = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-675, -510).setAnchorPoint(0, 0);
        layerMenu.appendChild(water);
        var mask_water = new lime.Sprite().setPosition(640, 425).setAnchorPoint(0.5,0.5).setSize(300, 300).setStroke(7,'#fff');
        layerMenu.appendChild(mask_water);
        water.setMask(mask_water);
        goog.events.listen(mask_water, lime.Button.Event.CLICK, function() {
            that.loadGame();
        });
                
		//Theme-Meadow
        var meadow = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-60, -273).setAnchorPoint(0, 0);
        layerMenu.appendChild(meadow);
        var mask_meadow = new lime.Sprite().setPosition(940, 425).setAnchorPoint(0.5,0.5).setSize(300, 300).setStroke(7,'#fff');
        layerMenu.appendChild(mask_meadow);
        meadow.setMask(mask_meadow);
        goog.events.listen(mask_meadow, lime.Button.Event.CLICK, function() {
            that.loadGame();
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
        var codeArray = ['_','_','_','_'];

        var code_label = [4];
        code_label[0] = new lime.Label().setText(codeArray[0]).setFontColor('#fff').setFontSize(90).setPosition(490, 425).setSize(100, 130);
        code_label[1] = new lime.Label().setText(codeArray[1]).setFontColor('#fff').setFontSize(90).setPosition(590, 425).setSize(100, 130);
        code_label[2] = new lime.Label().setText(codeArray[2]).setFontColor('#fff').setFontSize(90).setPosition(690, 425).setSize(100, 130);
        code_label[3] = new lime.Label().setText(codeArray[3]).setFontColor('#fff').setFontSize(90).setPosition(790, 425).setSize(100, 130);        
        
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
        var getPin = function() {
            return codeArray[0] + codeArray[1] + codeArray[2] + codeArray[3];
        };

        /**
        * Returns PIN with adequate spacing
        * @returns {string}
        */
        var redraw_Code = function() {
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
        * Draws Button for Keyboard Input
        *
        * @param {Number} x
        * @param {string} text
        *
        * @returns {*}
        */
        var drawKeyboardButton = function(x1, x2) {
	        var key = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(x1, -100).setAnchorPoint(0, 0);
	        layerMenu.appendChild(key);
	        var mask_key = new lime.Sprite().setPosition(x2, 530).setAnchorPoint(0.5,0.5).setSize(130, 130);
	        layerMenu.appendChild(mask_key);
	        key.setMask(mask_key);
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
            redraw_Code();   
        };

        /**
        * Backspace PIN (Deletes last entered PIN)
        */
        var deleteNumber = function() {
            codeArray[codeposition - 1] = '_';
            if (codeposition > 0) {
                codeposition--;
            }
            redraw_Code();
        };

        var startGame = function() {
            if (codeposition === 4) {
                that.loadGame(getPin());
            }
        };


        /////////////////////////////
        // Scene Content //
        /////////////////////////////

        var sceneMenu = new lime.Scene();

        // set current scene active
        obacht.director.replaceScene(sceneMenu);

        var layerMenu = new lime.Layer();
        sceneMenu.appendChild(layerMenu);

        // Background
        var background = new lime.Sprite().setSize(obacht.options.VIEWPORT_WIDTH, obacht.options.VIEWPORT_HEIGHT).setFill('assets/gfx/bg_clean.jpg').setPosition(0, 0).setAnchorPoint(0, 0);
        layerMenu.appendChild(background);

        //Small Logo
        var logo_small = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(360, -570).setAnchorPoint(0, 0);
        layerMenu.appendChild(logo_small);
        var mask_logo_small = new lime.Sprite().setPosition(640, 130).setAnchorPoint(0.5,0.5).setSize(600, 150);
        layerMenu.appendChild(mask_logo_small);
        logo_small.setMask(mask_logo_small);

		//Back
        var back = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(10, 10).setAnchorPoint(0, 0);
        layerMenu.appendChild(back);
        var mask_back = new lime.Sprite().setPosition(0, 0).setAnchorPoint(0, 0).setSize(115, 115);
        layerMenu.appendChild(mask_back);
        back.setMask(mask_back);
        goog.events.listen(mask_back, lime.Button.Event.CLICK, function() {
            that.newGameScene();
        });
        
        //Pop-up-Infotext
        var popInfo = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(220, 145).setAnchorPoint(0, 0);
        layerMenu.appendChild(popInfo);
        var mask_popInfo = new lime.Sprite().setPosition(1020, 315).setAnchorPoint(0.5,0.5).setSize(400, 370);
        layerMenu.appendChild(mask_popInfo);
        popInfo.setMask(mask_popInfo);
        var CodeInfotext = new lime.Label().setAlign('center').setText('ENTER THE FOUR DIGIT CODE YOU GOT FROM YOUR FRIEND').setFontColor('#fff').setFontSize(36).setSize(280, 55).setPosition(1040, 248);
        layerMenu.appendChild(CodeInfotext);
        
        //small Infotext Icon
        var infoIcon = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(-345, 215).setAnchorPoint(0, 0);
        layerMenu.appendChild(infoIcon);
        var mask_infoIcon = new lime.Sprite().setPosition(810, 265).setAnchorPoint(0.5,0.5).setSize(90, 90);
        layerMenu.appendChild(mask_infoIcon);
        infoIcon.setMask(mask_infoIcon);
                
       //Enter_Code-Text and Code_Field
        var enterCode= new lime.Label().setAlign('center').setText('ENTER CODE').setFontColor('#fff').setFontSize(50).setSize(300, 90).setPosition(640, 315);
        layerMenu.appendChild(enterCode);
        var field = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(290, 315).setAnchorPoint(0, 0);
        layerMenu.appendChild(field);
        var mask_field = new lime.Sprite().setPosition(640, 405).setAnchorPoint(0.5,0.5).setSize(480, 160);
        layerMenu.appendChild(mask_field);
        field.setMask(mask_field);
        redraw_Code();               
                
        /////////////////////////////
        // Create Buttons //
        /////////////////////////////

        //Number-Keys
        for (var i = 0; i < 10; i++) {
            keys[i] = drawKeyboardButton(startFrom1 + spacing * i, startFrom2 + spacing * i);
            layerMenu.appendChild(keys[i]);
            key_labels[i] = new lime.Label().setAlign('center').setText(i).setFontColor('#fff').setFontSize(70).setSize(95, 70).setPosition(startFrom2 + spacing * i,530);
            layerMenu.appendChild(key_labels[i]);
        }

        //Delete-Key
		var keyDelete = new lime.Sprite().setSize(1772, 1256).setFill('assets/gfx/menu_spritesheet.png').setPosition(0, 68).setAnchorPoint(0, 0);
		layerMenu.appendChild(keyDelete);
		var mask_keyDelete = new lime.Sprite().setPosition(1190, 530).setAnchorPoint(0.5,0.5).setSize(130, 130);
		layerMenu.appendChild(mask_keyDelete);
		keyDelete.setMask(mask_keyDelete);


        //Next-Button
        var next = new lime.Sprite().setSize(1704, 1208).setFill('assets/gfx/menu_spritesheet.png').setPosition(85, -276).setAnchorPoint(0, 0);
        layerMenu.appendChild(next);
        var mask_next = new lime.Sprite().setPosition(640, 640).setAnchorPoint(0.5,0.5).setSize(350, 130);
        layerMenu.appendChild(mask_next);
        next.setMask(mask_next);
        var next_label = new lime.Label().setAlign('center').setText('NEXT').setFontColor('#fff').setFontSize(40).setSize(700, 55).setPosition(640, 650);
        layerMenu.appendChild(next_label);



        /////////////////////////////
        // Register EventListeners //
        /////////////////////////////

        goog.events.listen(key_labels[0], lime.Button.Event.CLICK, function() {
            addNumber(0);
        });
        goog.events.listen(key_labels[1], lime.Button.Event.CLICK, function() {
            addNumber(1);
        });
        goog.events.listen(key_labels[2], lime.Button.Event.CLICK, function() {
            addNumber(2);
        });
        goog.events.listen(key_labels[3], lime.Button.Event.CLICK, function() {
            addNumber(3);
        });
        goog.events.listen(key_labels[4], lime.Button.Event.CLICK, function() {
            addNumber(4);
        });
        goog.events.listen(key_labels[5], lime.Button.Event.CLICK, function() {
            addNumber(5);
        });
        goog.events.listen(key_labels[6], lime.Button.Event.CLICK, function() {
            addNumber(6);
        });
        goog.events.listen(key_labels[7], lime.Button.Event.CLICK, function() {
            addNumber(7);
        });
        goog.events.listen(key_labels[8], lime.Button.Event.CLICK, function() {
            addNumber(8);
        });
        goog.events.listen(key_labels[9], lime.Button.Event.CLICK, function() {
            addNumber(9);
        });
        goog.events.listen(keyDelete, lime.Button.Event.CLICK, function() {
            deleteNumber();
        });
        goog.events.listen(mask_next, lime.Button.Event.CLICK, function() {
            startGame();
        });

    }
};