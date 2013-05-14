/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Button');

goog.require('lime.GlossyButton');

/**
 * Glossy button. Rounded button with some predefined style.
 * Use lime.Button for lower level control.
 * @param {string} txt Text shown on the button.
 * @constructor
 * @extends lime.Button
 */
obacht.Button = function(txt) {
    lime.GlossyButton.call(this, txt);

    this.borderWidth = 4;
    this.setColor('#000');
};
goog.inherits(obacht.Button, lime.GlossyButton);

/**
 * Make state for a button.
 * @private
 * @return {lime.RoundedRect} state.
 */
obacht.Button.prototype.makeState_ = function() {
    var state = new lime.RoundedRect().setFill('#fff').setRadius(15);
    state.inner = new lime.RoundedRect().setRadius(15);
    state.label = new lime.Label().setAlign('center').setFontColor('#eef').setFontSize(35).setSize(300, 35);

    state.appendChild(state.inner);
    state.inner.appendChild(state.label);
    return state;
};

/**
 * Set button base color
 * @param {string} clr New base color.
 * @return {lime.GlossyButton} object itself.
 */
obacht.Button.prototype.setColor = function(clr) {
    clr = lime.fill.parse(clr);
    goog.array.forEach([this.upstate, this.downstate], function(s) {
        var c = s === this.downstate ? clr.clone().addBrightness(0.1) : clr;
        //s.setFill(c);
        var c2 = c.clone().addBrightness(0.3);
        var grad = new lime.fill.LinearGradient().setDirection(0, 0, 0, 1);
        grad.addColorStop(0, c2);
        grad.addColorStop(0.45, c);
        grad.addColorStop(0.55, c);
        grad.addColorStop(1, c2);
        s.inner.setFill(grad);
    }, this);
    return this;
};
