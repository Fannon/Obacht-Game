/* global goog, obacht */
goog.provide('obacht.World');

goog.require('obacht.Bonus');

/**
 * Its a World Object
 */

obacht.World = function(size) {

    console.log('New World();');

    //////////////////////////////
    // World Model (state)       //
    //////////////////////////////

    // Test:  Create Boni
    var bonus = new obacht.Bonus('Zuckerstange');

};

// Prototype Functions
obacht.World.prototype = {
    spinAround: function() {
        console.log('spin around');
    }
}
