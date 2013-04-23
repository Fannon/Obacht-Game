goog.provide('prototype_lukas');

goog.require('lime.Director');
goog.require('lime.GlossyButton');
goog.require('lime.Layer');
goog.require('lime.Scene');


goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');
//goog.require('prototype_lukas.Game');

var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720



//////////
/* INIT */
//////////

prototype_lukas.start = function(){

	prototype_lukas.director = new lime.Director(document.body, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
	var	scene = new lime.Scene(),
	    layer = new lime.Layer();
	    
	var btn = new lime.GlossyButton('CONNECT WITH A FRIEND').setSize(300, 40).setPosition(640, 100);
	goog.events.listen(btn, 'click', function() {
			prototype_lukas.newgame(1);
	});
	layer.appendChild(btn);

	var btn = new lime.GlossyButton('CONNECT RANDOM').setSize(300, 40).setPosition(640, 200);
	goog.events.listen(btn, 'click', function() {
		prototype_lukas.newgame(1);
	});
	layer.appendChild(btn);
	
	var btn = new lime.GlossyButton('TEST MODE').setSize(300, 40).setPosition(640, 300);
	goog.events.listen(btn, 'click', function() {
		prototype_lukas.newgame(1);
	});
	layer.appendChild(btn);
	
	scene.appendChild(layer);

	prototype_lukas.director.replaceScene(scene);
}


prototype_lukas.newgame = function(mode) {
	var scene = new lime.Scene(),
	layer = new lime.Layer();

	scene.appendChild(layer);

	var game = new prototype_lukas.Game();
	layer.appendChild(game);
	

	prototype_lukas.director.replaceScene(scene);
};

prototype_lukas.Game = function(mode){
	var planet_top =  new lime.Circle().setSize(2100,2100).setPosition(1080,-780).setFill(0,0,0);
	layer = new lime.Layer();
	layer.appendChild(planet_top);
}



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('prototype_lukas.start', prototype_lukas.start);
