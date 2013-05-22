/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.World');
goog.require('obacht.options');
goog.require('obacht.Bonus');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Loop');
goog.require('lime.animation.RotateBy');

//goog.require('lime.Renderer.CANVAS.SPRITE'); ???
//goog.require('lime.Renderer.DOM.SPRITE'); ???
//goog.require('lime.Sprite');
//goog.require('goog.style');
//goog.require('lime.Layer');
//goog.require('lime.fill.Color');
//goog.require('lime.fill.Stroke');
//goog.require('lime.fill.Fill');
//goog.require('lime.fill.Image');

/**
 * Its a World Object
 *
 * @class
 * @scope _global_
 */
obacht.World = function(type) {
    console.log('New World()');

    /////////////////////////////////////////
    // DECIDE IF BOTTOM WORLD OR TOP WORLD //
    /////////////////////////////////////////

    if (type === 'own') {
        this.x = obacht.options.world.bottom.x;
        this.y = obacht.options.world.bottom.y;
        this.rotation1 = obacht.options.world.bottom.rotation1;
        this.rotation2 = obacht.options.world.bottom.rotation2;
        this.rotation3 = obacht.options.world.bottom.startRotation1;
        this.rotation4 = obacht.options.world.bottom.startRotation2;
    }

    if (type === 'enemy') {
        this.x = obacht.options.world.top.x;
        this.y = obacht.options.world.top.y;
        this.rotation1 = obacht.options.world.top.rotation1;
        this.rotation2 = obacht.options.world.top.rotation2;
        this.rotation3 = obacht.options.world.bottom.startRotation1;
        this.rotation4 = obacht.options.world.bottom.startRotation2;
    }


    ///////////////////////
    // LIME.JS - OBJECTS //
    ///////////////////////

    this.clouds1 = new lime.Sprite().setSize(obacht.options.world.size.clouds, obacht.options.world.size.clouds).setFill(obacht.themes.path.clouds).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation1).setRenderer(obacht.renderer);
    this.clouds2 = new lime.Sprite().setSize(obacht.options.world.size.clouds, obacht.options.world.size.clouds).setFill(obacht.themes.path.clouds).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation2).setRenderer(obacht.renderer);
    this.landscapeA1 = new lime.Sprite().setSize(obacht.options.world.size.landscapeA, obacht.options.world.size.landscapeA).setFill(obacht.themes.path.landscapeA).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation1).setRenderer(obacht.renderer);
    this.landscapeA2 = new lime.Sprite().setSize(obacht.options.world.size.landscapeA, obacht.options.world.size.landscapeA).setFill(obacht.themes.path.landscapeA).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation2).setRenderer(obacht.renderer);
    this.landscapeB1 = new lime.Sprite().setSize(obacht.options.world.size.landscapeB, obacht.options.world.size.landscapeB).setFill(obacht.themes.path.landscapeB).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation1).setRenderer(obacht.renderer);
    this.landscapeB2 = new lime.Sprite().setSize(obacht.options.world.size.landscapeB, obacht.options.world.size.landscapeB).setFill(obacht.themes.path.landscapeB).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation2).setRenderer(obacht.renderer);
    this.ground1 = new lime.Sprite().setSize(obacht.options.world.size.ground, obacht.options.world.size.ground).setFill(obacht.themes.path.ground).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation1).setRenderer(obacht.renderer);
    this.ground2 = new lime.Sprite().setSize(obacht.options.world.size.ground, obacht.options.world.size.ground).setFill(obacht.themes.path.ground).setPosition(this.x, this.y).setAnchorPoint(0, 1).setRotation(this.rotation2).setRenderer(obacht.renderer);

    this.layer = new lime.Layer().setSize(obacht.options.graphics.VIEWPORT_WIDTH, obacht.options.graphics.VIEWPORT_HEIGHT);

    this.layer.appendChild(this.clouds2);
    this.layer.appendChild(this.clouds1);
    this.layer.appendChild(this.landscapeB1);
    this.layer.appendChild(this.landscapeB2);
    this.layer.appendChild(this.landscapeA1);
    this.layer.appendChild(this.landscapeA2);
    this.layer.appendChild(this.ground1);
    this.layer.appendChild(this.ground2);

    this.spin();
};



///////////////////////////
// PROTOTYPE - FUNCTIONS //
///////////////////////////

obacht.World.prototype = {

    spin: function() {
        this.createAnimation1(this.ground1, this.rotation3, this.rotation4, obacht.options.world.spinDuration.front, 0);
        this.createAnimation2(this.ground2, this.rotation4, this.rotation3, 0, obacht.options.world.spinDuration.front);
        this.createAnimation1(this.landscapeA1, this.rotation3, this.rotation4, obacht.options.world.spinDuration.front, 0);
        this.createAnimation2(this.landscapeA2, this.rotation4, this.rotation3, 0, obacht.options.world.spinDuration.front);
        this.createAnimation1(this.landscapeB1, this.rotation3, this.rotation4, obacht.options.world.spinDuration.middle, 0);
        this.createAnimation2(this.landscapeB2, this.rotation4, this.rotation3, 0, obacht.options.world.spinDuration.middle);
        this.createAnimation1(this.clouds1, this.rotation3, this.rotation4, obacht.options.world.spinDuration.clouds, 0);
        this.createAnimation2(this.clouds2, this.rotation4, this.rotation3, 0, obacht.options.world.spinDuration.clouds);
    },

    createAnimation1: function(object, rotation1, rotation2, duration1, duration2) {
        object.runAction(new lime.animation.Loop(
            new lime.animation.Sequence(
            new lime.animation.RotateBy(rotation1).setDuration(duration1).setEasing(lime.animation.Easing.LINEAR).enableOptimizations(),
            new lime.animation.RotateBy(rotation2).setDuration(duration2).setEasing(lime.animation.Easing.LINEAR).enableOptimizations(),
            new lime.animation.RotateBy(rotation1).setDuration(duration1).setEasing(lime.animation.Easing.LINEAR).enableOptimizations()))
        );
    },

    createAnimation2: function(object, rotation1, rotation2, duration1, duration2) {
        object.runAction(new lime.animation.Loop(
            new lime.animation.Sequence(
            new lime.animation.RotateBy(rotation1).setDuration(duration1).setEasing(lime.animation.Easing.LINEAR).enableOptimizations(),
            new lime.animation.RotateBy(rotation2).setDuration(duration2).setEasing(lime.animation.Easing.LINEAR).enableOptimizations(),
            new lime.animation.RotateBy(rotation2).setDuration(duration2).setEasing(lime.animation.Easing.LINEAR).enableOptimizations()))
        );
    }
};
