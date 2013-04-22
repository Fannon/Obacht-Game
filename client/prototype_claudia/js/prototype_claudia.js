goog.provide('prototype_claudia');
//goog.provide('lime.Renderer.CANVAS.SPRITE');
//goog.provide('lime.Renderer.DOM.SPRITE');
//goog.provide('lime.Sprite');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');
goog.require('lime.RoundedRect');
goog.require('lime.Sprite');

goog.require('lime');
goog.require('lime.Node');
goog.require('lime.fill.Color');
goog.require('lime.fill.Stroke');
/*goog.require('lime.fill.Fill');
goog.require('lime.fill.Image');*/





var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720



//////////
/* INIT */
//////////

prototype_claudia.start = function(){

	var director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
	    
        scene = new lime.Scene(),
        background = new lime.RoundedRect().setSize(VIEWPORT_WIDTH,VIEWPORT_HEIGHT).setFill('../images/candy/bg_candyland.jpg').setPosition(0,0),
        //background = new lime.Sprite().setFill('../images/candy/bg_candyland.jpg').setSize(50,50).setAnchorPoint(0,0).setPosition(0,0),
        planet_bottom = new lime.Circle().setSize(1475,1475).setFill('#232323').setAnchorPoint(0.5,0.5).setPosition(0,0),
        hindernis1 = new lime.RoundedRect().setSize(100, 100).setFill(160,270,280).setAnchorPoint(0.5, 0.5).setPosition(0, -1480),
        hindernis2 = new lime.RoundedRect().setSize(100, 160).setFill(160,270,280).setAnchorPoint(0.5, 0.5).setPosition(0, 1480),
        hindernis3 = new lime.RoundedRect().setSize(75, 120).setFill(160,270,280).setAnchorPoint(0.5, 0.5).setPosition(1600, 0),
        character = new lime.Circle().setSize(100, 150).setPosition(100, 535).setAnchorPoint(0.5, 1).setFill('#d5622f'),
        jumpArea =  new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0,0).setAnchorPoint(0,0),
        crouchArea = new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0, VIEWPORT_HEIGHT / 2).setAnchorPoint(0,0),

        
    
        // LAYER_1 – OBJECTS //
        layer_1 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT),

        // LAYER_2 – INTERACTION //
        layer_2 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        
       

    //planet_bottom.appendChild(hindernis1);
	//planet_bottom.appendChild(hindernis2);
    //planet_bottom.appendChild(hindernis3);
    //layer_1.appendChild(planet_bottom);
    //layer_1.appendChild(planet_top);
	layer_1.appendChild(background);
    layer_1.appendChild(character);
    layer_2.appendChild(jumpArea);
    layer_2.appendChild(crouchArea);
            
    //background.qualityRenderer = true;


    scene.appendChild(layer_1);
    scene.appendChild(layer_2);

	director.makeMobileWebAppCapable();



///////////////
/* ANIMATION */
///////////////

    var turnPlanet = new lime.animation.Loop(
        new lime.animation.RotateBy(360).setDuration(12).setEasing(lime.animation.Easing.LINEAR)
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

	
	var isCrouching = false;

    goog.events.listen(jumpArea,['mousedown','touchstart'], function(e) {
        character.runAction(jump);
    });
    goog.events.listen(crouchArea,['mousedown','touchstart'], function(e) {
        character.runAction(crouch);
        
        e.swallow(['mouseup','touchend'],function(){
			character.runAction(standUp);
        });
    });
   
	/*
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
    }); */

	director.replaceScene(scene);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('prototype_claudia.start', prototype_claudia.start);
