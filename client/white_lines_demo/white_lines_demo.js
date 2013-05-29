//set main namespace
goog.provide('white_lines_demo');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.animation.RotateBy');
goog.require('lime.Renderer');


var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720;



// entrypoint
white_lines_demo.start = function() {

    var director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    var scene = new lime.Scene().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    var circle1 = new lime.Sprite().setSize(800, 800).setFill('landscapeB_new.png').setPosition((VIEWPORT_WIDTH / 2), (VIEWPORT_HEIGHT / 2)).setAnchorPoint(0.5, 0.5).setRenderer(lime.Renderer.CANVAS);
    var circle2 = new lime.Sprite().setSize(800, 800).setFill('landscapeB_new.png').setPosition((VIEWPORT_WIDTH / 2) + 200, (VIEWPORT_HEIGHT / 2) + 200).setAnchorPoint(0.5, 0.5).setRenderer(lime.Renderer.CANVAS);

    var layer = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    scene.appendChild(circle1);
    scene.appendChild(circle2);

    var turn = new lime.animation.RotateBy(360).setDuration(10).setEasing(lime.animation.Easing.LINEAR).enableOptimizations();


    circle2.runAction(turn);

    director.replaceScene(scene);
};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('white_lines_demo.start', white_lines_demo.start);
