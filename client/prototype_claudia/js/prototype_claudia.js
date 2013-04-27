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
var VIEWPORT_HEIGHT = 720



//////////
/* INIT */
//////////

prototype_claudia.start = function(){

	var director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
	    
        scene = new lime.Scene(),

        background = new lime.Sprite().setSize(VIEWPORT_WIDTH,VIEWPORT_HEIGHT).setFill('images/wueste/Verlauf_Wueste.jpg').setPosition(0,0).setAnchorPoint(0,0),
        himmel1 = new lime.Sprite().setSize(1750,1750).setFill('images/wueste/Himmel_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1),
        himmel2 = new lime.Sprite().setSize(1750,1750).setFill('images/wueste/Himmel_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),
        landschaftHinten1 = new lime.Sprite().setSize(1680,1680).setFill('images/wueste/Landschaft2_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1),
        landschaftHinten2 = new lime.Sprite().setSize(1680,1680).setFill('images/wueste/Landschaft2_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),
        landschaftVorne1 = new lime.Sprite().setSize(1590,1590).setFill('images/wueste/Landschaft1_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1),
        landschaftVorne2 = new lime.Sprite().setSize(1590,1590).setFill('images/wueste/Landschaft1_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),
        erde1 = new lime.Sprite().setSize(1470,1470).setFill('images/wueste/Erde_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1),
        erde2 = new lime.Sprite().setSize(1470,1470).setFill('images/wueste/Erde_Wueste.png').setPosition(0,1960).setAnchorPoint(0,1).setRotation(90),

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
        
       

		layer_1.appendChild(background);
		layer_1.appendChild(himmel2);
		layer_1.appendChild(himmel1);
		layer_1.appendChild(landschaftHinten2);
		layer_1.appendChild(landschaftHinten1);
		layer_1.appendChild(landschaftVorne2);
		layer_1.appendChild(landschaftVorne1);
		layer_1.appendChild(erde1);
		layer_1.appendChild(erde2);
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
        

    var drehungErde1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(20).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungErde2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(20).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungLandschaftVorne1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(20).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungLandschaftVorne2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(20).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(90).setDuration(20).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungLandschaftHinten1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(90).setDuration(35).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(35).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungLandschaftHinten2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(35).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(90).setDuration(35).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungHimmel1 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(90).setDuration(50).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(50).setEasing(lime.animation.Easing.LINEAR)              
            )
    );
    
    var drehungHimmel2 = new lime.animation.Loop(
    	    new lime.animation.Sequence(
    	      new lime.animation.RotateTo(180).setDuration(0).setEasing(lime.animation.Easing.LINEAR),	
        	  new lime.animation.RotateTo(270).setDuration(0).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(360).setDuration(50).setEasing(lime.animation.Easing.LINEAR),
              new lime.animation.RotateTo(90).setDuration(50).setEasing(lime.animation.Easing.LINEAR)              
            )
    );    
    erde1.runAction(drehungErde1);
    erde2.runAction(drehungErde2);
    landschaftHinten1.runAction(drehungLandschaftHinten1);
    landschaftHinten2.runAction(drehungLandschaftHinten2);
    landschaftVorne1.runAction(drehungLandschaftVorne1);
    landschaftVorne2.runAction(drehungLandschaftVorne2);
    himmel1.runAction(drehungHimmel1);
    himmel2.runAction(drehungHimmel2);
       



   
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
