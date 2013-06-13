/* global goog, obacht */

goog.provide('obacht.themes');

/**
 * Obacht Themes Data
 */
obacht.themes = {
    'water': {
        spritesheet: "assets/themes/water/waterSpritesheet.png",
        world: {
            files: {
                ground: 'assets/themes/water/ground.png',
                landscape: 'assets/themes/water/landscape.png',
                clouds: 'assets/themes/water/clouds.png'
            }
        },
        traps: {

            //Krebs
            crab: {
                file: 'trap_crab.png',
                position: 'ground',
                width: 165,
                height: 100.1,
                boundingBoxes: [
                    {x: 1, y: 11, width: 28.6, height: 31.9},
                    {x: 23.1, y: 27.5, width: 128.7, height: 59.4}
                ]
            },

            //Anker
            anchor: {
                file: 'trap_anchor.png',
                position: 'ground',
                width: 132,
                height: 144,
                boundingBoxes: [
                    {x: 0, y: 32.4, width: 34.8, height: 93.6},
                    {x: 58.8, y: 2.8, width: 64.8, height: 93.6}

                ]
            },

            //Qualle
            jellyfish: {
                file: 'trap_jellyfish.png',
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
                file: 'trap_seaurchin.png',
                position: 'ground',
                width: 150,
                height: 115,
                boundingBoxes: [
                    {x: 5, y: 5, width: 112, height: 100},
                    {x: 117, y: 26, width: 29, height: 66}

                ]
            },

            //Hai
//            shark: {
//                 file: 'trap_shark.png',
//                 position: 'air',
//                 width: 300,
//                 height: 146,
//                 boundingBoxes: [
//                     {x: 4, y: 24, width: 74, height: 94},
//                     {x: 78, y: 24, width: 160, height: 116},
//                     {x: 138, y: 14, width: 44, height: 92}
//                 ]
//             },

            //Schildkröte
            turtle: {
                file: 'trap_turtle.png',
                position: 'air',
                width: 210,
                height: 102.2,
                boundingBoxes: [
                    {x: 2.8, y: 8.4, width: 142.8, height: 51.8},
                    {x: 145.6, y: 39.2, width: 61.6, height: 18.2},
                    {x: 19.6, y: 60.2, width: 99.4, height: 36.4}

                ]
            },

            //Clownfisch
            clownfish: {
                file: 'trap_clownfish.png',
                position: 'air',
                width: 180,
                height: 98.4,
                boundingBoxes: [
                    {x: 3.6, y: 3.6, width: 135.6, height: 91.2},
                    {x: 139.2, y: 42, width: 38.4, height: 34.8}
                ]
            }
        }
    },
    'desert': {
        spritesheet: "assets/themes/desert/desertSpritesheet.png",
        world: {
            files: {
                ground: 'assets/themes/desert/ground.png',
                landscape: 'assets/themes/desert/landscape.png',
                clouds: 'assets/themes/desert/clouds.png'
            }
        },
        traps: {
            //Skorpion
            scorpion: {
                file: 'trap_scorpion.png',
                position: 'ground',
                width: 150,
                height: 119,
                boundingBoxes: [
                    {x: 3, y: 55, width: 80, height: 60},
                    {x: 83, y: 2, width: 66, height: 83}
                ]
            },

            //Schädel
            skull: {
                file: 'trap_skull.png',
                position: 'ground',
                width: 140,
                height: 120,
                boundingBoxes: [
                    {x: 75, y: 1, width: 14, height: 50},
                    {x: 3, y: 50, width: 105, height: 59},
                    {x: 108, y: 75, width: 29, height: 13}
                ]
            },

            //Geier
            vulture: {
                file: 'trap_vulture.png',
                position: 'air',
                width: 221,
                height: 117,
                boundingBoxes: [
                    {x: 1.3, y: 18.2, width: 83.2, height: 42.9},
                    {x: 84.5, y: 1.3, width: 98.8, height: 87.1},
                    {x: 167.7, y: 88.4, width: 50.4, height: 24.7}
                ]
            },

            //Kaktus
            cactus: {
                file: 'trap_cactus.png',
                position: 'ground',
                width: 100,
                height: 160,
                boundingBoxes: [
                    {x: 4, y: 15, width: 67, height: 84},
                    {x: 26, y: 100, width: 31, height: 58},
                    {x: 71, y: 66, width: 19, height: 33}
                ]
            },

            //Schlange
            snake: {
                file: 'trap_snake.png',
                position: 'ground',
                width: 117.6,
                height: 120,
                boundingBoxes: [
                    {x: 43.2, y: 1.2, width: 38.4, height: 93.6},
                    {x: 2.4, y: 93.4, width: 112.8, height: 24},
                    {x: 81.6, y: 79.2, width: 32.4, height: 14.4}
                ]
            },

            //Falke
            hawk: {
                file: 'trap_hawk.png',
                position: 'air',
                width: 154,
                height: 145.6,
                boundingBoxes: [
                    {x: 4.2, y: 5.6, width: 103.6, height: 110.6},
                    {x: 107.8, y: 107.8, width: 43.4, height: 18.2},
                    {x: 47.6, y: 116.2, width: 18.2, height: 26.6}

                ]
            }
        }
    },
    'meadow': {
        spritesheet: "assets/themes/meadow/meadowSpritesheet.png",
        world: {
            files: {
                ground: 'assets/themes/meadow/ground.png',
                landscape: 'assets/themes/meadow/landscape.png',
                clouds: 'assets/themes/meadow/clouds.png'
            }
        },
        traps: {
            //Schmetterling
            butterfly: {
                file: 'trap_butterfly.png',
                position: 'air',
                width: 150,
                height: 101,
                boundingBoxes: [
                    {x: 2, y: 44, width: 47, height: 43},
                    {x: 49, y: 1, width: 98, height: 97}
                ]
            },

            //Biene
            bee: {
                file: 'trap_bee.png',
                position: 'air',
                width: 140,
                height: 113,
                boundingBoxes: [
                    {x: 1, y: 25, width: 53, height: 66},
                    {x: 54, y: 1, width: 72, height: 110},
                    {x: 126, y: 52, width: 13, height: 23}
                ]
            },

            //Schnecke
            snail: {
                file: 'trap_snail.png',
                position: 'ground',
                width: 140,
                height: 113,
                boundingBoxes: [
                    {x: 2, y: 50, width: 29, height: 49},
                    {x: 31, y: 3, width: 107, height: 82}
                ]
            },

            //Baumstumpf
            treestump: {
                file: 'trap_treestump.png',
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
                file: 'trap_hedgehog.png',
                position: 'ground',
                width: 165,
                height: 95.7,
                boundingBoxes: [
                    {x: 1.1, y: 50.6, width: 26.4, height: 20.9},
                    {x: 27.5, y: 3.3, width: 133.1, height: 82.5}
                ]
            },

            //Pilz
            mushroom: {
                file: 'trap_mushroom.png',
                position: 'ground',
                width: 130,
                height: 146,
                boundingBoxes: [
                    {x: 3, y: 2, width: 125, height: 67},
                    {x: 40, y: 69, width: 64, height: 67}

                ]
            },

            //Vogelscheuche
            scarecrow: {
                file: 'trap_scarecrow.png',
                position: 'ground',
                width: 115,
                height: 184,
                boundingBoxes: [
                    {x: 28.75, y: 2.3, width: 62.1, height: 82.8},
                    {x: 2.3, y: 85.1, width: 110.4, height: 16.1},
                    {x: 40.25, y: 101.2, width: 37.95, height: 78.2}
                ]
            }

        }
    }
};
