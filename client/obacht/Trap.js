/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Trap');

goog.require('obacht.Item');

/*
 * Trap Object. Traps can be thrown by a player or ocur computer-generated.
 *
 * @constructor
 */
obacht.Trap = function(type) {
    obacht.Item.call(type); // Calls Parent Class
};

obacht.Trap.prototype = {

};
goog.inherits(obacht.Trap, obacht.Item);
