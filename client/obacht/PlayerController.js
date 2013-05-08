/* global goog, lime, obacht */
/* jshint devel: true */

goog.provide('obacht.PlayerController');

goog.require('obacht.options');
goog.require('goog.pubsub.PubSub');

/**
 * Its a Player Controller
 *
 * @constructor
 */
obacht.PlayerController = function() {
    "use strict";

    // Event Publisher/Subscriber
    this.events = new goog.pubsub.PubSub();

};

obacht.PlayerController.prototype = {

    /**
     * Player Move
     */
    move: function(data) {
        "use strict";
        obacht.PlayerController.events.publish('player_move', data);
    }
};
