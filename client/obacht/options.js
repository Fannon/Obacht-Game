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
    debug: {
        logLevel: 0,
        fastStart: false,
        displayFps: true
    },
    graphics: {
        VIEWPORT_WIDTH: 1280,
        VIEWPORT_HEIGHT: 720,
        DEFAULT_RENDERER: 'CANVAS',
        worldQualityA: 0.3,
        worldQualityB: 0.3,
        worldQualityC: 0.2,
        characterQuality: 1.0,
        trapQuality: 1.0,
        bonusQuality: 1.0
    },
    sound: {
        music: true,
        sound: true,
        vibration: true
    },
    gameplay: {
        countdownInterval: 1000,
        initialSpeedFactor: 1.0,
        decrementSpeedFactorTime: 5000,
        decrementSpeedFactor: 0.01,
        generateBoniMinInterval: 10000,
        generateBoniMaxInterval: 20000,
        generateTrapsMinInterval: 1000,
        generateTrapsMaxInterval: 5000,
        distanceOffset: 0
    },
    world: {
        size: {
            ground: 1590,
            landscape: 1680,
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
            front: 20 * 0.8,
            middle: 35 * 0.8,
            clouds: 75 * 0.8
        }
    },
    player: {
        general: {
            width: 235*0.7,
            height: 300*0.7,
            jumpUpDuration: 0.45,
            jumpDownDuration: 0.45,
            jumpHeight: 320,
            crouchDuration: 0.1,
            crouchWidth: 1.6,
            crouchHeight: 0.5,
            maxHealth: 3,
            anchorx: 0,
            anchory: 1
        },
        boundingBoxes: [
            {x: 5, y: 10, width: 200*0.7, height: 280*0.7}
        ],
        location: {
            bottom: {
                x: 135,
                y: 580
            },
            top: {
                x: 1145,
                y: 140
            }
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
            factorlow: 895,
            factorhigh: 1025,
            anchorx: 0,
            anchory: 1,
            millesecondsmove: 25,
            anglespeed: 0.015,
            clearTimeout: 7000
        },
        own: {
            x: 100,
            y: 1470,
            angle: 45
        },
        enemy: {
            x: 1180,
            y: -750,
            angle: -45
        }
    },
    collisions: {
        checkInterval: 100
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
