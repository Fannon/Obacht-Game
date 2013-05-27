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
                file: 'assets/themes/water/traps/crab.png',
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
                file: 'assets/themes/water/traps/anchor.png',
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
                file: 'assets/themes/water/traps/jellyfish.png',
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
                file: 'assets/themes/water/traps/seaurchin.png',
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
                file: 'assets/themes/water/traps/shark.png',
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
                file: 'assets/themes/water/traps/turtle.png',
                position: 'air',
                width: 150,
                height: 73,
                boundingBoxes: [
                    {x: 1, y: 2, width: 30, height: 18},
                    {x: 13, y: 20, width: 18, height: 36},
                    {x: 19, y: 56, width: 27, height: 14},
                    {x: 31, y: 6, width: 73, height: 37},
                    {x: 104, y: 28, width: 44, height: 13},
                    {x: 46, y: 43, width: 10, height: 12},
                    {x: 56, y: 43, width: 10, height: 20},
                    {x: 66, y: 56, width: 19, height: 14}

                ]
            },

            //Clownfisch
            clownfish: {
                file: 'assets/themes/water/traps/clownfish.png',
                position: 'air',
                width: 150,
                height: 82,
                boundingBoxes: [
                    {x: 75, y: 41, width: 150, height: 82},
                    {x: 18, y: 19, width: 15, height: 47},
                    {x: 33, y: 3, width: 39, height: 65},
                    {x: 44, y: 68, width: 28, height: 12},
                    {x: 72, y: 11, width: 44, height: 63},
                    {x: 116, y: 35, width: 32, height: 29}

                ]
            }
        },
        boni: {
            kaktus: {
                file: '../KaktusBonus.png' //sample value
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
                file: 'assets/themes/desert/traps/scorpion.png',
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
                file: 'assets/themes/desert/traps/skull.png',
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
                file: 'assets/themes/desert/traps/vulture.png',
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
                file: 'assets/themes/desert/traps/cactus.png',
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
                file: 'assets/themes/desert/traps/snake.png',
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
                file: 'assets/themes/desert/traps/hawk.png',
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
                file: '../KaktusBonus.png' //sample value
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
            //Biene
            bee: {
                file: 'assets/themes/meadow/traps/bee.png',
                position: 'air',
                width: 0,
                height: 0,
                boundingBoxes: [
                    {x: 0, y: 0, width: 0, height: 0},
                    {x: 0, y: 0, width: 0, height: 0}
                ]
            },

            //Schnecke
            snail: {
                file: 'assets/themes/meadow/traps/snail.png',
                position: 'ground',
                width: 140,
                height: 116,
                boundingBoxes: [
                    {x: 3, y: 51, width: 12, height: 16},
                    {x: 2, y: 67, width: 29, height: 32},
                    {x: 18, y: 48, width: 4, height: 19},
                    {x: 31, y: 20, width: 15, height: 65},
                    {x: 46, y: 10, width: 24, height: 75},
                    {x: 70, y: 2, width: 35, height: 83},
                    {x: 105, y: 10, width: 21, height: 75},
                    {x: 126, y: 27, width: 12, height: 58},
                    {x: 31, y: 85, width: 98, height: 29}
                ]
            },

            //Marienkäfer
            beetle: {
                file: 'assets/themes/meadow/traps/beetle.png',
                position: 'air',
                width: 0,
                height: 0,
                boundingBoxes: [
                    {x: 0, y: 0, width: 0, height: 0},
                    {x: 0, y: 0, width: 0, height: 0}
                ]
            },

            //Baumstumpf
            treestump: {
                file: 'assets/themes/meadow/traps/treestump.png',
                position: 'ground',
                width: 120,
                height: 129,
                boundingBoxes: [
                    {x: 14, y: 0, width: 95, height: 89},
                    {x: 7, y: 89, width: 106, height: 33}
                ]
            },

            //Igel
            hedgehog: {
                file: 'assets/themes/meadow/traps/hedgehog.png',
                position: 'ground',
                width: 150,
                height: 87,
                boundingBoxes: [
                    {x: 1, y: 46, width: 10, height: 9},
                    {x: 11, y: 44, width: 11, height: 22},
                    {x: 22, y: 37, width: 14, height: 33},
                    {x: 36, y: 20, width: 103, height: 58},
                    {x: 53, y: 10, width: 78, height: 10},
                    {x: 72, y: 2, width: 48, height: 8},
                    {x: 139, y: 29, width: 9, height: 39},
                    {x: 65, y: 78, width: 62, height: 8}
                ]
            },

            //Pilz
            mushroom: {
                file: 'assets/themes/meadow/traps/mushroom.png',
                position: 'ground',
                width: 130,
                height: 146,
                boundingBoxes: [
                    {x: 43, y: 1, width: 56, height: 9},
                    {x: 23, y: 10, width: 93, height: 12},
                    {x: 10, y: 22, width: 117, height: 16},
                    {x: 104, y: 38, width: 24, height: 23},
                    {x: 40, y: 77, width: 64, height: 59}

                ]
            },

            //Vogelscheuche
            scarecrow: {
                file: 'assets/themes/meadow/traps/scarecrow.png',
                position: 'ground',
                width: 100,
                height: 160,
                boundingBoxes: [
                    {x: 30, y: 1, width: 31, height: 15},
                    {x: 24, y: 16, width: 56, height: 26},
                    {x: 28, y: 42, width: 43, height: 32},
                    {x: 2, y: 74, width: 96, height: 14},
                    {x: 35, y: 88, width: 33, height: 47},
                    {x: 44, y: 134, width: 13, height: 24}

                ]
            }

        },
        boni: {

        }


    }
};
