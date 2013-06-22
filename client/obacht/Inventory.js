/* global goog, lime, obacht, log */

goog.provide('obacht.Inventory');

goog.require('lime.RoundedRect');


/**
 * Inventory Object.
 *
 * @constructor
 *
 * @author Lukas Jaborsky
 */

/**
 *
 * @param currentGame
 * @constructor
 */
obacht.Inventory = function(currentGame) {
    "use strict";

    var self = this;
    this.spritesheet = currentGame.spritesheet;


    //////////////////////////
    // INVENTORY ARRAY      //
    //////////////////////////

    /**
     * Trays Array: 3 Inventory Slots
     * @type {Array}
     */
    this.trays = [
        {},
        {},
        {}
    ];


    //////////////////////////
    // DRAW INVENTORY       //
    //////////////////////////

    for (var i = 0; i < this.trays.length; i++) {

        this.trays[i].type = 'none';
        this.trays[i].button = new lime.RoundedRect()
            .setSize(obacht.options.inventory.size, obacht.options.inventory.size)
            .setPosition(obacht.options.inventory.startAtX - (obacht.options.inventory.decrementX * i), obacht.options.inventory.y)
            .setFill(this.spritesheet.getFrame('boni_none.png'))
            .setOpacity(0.5)
            .setAnchorPoint(0, 0)
            .setRadius(15)
            .setRenderer(obacht.renderer.inventory);

        // TODO: Use PlayerController Layer (?)
        obacht.playerController.layer.appendChild(this.trays[i].button);

    }


    //////////////////////////
    // EVENT LISTENERS      //
    //////////////////////////

    goog.events.listen(this.trays[0].button, ['touchstart', 'mousedown'], function() {
        self.throwTrap(0);
    });

    goog.events.listen(this.trays[1].button, ['touchstart', 'mousedown'], function() {
        self.throwTrap(1);
    });

    goog.events.listen(this.trays[2].button, ['touchstart', 'mousedown'], function() {
        self.throwTrap(2);
    });

    obacht.mp.events.subscribe('receive_bonus', function(type, success) {

        if (success) {
            log.debug('Won Bonus: Type: ' + type);
            self.fillTray(type);
        } else {

            var tooSlow = new lime.Sprite()
                .setFill(obacht.spritesheet.getFrame('tooSlow.png'))
                .setPosition(640, 360)
                .setSize(obacht.spritesheet.getFrame('tooSlow.png').csize_.width * 2, obacht.spritesheet.getFrame('tooSlow.png').csize_.height * 2);

            currentGame.layer.appendChild(tooSlow);
            obacht.timeout(function() {
                currentGame.layer.removeChild(tooSlow);
            }, obacht.options.gameplay.displayMessageTime);
        }
    });

};

obacht.Inventory.prototype = {

    /**
     * Throws Trap on Inventory Tray, if available.
     *
     * @param {Number} tray Tray Number
     */
    throwTrap: function(tray) {
        "use strict";

        var type = this.trays[tray].type;

        if (type !== 'none') {
            log.debug('Trowing Trap from Inventory at ' + tray + ': ' + type);
            obacht.mp.throwTrap(type, obacht.mp.enemy);
            this.setTray(tray, 'none');
        } else {
            log.debug('Cannot Throw Trap at ' + tray + ': Tray empty.');
        }

    },

    /**
     * Fills a received Bonus into the Inventory, if there's space for it
     *
     * @param {String} type Type of trap
     */
    fillTray: function(type) {
        "use strict";
        for (var i = 0; i < this.trays.length; i++) {
            if (this.trays[i].type === 'none') {
                this.setTray(i, type);
                return true;
            }
        }
        var noSpaceLeft = new lime.Sprite()
            .setFill(obacht.spritesheet.getFrame('noSpaceLeft.png'))
            .setPosition(640, 360)
            .setSize(obacht.spritesheet.getFrame('noSpaceLeft.png').csize_.width * 2, obacht.spritesheet.getFrame('noSpaceLeft.png').csize_.height * 2);

        obacht.currentGame.layer.appendChild(noSpaceLeft);
        obacht.timeout(function() {
            obacht.currentGame.layer.removeChild(noSpaceLeft);
        }, obacht.options.gameplay.displayMessageTime);

        log.debug('Could not fill Tray: No Space left.');
        return false;
    },

    /**
     * Sets the Tray Icon and Content
     *
     * @param {Number} tray Number of the inventory tray
     * @param {String} type Type of the trap
     */
    setTray: function(tray, type) {
        "use strict";
        log.debug('Filled Tray at ' + tray + ' with: ' + type);
        this.trays[tray].type = type;
        this.trays[tray].button.setFill(this.spritesheet.getFrame('boni_' + type + '.png'));
    },

    /**
     * Destructor - Cleans up all Lime Elements and DataStructures
     */
    destruct: function() {

    }

};
