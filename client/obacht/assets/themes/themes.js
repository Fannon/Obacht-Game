/* global goog, obacht */

goog.provide('obacht.themes');

/**
 * Obacht Themes Data
 */
obacht.themes = {
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
            //Krebs
            crab: {
                file: '../crab.png',
                position: 'ground',
                width: 150,
                height: 91,
                boundingBoxes: [
                    {x: 1, y: 10, width: 26, height: 31},
                    {x: 21, y: 42, width: 26, height: 46},
                    {x: 47, y: 24, width: 63, height: 55},
                    {x: 110, y: 43, width: 28, height: 46},
                    {x: 123, y: 2, width: 26, height: 41}
                ]
            },

            //Anker
            anchor: {
                file: '../anchor.png',
                position: 'ground',
                width: 110,
                height: 120,
                boundingBoxes: [
                    {x: 0, y: 27, width: 29, height: 78},
                    {x: 72, y: 0, width: 30, height: 32},
                    {x: 49, y: 32, width: 32, height: 30},
                    {x: 35, y: 62, width: 28, height: 18},
                    {x: 29, y: 80, width: 79, height: 38}

                ]
            },

            //Qualle
            jellyfish: {
                file: '../jellyfish.png',
                position: 'ground',
                width: 120,
                height: 140,
                boundingBoxes: [
                    {x: 1, y: 1, width: 99, height: 129},
                    {x: 100, y: 60, width: 18, height: 51}

                ]
            },

            //Seeigel
            seaurchin: {
                file: '../seaurchin.png',
                position: 'ground',
                width: 150,
                height: 115,
                boundingBoxes: [
                    {x: 3, y: 18, width: 56, height: 56},
                    {x: 13, y: 75, width: 45, height: 21},
                    {x: 58, y: 5, width: 59, height: 100},
                    {x: 117, y: 26, width: 29, height: 66}

                ]
            },

            //Hai
            shark: {
                file: '../shark.png',
                position: 'air',
                width: 150,
                height: 73,
                boundingBoxes: [
                    {x: 1, y: 12, width: 64, height: 22},
                    {x: 9, y: 34, width: 56, height: 22},
                    {x: 39, y: 56, width: 27, height: 15},
                    {x: 65, y: 2, width: 26, height: 62},
                    {x: 91, y: 22, width: 27, height: 36},
                    {x: 119, y: 7, width: 22, height: 46}

                ]
            },

            //Schildkröte
            turtle: {
                file: '../turtle.png',
                position: 'air',
                width: 0,  //sample values
                height: 0, //sample values
                boundingBoxes: [
                    {x: 0, y: 0, width: 0, height: 0} //sample values

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
        world: {
            files: {
                ground: 'assets/themes/desert/ground.png',
                landscapeA: 'assets/themes/desert/landscapeA.png',
                landscapeB: 'assets/themes/desert/landscapeB.png',
                clouds: 'assets/themes/desert/clouds.png',
                sky: 'assets/themes/desert/sky.jpg'
            }
        },
        traps: {
            //Skorpion
            scorpion: {
                file: '../scorpion.png',
                position: 'ground',
                width: 150,
                height: 119,
                boundingBoxes: [
                    {x: 83, y: 0, width: 66, height: 55},
                    {x: 3, y: 55, width: 80, height: 60}
                ]
            },

            //Schädel
            skull: {
                file: '../skull.png',
                position: 'ground',
                width: 140,
                height: 120,
                boundingBoxes: [
                    {x: 75, y: 0, width: 35, height: 64},
                    {x: 56, y: 50, width: 18, height: 29},
                    {x: 34, y: 65, width: 22, height: 14},
                    {x: 3, y: 79, width: 53, height: 40}
                ]
            },

            //Geier
            vulture: {
                file: '../vulture.png',
                position: 'air',
                width: 170,
                height: 90,
                boundingBoxes: [
                    {x: 2, y: 14, width: 34, height: 32},
                    {x: 36, y: 42, width: 37, height: 7},
                    {x: 73, y: 2, width: 67, height: 58},
                    {x: 96, y: 60, width: 42, height: 10},
                    {x: 138, y: 67, width: 31, height: 23}
                ]
            },

            //Kaktus
            cactus: {
                file: '../cactus.png',
                position: 'air',
                width: 100,
                height: 160,
                boundingBoxes: [
                    {x: 4, y: 15, width: 57, height: 85},
                    {x: 26, y: 100, width: 31, height: 58}
                ]
            },

            //Schlange
            snake: {
                file: '../snake.png',
                position: 'ground',
                width: 98,
                height: 100,
                boundingBoxes: [
                    {x: 36, y: 0, width: 32, height: 9},
                    {x: 47, y: 9, width: 20, height: 30},
                    {x: 39, y: 39, width: 15, height: 20},
                    {x: 33, y: 59, width: 14, height: 19},
                    {x: 1, y: 78, width: 31, height: 20}
                ]
            },

            //Falke
            hawk: {
                file: '../hawk.png',
                position: 'air',
                width: 110,
                height: 104,
                boundingBoxes: [
                    {x: 52, y: 4, width: 25, height: 15},
                    {x: 34, y: 19, width: 25, height: 18},
                    {x: 26, y: 37, width: 25, height: 20},
                    {x: 1, y: 57, width: 25, height: 17},
                    {x: 26, y: 69, width: 27, height: 11},
                    {x: 53, y: 74, width: 31, height: 10},
                    {x: 84, y: 83, width: 25, height: 8},
                    {x: 34, y: 81, width: 10, height: 21}

                ]
            }
        },
        boni: {
            kaktus: {
                file: '../KaktusBonus.png'
            }
        }
    },
    'meadow': {
        world: {
            files: {
                ground: 'assets/themes/meadow/ground.png',
                landscapeA: 'assets/themes/meadow/landscapeA.png',
                landscapeB: 'assets/themes/meadow/landscapeB.png',
                clouds: 'assets/themes/meadow/clouds.png',
                sky: 'assets/themes/meadow/sky.jpg'
            }
        },
        traps: {

        },
        boni: {

        }


    }
};
