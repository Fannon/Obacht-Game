//set main namespace
goog.provide('prototype_fabi');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Sprite');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');

var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720


// entrypoint
prototype_fabi.start = function(){

    var director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
	    
    scene = new lime.Scene(),
    planet_bottom = new lime.Circle().setSize(2100,2100).setPosition(200,1500).setFill(0,0,0),
    planet_top =  new lime.Circle().setSize(2100,2100).setPosition(1080,-780).setFill(0,0,0),
    
    character = new lime.Sprite().setSize(70, 70).setPosition(200, 470).setAnchorPoint(1, 1).setFill('#d5622f'),
    hindernis = new lime.Sprite().setSize(70, 70).setPosition(200, 1500).setAnchorPoint(1, 1).setFill('#c00'),
    jumpArea =  new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0,0).setAnchorPoint(0,0),
    crouchArea = new lime.Node().setSize(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2).setPosition(0, VIEWPORT_HEIGHT / 2).setAnchorPoint(0,0),
      
    bx=1110;
    by=20;
    
    //button1 = new lime.Sprite().setSize(150,150).setFill('#c00').setPosition(bx,by).setAnchorPoint(0,0);
    button1 = new lime.Sprite().setSize(150,150).setFill('#c00').setPosition(bx,by).setAnchorPoint(0,0);
    button2 = new lime.Sprite().setSize(150,150).setFill('#c00').setPosition(bx-180,by).setAnchorPoint(0,0);
    button3 = new lime.Sprite().setSize(150,150).setFill('#c00').setPosition(bx-360,by).setAnchorPoint(0,0);

	//Labels
	var lbl = new lime.Label().setText('Your Score: 10').setFontFamily('Verdana').
    setFontColor('#c00').setFontSize(18).setFontWeight('bold').setPosition(200,120)
    
	var lbl2 = new lime.Label().setText('Your Score: 10').setFontFamily('Verdana').
    setFontColor('#c00').setFontSize(18).setFontWeight('bold').setPosition(200,60)
	
    // LAYER
    layer_1 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    layer_2 = new lime.Layer().setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        
    layer_1.appendChild(planet_bottom);
    layer_1.appendChild(planet_top);
    layer_1.appendChild(character);
    layer_1.appendChild(hindernis);
    
    layer_1.appendChild(lbl);
    layer_1.appendChild(lbl2);
    
    layer_2.appendChild(jumpArea);
    layer_2.appendChild(crouchArea);

	layer_2.appendChild(button1);      
    layer_2.appendChild(button2);
    layer_2.appendChild(button3);

    scene.appendChild(layer_1);
    scene.appendChild(layer_2);

    director.makeMobileWebAppCapable();

//Beschleunigungsparameter
var velocity = 0.3;
//Anzahl Kollisionen
var kollanz=0;
       
//Startwinkel & Winkelgeschwindigkeit
var startwinkel=45;
var winkel=startwinkel;
var winkelgeschwindigkeit=0.01;
//Startposition
var groundx=300;
var groundy=1400;        

var faktor=935;
       
lime.scheduleManager.schedule(function(dt){
	
    /*Positionen */
    var position = hindernis.getPosition();
	
   	position.x = Math.sin(winkel) * faktor + groundx;
	position.y = Math.cos(winkel) * faktor + groundy;
       
    this.setPosition(position); 
    
    /*Positionen abrufen*/
    hindernispos=hindernis.getPosition();
	characterpos=character.getPosition();
	
	/*ACHTUNG: Da viele Zwischenwerte fehlen sollte man auf 10er Stellen aufrunden*/
	rhpos=Math.round(hindernispos.x/10)*10
	
	//Differenz der Y Koordinaten
	diff=hindernispos.y-characterpos.y;
	//console.log(diff);
	
	//Größe der Objekte abfragen und durch 2 Teilen
	characterboundx=character.getSize().width/2;
	hindernisboundx=hindernis.getSize().width/2;
	//X Kanten festlegen
	characterege_right=characterpos.x+characterboundx;
	characterege_left=characterpos.x-characterboundx;	
	
	hindernisege_right=rhpos+hindernisboundx;
	hindernisege_left=rhpos-hindernisboundx;
	
	//Y Kanten festlegen -> Nur unten und oben NICHT VERWENDET
	characterboundy=character.getSize().height/2;
	hindernisboundy=hindernis.getSize().height/2;
	
	characterege_y=Math.round(characterpos.y/10)*10+characterboundy;
	hindernisege_y=Math.round(hindernispos.y/10)*10-hindernisboundy;
	
	//CHECK: Linke Characterkante auf Hinderniskante Rechts | Rechte Characterkante auf Hinderniskante Links | Mittelpunkt auf Mittelpunkt
	if(characterege_left==hindernisege_right || characterege_right==hindernisege_left || rhpos==characterpos.x){	
		if(characterege_y==hindernisege_y || diff<35){
		winkel=startwinkel;
		kollanz++;
		
		//Neue Flugbahn
		random=Math.floor((Math.random()*3)+1);
			if (random==1){
				faktor=935;
			}else{
				faktor=1000;
			}
		}
	}else if(hindernispos.x<0){
		winkel=startwinkel;
	};
	
	
	//Winkel erhöhen
	winkel=winkel+winkelgeschwindigkeit;
	
	//Text Kollisionsanzahl
	lbl2.setText('Kollision nr: '+kollanz);
	//Characterposition Anzeigen
	lbl.setText(characterege_y+' / '+hindernisege_y);
    
},hindernis);

	
///////////////
/* ANIMATION */
///////////////

    var turnPlanet = new lime.animation.Loop(
        new lime.animation.RotateBy(360).setDuration(4).setEasing(lime.animation.Easing.LINEAR)
    );

    var jumpUp = new lime.animation.MoveBy(0, -280).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT);
    var jumpDown = jumpUp.reverse().setDuration(0.35).setEasing(lime.animation.Easing.EASEIN);
    var jump = new lime.animation.Sequence(jumpUp, jumpDown);

    var crouch = new lime.animation.ScaleTo(1.6, 0.5).setDuration(0.1);
    var standUp = new lime.animation.ScaleTo(1, 1).setDuration(0.1);

    //hindernis.runAction(turnPlanet);
    planet_bottom.runAction(turnPlanet);
    planet_top.runAction(turnPlanet);
    
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
goog.exportSymbol('prototype_fabi.start', prototype_fabi.start);
