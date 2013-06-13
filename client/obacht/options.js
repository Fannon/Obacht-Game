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
        displayFps: true,
        showBoundingBoxes: true,
        invincible: true
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

        generateBoniMinInterval: 4000,
        generateBoniMaxInterval: 10000,

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
            front: 7,
            middle: 15,
            clouds: 40
        }
    },
    player: {
        general: {
            width: 205,
            height: 240,
            jumpUpDuration: 0.4,
            jumpDownDuration: 0.6,
            jumpHeight: 325,
            crouchDuration: 0.1,
            crouchWidth: 1.6,
            crouchHeight: 0.5,
            maxHealth: 3,
            anchorx: 0,
            anchory: 1
        },
        boundingBoxes: [
            {x: 0, y: 30, width: 110, height: 180}
        ],
        location: {
            bottom: {
                x: 135,
                y: 560
            },
            top: {
                x: 1145,
                y: 160
            }
        }
    },
    playerController: {
        tapToleranceArea: 70
    },
    inventory: {
        size: 120,
        y: 20,
        startAtX: 1140,
        decrementX: 130
    },
    trap: {
        general: {
            groundPosition: 1005,
            airPosition: 1110,
            clearTimeout: 5000
        },
        bottom: {
            rotation: -45
        },
        top: {
            rotation: -225
        }
    },
    collisions: {
        checkInterval: 50
    },
    bonus: {
        general: {
            size: 200,
            x: 540,
            y: 260,
            type: '',
            state: 'new',
            displayTime: 2000
        }
    },
    "server": {
//        "url": "http://obacht.informatik.hs-augsburg.de:8080"
      "url": "http://192.168.2.100:8080/"
    }
};
