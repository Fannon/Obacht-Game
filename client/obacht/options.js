/* global goog, obacht */
/* jshint strict: false */

goog.provide('obacht.options');

/**
 * Options for the game
 *
 * @singleton
 * @global
 */
obacht.options = {
    graphics: {
        VIEWPORT_WIDTH: 1280,
        VIEWPORT_HEIGHT: 720,
        DEFAULT_RENDERER: 'CANVAS'
    },

    sound: {
        music: true,
        sound: true,
        vibration: true
    },

    world: {
        size: {
            ground: 1470,
            landscapeA: 1590,
            landscapeB: 1680,
            clouds: 1750
        },
        bottom: {
            x: 0,
            y: 1960,
            rotation1: 0,
            rotation2: 90,
            startRotation1: 90,
            startRotation2: 180
        },
        top: {
            x: 1280,
            y: -1240,
            rotation1: 225,
            rotation2: 315,
            startRotation1: 135,
            startRotation2: 225
        },
        spinDuration: {
            front: 20,
            middle: 35,
            clouds: 75
        }
    },
    player: {
        general: {
            width: 235*0.7,
            height: 300*0.7,
            jumpUpDuration: 0.2,
            jumpDownDuration: 0.35,
            jumpHeight: 280,
            crouchDuration: 0.1,
            crouchWidth: 1.6,
            crouchHeight: 0.5,
            maxHealth: 3
        },
        //Noch nicht aktiv
        boundingBoxes: [
            {x: 5, y: 10, width: 210*0.7, height: 290*0.7}
        ],
        own: {
            x: 150,
            y: 550
        },
        enemy: {
            x: 1130,
            y: 170
        },
        stateVar: {
            isJumping: false
        }
    },

    playerController: {
        tapToleranceArea: 70
    },

    inventory: {
        size: 120,
        y: 20,

        left: {
			x: 880,
			active: false,
			type: 'none'
        },
        center: {
			x: 1010,
			active: false,
			type: 'none'
        },
        right: {
			x: 1140,
			active: false,
			type: 'none'
        }
    },

    trap: {
        general: {
            width: 200*0.7,
            height: 200*0.7
        },
        own: {
            x: 350,
            y: 550,
            angle: 45
        },
        enemy: {
            x: 1130,
            y: 170,
            angle: 45
        }
    },
    bonus: {
        general: {
            size: 200,
            x: 540,
            y: 260,
            type: '',
            state: 'new',
            path: 'assets/boni/', //all files musst be a png file
            displayTime: 5000
        }
    },
    "server": {
        "url": "http://obacht.informatik.hs-augsburg.de:8080"
//      "url": "http://192.168.2.100:8080/"
    }
};
