goog.provide('prototype_lukas.Game');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');

//////////
/* INIT */
//////////

prototype_lukas.Game = function(mode){
	lime.Sprite.call(this);
	
    this.WIDTH = 1280;
    this.HEIGHT = 720;
    this.mode = mode;
    this.losingScore = 3;
    this.setAnchorPoint(0, 0);	
    this.setFill(bg_wueste.jpg);

    var scene = new lime.Scene(),
        planet_bottom = new lime.Circle().setSize(2100,2100).setPosition(200,1500).setFill(0,0,0),
        planet_top =  new lime.Circle().setSize(2100,2100).setPosition(1080,-780).setFill(0,0,0),
        character = new lime.Circle().setSize(100, 150).setPosition(200, 470).setAnchorPoint(0.5, 1).setFill('#d5622f'),
        hindernis = new lime.Circle().setSize(75, 150).setPosition(0, -1065).setFill(0,0,0),
        jumpArea =  new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0,0).setAnchorPoint(0,0),
        crouchArea = new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0, VIEWPORT_HEIGHT / 2).setAnchorPoint(0,0),
        
        /* ITEMS
         * diese sind im moment noch statisch und müssen später generiert werden
         */
        itemAir = new lime.Circle().setSize(150, 75).setPosition(1260, 350).setFill(0,0,0),
        itemGround = new lime.Circle().setSize(150, 75).setPosition(200, 200).setFill(0,0,0),
        
        /* BUTTON ITEMS
         * die drei Buttons mit denen Items abgefeuert werden können
         */
        ItemOneArea = new lime.Node().setSize(120, 120).setPosition(800,20).setAnchorPoint(0,0),
        ItemTwoArea = new lime.Node().setSize(120, 120).setPosition(940,20).setAnchorPoint(0,0),
        ItemThreeArea = new lime.Node().setSize(120, 120).setPosition(1080,20).setAnchorPoint(0,0),
        
        // ITEM BUTTON // 
        buttonOne = new lime.RoundedRect().setSize(120,120).setPosition(60,60).setFill('#ffffff'),
        buttonTwo = new lime.RoundedRect().setSize(120,120).setPosition(60,60).setFill('#ffffff'),
        buttonThree = new lime.RoundedRect().setSize(120,120).setPosition(60,60).setFill('#ffffff'),
        
        // LAYER_1 - BACKGROUNDS //
        layer_1 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    
        // LAYER_2 – OBJECTS //
        layer_2 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT),

        // LAYER_3 – INTERACTION //
        layer_3 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        
       

    planet_bottom.appendChild(hindernis);
    
    //OBJEKTE LAYER 1 BACKGROUND
    
    
    //OBJEKTE LAYER 2 PLANETEN, CHARAKTER, HINDERNISSE
    layer_2.appendChild(planet_bottom);
    layer_2.appendChild(planet_top);
    layer_2.appendChild(character);
    layer_2.appendChild(itemAir);
    layer_2.appendChild(itemGround);
    
    //OBJEKTE LAYER 3 (INTERAKTION)
    layer_3.appendChild(jumpArea);
    layer_3.appendChild(crouchArea);
    layer_3.appendChild(ItemOneArea);
    layer_3.appendChild(ItemTwoArea);
    layer_3.appendChild(ItemThreeArea);
    
    ItemOneArea.appendChild(buttonOne);
    ItemTwoArea.appendChild(buttonTwo);
    ItemThreeArea.appendChild(buttonThree);



    scene.appendChild(layer_1);
    scene.appendChild(layer_2);
    scene.appendChild(layer_3);

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
    
    var flyingAttack = new lime.animation.MoveTo(-200, 350).setDuration(1);
    
	function fly(){
		itemAir.runAction(flyingAttack);
	  	itemAir.setPosition(1260, 350);
	};
	
    planet_bottom.runAction(turnPlanet);


    
////////////////////
/* EVENTHANDLING */
////////////////////

	//CONTROLLER CHARACTER
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
    
    //CONTROLLER ITEMS
    goog.events.listen(ItemOneArea,['mousedown','touchstart'], function(e){
    	fly();
    }) 
}
goog.inherits(prototype_lukas.Game, lime.Sprite);
