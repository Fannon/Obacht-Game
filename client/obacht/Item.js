/* global goog, obacht */
goog.provide('obacht.Item');

/**
 * Game item
 *
 * @constructor
 */
obacht.Item = function(type) {
    this.type = type;
    console.log('Item created');
};

obacht.Item.prototype = {
    toString: function() {
        return "Item: ";
    }
};
