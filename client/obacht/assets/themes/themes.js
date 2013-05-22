/* global goog, obacht */

goog.provide('obacht.themes');

var defaultTheme = 'desert'; // meadow, desert, water, candy
obacht.themes = {};
obacht.themes.availableThemes = ['meadow', 'desert', 'water'];
obacht.themes.path = {
    ground: 'assets/themes/' + defaultTheme + '/ground.png',
    landscapeA: 'assets/themes/' + defaultTheme + '/landscapeA.png',
    landscapeB: 'assets/themes/' + defaultTheme + '/landscapeB.png',
    clouds: 'assets/themes/' + defaultTheme + '/clouds.png',
    sky: 'assets/themes/' + defaultTheme + '/sky.jpg'
};

obacht.themes.setTheme = function(theme) {
    "use strict";
    obacht.themes = {
        path: {
            ground: 'assets/themes/' + theme + '/ground.png',
            landscapeA: 'assets/themes/' + theme + '/landscapeA.png',
            landscapeB: 'assets/themes/' + theme + '/landscapeB.png',
            clouds: 'assets/themes/' + theme + '/clouds.png',
            sky: 'assets/themes/' + theme + '/sky.jpg'
        }
    };
};

var themes_temp = {
    'water': {
        world: {
            files: {
                ground: 'assets/themes/water/ground.png',
                landscapeA: 'assets/themes/water/landscapeA.png',
                landscapeB: 'assets/themes/water/landscapeB.png',
                clouds: 'assets/themes/water/clouds.png',
                sky: 'assets/themes/water/sky.jpg'
            }
        },
        traps: {
            kaktus: {
                file: '../Kaktus.png',
                position: 'ground',
                width: 128,
                height: 30,
                boundingBoxes:
                [
                    {x: 0, y: 15, width: 128, height: 15}, // sample values
                    {x: 12, y: 24, width: 24, height: 25}
                ]
            }
        },
        boni: {
            kaktus: {
                file: '../KaktusBonus.png'
            }
        }
    },
    'desert': {

    }
};
