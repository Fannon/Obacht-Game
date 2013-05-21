/* global goog, obacht */

goog.provide('obacht.themes');

var defaultTheme = 'desert'; // meadow, desert, water, candy
obacht.themes = {};
obacht.themes.availableThemes = ['meadow', 'desert', 'water', 'candy'];
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

