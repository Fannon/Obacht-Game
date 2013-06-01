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
    fastStart: false,
    graphics: {
        VIEWPORT_WIDTH: 1280,
        VIEWPORT_HEIGHT: 720,
        DEFAULT_RENDERER: 'CANVAS',
        worldQuality: 0.5,
        characterQuality: 1.0
    },
    sound: {
        music: true,
        sound: true,
        vibration: true
    },
    gameplay: {
        initialSpeedFactor: 1.0,
        decrementSpeedFactorTime: 5000,
        decrementSpeedFactor: 0.01,
        generateBoniMinInterval: 10000,
        generateBoniMaxInterval: 20000,
        generateTrapsMinInterval: 1000,
        generateTrapsMaxInterval: 5000
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
        location: {
            bottom: {
                x: 150,
                y: 550
            },
            top: {
                x: 1130,
                y: 170
            }
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
            height: 200*0.7,
            factorlow: 1225,
            factorhigh: 1400
        },
        own: {
            x: 0,
            y: 1400,
            angle: 45,
            anchorx: 0,
            anchory: -2
        },
        enemy: {
            x: 0,
            y: 0,
            angle: 45,
            anchorx: 0.5,
            anchory: 0.5
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
            displayTime: 2000
        }
    },
    "server": {
        "url": "http://obacht.informatik.hs-augsburg.de:8080"
//      "url": "http://192.168.2.100:8080/"
    }
};
