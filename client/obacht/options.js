/* global goog, obacht */
/* jshint strict: false */

goog.provide('obacht.options');

/**
 * Options for the game
 *
 * @singleton
 */
obacht.options = {
    graphics: {
        VIEWPORT_WIDTH: 1280,
        VIEWPORT_HEIGHT: 720
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
            rotation2: 90
        },
        top: {
            x: 1280,
            y: -1240,
            rotation1: 180,
            rotation2: 270
        },
        spinDuration: {
            front: 20,
            middle: 35,
            clouds: 75
        }
    },
    player: {
        general: {
            width: 120,
            height: 190,
            jumpUpDuration: 0.2,
            jumpDownDuration: 0.35,
            jumpHeight: 280,
            crouchDuration: 0.1,
            crouchWidth: 1.6,
            crouchHeight: 0.5
        },
        own: {
            x: 160,
            y: 570
        },
        enemy: {
            x: 1120,
            y: 150
        },
        stateVar: {
            isJumping: false
        }
    },

    playerController: {
        tapToleranceArea: 70
    },

    "trap": {

    },
    "bonus": {

    },
    "server": {
        "url": "http://192.168.2.100:8080/"
    }
};
