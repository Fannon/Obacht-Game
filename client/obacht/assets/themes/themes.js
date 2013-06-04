/* global goog, obacht */

goog.provide('obacht.themes');

/**
 * Obacht Themes Data
 */
obacht.themes = {
    'water': {
        spritesheet: "assets/spritesheets/waterSpritesheet.png",
        world: {
            files: {
                ground: 'assets/themes/water/ground.png',
                landscapeA: 'assets/themes/water/landscapeA.png',
                landscapeB: 'assets/themes/water/landscapeB.png',
                clouds: 'assets/themes/water/clouds.png'
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
                    {x: 1, y: 10, width: 26, height: 29},
                    {x: 21, y: 25, width: 117, height: 54}
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
                    {x: 49, y: 2, width: 51, height: 78}

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
                    {x: 5, y: 5, width: 112, height: 100},
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
                    {x: 2, y: 12, width: 37, height: 47},
                    {x: 0, y: 0, width: 0, height: 0}

                ]
            },

            //Schildkröte
            turtle: {
                file: 'assets/themes/water/traps/turtle.png',
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
                file: 'assets/themes/water/traps/clownfish.png',
                position: 'air',
                width: 150,
                height: 82,
                boundingBoxes: [
                    {x: 3, y: 3, width: 113, height: 76},
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
        spritesheet: "assets/spritesheets/desertSpritesheet.png",
        world: {
            files: {
                ground: 'assets/themes/desert/ground.png',
                landscapeA: 'assets/themes/desert/landscapeA.png',
                landscapeB: 'assets/themes/desert/landscapeB.png',
                clouds: 'assets/themes/desert/clouds.png'
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
                    {x: 3, y: 55, width: 80, height: 60},
                    {x: 83, y: 2, width: 66, height: 83}
                ]
            },

            //Schädel
            skull: {
                file: 'assets/themes/desert/traps/skull.png',
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
                file: 'assets/themes/desert/traps/vulture.png',
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
                    {x: 36, y: 1, width: 32, height: 78},
                    {x: 2, y: 78, width: 94, height: 20},
                    {x: 68, y: 66, width: 27, height: 12}
                ]
            },

            //Falke
            hawk: {
                file: 'assets/themes/desert/traps/hawk.png',
                position: 'air',
                width: 110,
                height: 104,
                boundingBoxes: [
                    {x: 3, y: 4, width: 74, height: 79},
                    {x: 77, y: 77, width: 31, height: 13},
                    {x: 34, y: 83, width: 13, height: 19}

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
        spritesheet: "assets/spritesheets/meadowSpritesheet.png",
        world: {
            files: {
                ground: 'assets/themes/meadow/ground.png',
                landscapeA: 'assets/themes/meadow/landscapeA.png',
                landscapeB: 'assets/themes/meadow/landscapeB.png',
                clouds: 'assets/themes/meadow/clouds.png'
            }
        },
        traps: {
            //Schmetterling
            butterfly: {
                file: 'assets/themes/meadow/traps/butterfly.png',
                position: 'air',
                width: 0,
                height: 0,
                boundingBoxes: [
                    {x: 1, y: 45, width: 47, height: 43},
                    {x: 49, y: 1, width: 98, height: 97}
                ]
            },

            //Biene
            bee: {
                file: 'assets/themes/meadow/traps/bee.png',
                position: 'air',
                width: 0,
                height: 0,
                boundingBoxes: [
                    {x: 1, y: 25, width: 53, height: 66},
                    {x: 54, y: 1, width: 72, height: 110},
                    {x: 126, y: 52, width: 13, height: 23}
                ]
            },

            //Schnecke
            snail: {
                file: 'assets/themes/meadow/traps/snail.png',
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
                    {x: 1, y: 46, width: 24, height: 19},
                    {x: 25, y: 3, width: 121, height: 75}
                ]
            },

            //Pilz
            mushroom: {
                file: 'assets/themes/meadow/traps/mushroom.png',
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
                file: 'assets/themes/meadow/traps/scarecrow.png',
                position: 'ground',
                width: 100,
                height: 160,
                boundingBoxes: [
                    {x: 25, y: 2, width: 54, height: 72},
                    {x: 2, y: 74, width: 96, height: 14},
                    {x: 35, y: 88, width: 33, height: 68}
                ]
            }

        },
        boni: {

        }

    }
};
