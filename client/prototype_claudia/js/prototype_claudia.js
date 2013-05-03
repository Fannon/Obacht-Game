goog.provide('prototype_claudia');


goog.require('lime.Renderer.CANVAS.SPRITE');
goog.require('lime.Renderer.DOM.SPRITE');
goog.require('lime.Sprite');
goog.require('goog.style');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.RotateTo');
goog.require('lime.animation.Loop');
goog.require('lime.animation.Sequence');
goog.require('lime.RoundedRect');
goog.require('lime.Sprite');

goog.require('lime');
goog.require('lime.Node');
goog.require('lime.fill.Color');
goog.require('lime.fill.Stroke');
goog.require('lime.fill.Fill');
goog.require('lime.fill.Image');





var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720;
var THEME = 'meadow'              // water || dessert || meadow



//////////
/* INIT */
//////////

prototype_claudia.start = function(){

	var director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),

        scene = new lime.Scene(),

        sky = new lime.Sprite().setSize(VIEWPORT_WIDTH,VIEWPORT_HEIGHT).setFill('images/'+THEME+'/sky_'+THEME+'.jpg').setPosition(0,0).setAnchorPoint(0,0),
        clouds1 = new lime.Sprite().setSize(1750,1750).setFill('images/'+THEME+'/clouds_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1),
        clouds2 = new lime.Sprite().setSize(1750,1750).setFill('images/'+THEME+'/clouds_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),
        landscapeA1 = new lime.Sprite().setSize(1590,1590).setFill('images/'+THEME+'/landscapeA_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1),
        landscapeA2 = new lime.Sprite().setSize(1590,1590).setFill('images/'+THEME+'/landscapeA_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),
        landscapeB1 = new lime.Sprite().setSize(1680,1680).setFill('images/'+THEME+'/landscapeB_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1),
        landscapeB2 = new lime.Sprite().setSize(1680,1680).setFill('images/'+THEME+'/landscapeB_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),
        terra1 = new lime.Sprite().setSize(1470,1470).setFill('images/'+THEME+'/terra_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1),
        terra2 = new lime.Sprite().setSize(1470,1470).setFill('images/'+THEME+'/terra_'+THEME+'.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),

        //hindernis1 = new lime.RoundedRect().setSize(100, 100).setFill(160,270,280).setAnchorPoint(0.5, 0.5).setPosition(0, -1480),
        //hindernis2 = new lime.RoundedRect().setSize(100, 160).setFill(160,270,280).setAnchorPoint(0.5, 0.5).setPosition(0, 1480),
        //hindernis3 = new lime.RoundedRect().setSize(75, 120).setFill(160,270,280).setAnchorPoint(0.5, 0.5).setPosition(1600, 0),
        character = new lime.Circle().setSize(100, 150).setPosition(100, 535).setAnchorPoint(0.5, 1).setFill('#d5622f'),
        jumpArea =  new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0,0).setAnchorPoint(0,0),
        crouchArea = new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0, VIEWPORT_HEIGHT / 2).setAnchorPoint(0,0),



        // LAYER_1 – OBJECTS //
        layer_1 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT),

        // LAYER_2 – INTERACTION //
        layer_2 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);



		layer_1.appendChild(sky);
		layer_1.appendChild(clouds2);
		layer_1.appendChild(clouds1);
		layer_1.appendChild(landscapeB1);
		layer_1.appendChild(landscapeB2);
		layer_1.appendChild(landscapeA1);
		layer_1.appendChild(landscapeA2);
		layer_1.appendChild(terra1);
		layer_1.appendChild(terra2);
	    layer_1.appendChild(character);

	    layer_2.appendChild(jumpArea);
	    layer_2.appendChild(crouchArea);

	    //sky.qualityRenderer = true;


	    scene.appendChild(layer_1);
	    scene.appendChild(layer_2);

		director.makeMobileWebAppCapable();



///////////////
/* ANIMATION */
///////////////


    var drehungterra1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR),
        	  new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungterra2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungLandscapeA1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR),
        	  new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungLandscapeA2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungLandscapeB1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(90).setDuration(35).setEasing(lime.animation.Easing.LINEAR),
        	  new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(35).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungLandscapeB2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(35).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(35).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungclouds1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(90).setDuration(50).setEasing(lime.animation.Easing.LINEAR),
        	  new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(50).setEasing(lime.animation.Easing.LINEAR)
            )
    );

    var drehungclouds2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateBy(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(50).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateBy(90).setDuration(50).setEasing(lime.animation.Easing.LINEAR)
            )
    );
    terra1.runAction(drehungterra1);
    terra2.runAction(drehungterra2);
    landscapeB1.runAction(drehungLandscapeB1);
    landscapeB2.runAction(drehungLandscapeB2);
    landscapeA1.runAction(drehungLandscapeA1);
    landscapeA2.runAction(drehungLandscapeA2);
    clouds1.runAction(drehungclouds1);
    clouds2.runAction(drehungclouds2);





    var jumpUp = new lime.animation.MoveBy(0, -280).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT);
    var jumpDown = jumpUp.reverse().setDuration(0.35).setEasing(lime.animation.Easing.EASEIN);
    var jump = new lime.animation.Sequence(jumpUp, jumpDown);

    var crouch = new lime.animation.ScaleTo(1.6, 0.5).setDuration(0.1);
    var standUp = new lime.animation.ScaleTo(1, 1).setDuration(0.1);





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

	director.replaceScene(scene);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('prototype_claudia.start', prototype_claudia.start);
