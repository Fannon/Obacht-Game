goog.provide('prototype_martin');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');

var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720



//////////
/* INIT */
//////////

prototype_martin.start = function(){

	var director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
	    
        scene = new lime.Scene(),
        planet_bottom = new lime.Circle().setSize(2100,2100).setPosition(200,1500).setFill(0,0,0),
        planet_top =  new lime.Circle().setSize(2100,2100).setPosition(1080,-780).setFill(0,0,0),
        character = new lime.Circle().setSize(100, 150).setPosition(200, 470).setAnchorPoint(0.5, 1).setFill('#d5622f'),
        hindernis = new lime.Circle().setSize(75, 150).setPosition(0, -1065).setFill(0,0,0),
        swipeArea =  new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT).setPosition(0,0).setAnchorPoint(0,0),
    
        // LAYER_1 – OBJECTS //
        layer_1 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT),

        // LAYER_2 – INTERACTION //
        layer_2 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);


    planet_bottom.appendChild(hindernis);
    layer_1.appendChild(planet_bottom);
    layer_1.appendChild(planet_top);
    layer_1.appendChild(character);
    layer_2.appendChild(swipeArea);

    scene.appendChild(layer_1);
    scene.appendChild(layer_2);

	director.makeMobileWebAppCapable();



///////////////
/* ANIMATION */
///////////////

    var turnPlanet = new lime.animation.Loop(
        new lime.animation.RotateBy(360).setDuration(6).setEasing(lime.animation.Easing.LINEAR)
    );

    var jumpUp = new lime.animation.MoveBy(0, -280).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT);
    var jumpDown = jumpUp.reverse().setDuration(0.35).setEasing(lime.animation.Easing.EASEIN);
    var jump = new lime.animation.Sequence(jumpUp, jumpDown);

    var crouch = new lime.animation.ScaleTo(1.6, 0.5).setDuration(0.1);
    var standUp = new lime.animation.ScaleTo(1, 1).setDuration(0.1);

    planet_bottom.runAction(turnPlanet);


    
////////////////////
/* EVENTHANDLING */
////////////////////

    var touchStartY;
    var touchMoveY;
    var touchEndY;
    var isCrouching = false;

    goog.events.listen(swipeArea, 'touchstart', function(e) {
        touchStartY = Math.round(e.position.y);
    });

    goog.events.listen(swipeArea, 'touchend', function(e) {
        touchEndY = Math.round(e.position.y);
        
        if (touchEndY < touchStartY) {
            character.runAction(jump);
        } 
        if (isCrouching == true) {
            character.runAction(standUp);
            isCrouching = false;
        } else {
            return;
        }
    });

    goog.events.listen(swipeArea, 'touchmove', function(e) {
        touchMoveY = Math.round(e.position.y);

        if (isCrouching == false && touchStartY < touchMoveY) {
            character.runAction(crouch);
            isCrouching = true;
        } else {
            return;
        }
    });

	director.replaceScene(scene);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('prototype_martin.start', prototype_martin.start);
