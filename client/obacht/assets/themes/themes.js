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
                width: 150,
                height: 91,
                boundingBoxes: [
                    {x: 1, y: 10, width: 26, height: 29},
                    {x: 21, y: 25, width: 117, height: 54}
                ]
            },

            //Anker
            anchor: {
                file: 'trap_anchor.png',
                position: 'ground',
                width: 110,
                height: 120,
                boundingBoxes: [
                    {x: 0, y: 27, width: 29, height: 78},
                    {x: 49, y: 2, width: 51, height: 78}

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
            /*shark: {
                file: 'trap_shark.png',
                position: 'air',
                width: 150*2,
                height: 73*2,
                boundingBoxes: [
                    {x: 2, y: 12, width: 37, height: 47},
                    {x: 0, y: 0, width: 0, height: 0}

                ]
            },*/

            //Schildkröte
            turtle: {
                file: 'trap_turtle.png',
                position: 'air',
                width: 150,
                height: 73,
                boundingBoxes: [
                    {x: 2, y: 6, width: 102, height: 37},
                    {x: 104, y: 28, width: 44, height: 13},
                    {x: 14, y: 43, width: 71, height: 26}

                ]
            },

            //Clownfisch
            clownfish: {
                file: 'trap_clownfish.png',
                position: 'air',
                width: 150,
                height: 82,
                boundingBoxes: [
                    {x: 3, y: 3, width: 113, height: 76},
                    {x: 116, y: 35, width: 32, height: 29}

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
                width: 170,
                height: 90,
                boundingBoxes: [
                    {x: 1, y: 14, width: 64, height: 33},
                    {x: 65, y: 1, width: 76, height: 67},
                    {x: 129, y: 68, width: 39, height: 19}
                ]
            },

            //Kaktus
            cactus: {
                file: 'trap_cactus.png',
                position: 'ground',
                width: 100,
                height: 160,
                boundingBoxes: [
                    {x: 4, y: 15, width: 57, height: 85},
                    {x: 26, y: 100, width: 31, height: 58}
                ]
            },

            //Schlange
            snake: {
                file: 'trap_snake.png',
                position: 'ground',
                width: 98,
                height: 100,
                boundingBoxes: [
                    {x: 36, y: 1, width: 32, height: 78},
                    {x: 2, y: 78, width: 94, height: 20},
                    {x: 68, y: 66, width: 27, height: 12}
                ]
            },

            //Falke
            hawk: {
                file: 'trap_hawk.png',
                position: 'air',
                width: 110,
                height: 104,
                boundingBoxes: [
//                    {x:0, y:0, width: 55, height: 52},
//                    {x:55, y:52, width: 55, height: 52}
                    {x: 3, y: 4, width: 74, height: 79},
                    {x: 77, y: 77, width: 31, height: 13},
                    {x: 34, y: 83, width: 13, height: 19}

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
                    {x: 25, y: 66, width: 47, height: 43},
                    {x: 98, y: 49, width: 98, height: 97}
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
                width: 150*1.2,
                height: 87*1.2,
                boundingBoxes: [
                    {x: 1, y: 46, width: 24, height: 19},
                    {x: 25, y: 3, width: 121, height: 75}
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
                width: 100*1.2,
                height: 160*1.2,
                boundingBoxes: [
                    {x: 25, y: 2, width: 54, height: 72},
                    {x: 2, y: 74, width: 96, height: 14},
                    {x: 35, y: 88, width: 33, height: 68}
                ]
            }

        }
    }
};
