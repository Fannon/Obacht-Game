goog.provide('prototype_martin');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.ScaleBy');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');


// entrypoint
prototype_martin.start = function(){

	var director = new lime.Director(document.body,1280,720),
	    
        scene = new lime.Scene(),
        planet_bottom =  new lime.Circle().setSize(2100,2100).setPosition(200,1500).setFill(0,0,0),
        planet_top =  new lime.Circle().setSize(2100,2100).setPosition(1080,-780).setFill(0,0,0),
        character = new lime.Circle().setSize(100, 150).setPosition(200, 400).setFill('#d5622f'),
        hindernis = new lime.Circle().setSize(75, 150).setPosition(0, -1065).setFill(0,0,0);
    
    planet_bottom.appendChild(hindernis);
    scene.appendChild(character);
    scene.appendChild(planet_bottom);
    scene.appendChild(planet_top);

	director.makeMobileWebAppCapable();



    /* ANIMATION */
    ///////////////

    var turnPlanet = new lime.animation.Loop(
        new lime.animation.RotateBy(360).setDuration(6).setEasing(lime.animation.Easing.LINEAR)
    );

    var jump = new lime.animation.Sequence(
        new lime.animation.MoveBy(0, -280).setDuration(0.2).setEasing(lime.animation.Easing.EASEOUT),
        new lime.animation.MoveBy(0, 280).setDuration(0.45).setEasing(lime.animation.Easing.EASEIN)
    );

    planet_bottom.runAction(turnPlanet);


    /* EVENTLISTENERS */
    ////////////////////

    var touchStartY;
    var touchEndY;

    goog.events.listen(scene, ['touchstart', 'mousedown'], function(e) {
        touchStartY = Math.round(e.position.y)
    });

    goog.events.listen(scene, ['touchend', 'mouseup'], function(e) {
        touchEndY = Math.round(e.position.y)
        if (touchEndY < touchStartY) {
            character.runAction(jump);
        } else {
            return;
        }
    });



	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('prototype_martin.start', prototype_martin.start);
