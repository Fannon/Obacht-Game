/* global goog, lime, obacht */
/* jshint strict: false, devel:true */

goog.provide('obacht.Join');


//Variables
    //Code
    var codeArray = [4];
    codeArray[0] = '_';
    codeArray[1] = '_';
    codeArray[2] = '_';
    codeArray[3] = '_';
    
     //Position of the Code to change
    var codeposition = 0;

    //Complete Code to Check
    var code = codeArray[0]+codeArray[1]+codeArray[2]+codeArray[3];
    
    //Code with Spaces for visualization
    var codeVisualization = codeArray[0]+' '+codeArray[1]+' '+codeArray[2]+' '+codeArray[3];
    
    //Code-Field    
    var field = new lime.RoundedRect().setFill('#888').setRadius(15).setPosition(640, 360).setSize(300, 130);
    field.label = new lime.Label().setAlign('center').setText(codeVisualization).setFontColor('#eef').setFontSize(80).setSize(300, 80).setFontWeight('bold');

    field.appendChild(field.label);    
    
    
obacht.Join = function() {
    var sceneMenu = new lime.Scene();
    
    // set current scene active
    obacht.director.replaceScene(sceneMenu);

    var layerMenu = new lime.Layer();
    sceneMenu.appendChild(layerMenu);
        
    layerMenu.appendChild(field);

    //Keyboard
	var key0 = obacht.NumberKey(125,'0');
	var key1 = obacht.NumberKey(205,'1');
	var key2 = obacht.NumberKey(285,'2');
	var key3 = obacht.NumberKey(365,'3');
	var key4 = obacht.NumberKey(445,'4');
	var key5 = obacht.NumberKey(525,'5');
	var key6 = obacht.NumberKey(605,'6');
	var key7 = obacht.NumberKey(685,'7');
	var key8 = obacht.NumberKey(765,'8');
	var key9 = obacht.NumberKey(845,'9');
	var keyDelete = obacht.NumberKey(925,'<');
	
	layerMenu.appendChild(key0);    
	layerMenu.appendChild(key1);    
	layerMenu.appendChild(key2);    
	layerMenu.appendChild(key3);    
	layerMenu.appendChild(key4);    
	layerMenu.appendChild(key5);    
	layerMenu.appendChild(key6);    
	layerMenu.appendChild(key7);    
	layerMenu.appendChild(key8);    
	layerMenu.appendChild(key9);   
	layerMenu.appendChild(keyDelete);   
	
    
    // Listener for number-keys
    goog.events.listen(key0, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('0');
    });
    goog.events.listen(key1, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('1');
    });
    goog.events.listen(key2, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('2');
    });
    goog.events.listen(key3, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('3');
    });
    goog.events.listen(key4, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('4');
    });
    goog.events.listen(key5, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('5');
    });
    goog.events.listen(key6, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('6');
    });
    goog.events.listen(key7, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('7');
    });
    goog.events.listen(key8, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('8');
    });
    goog.events.listen(key9, lime.Button.Event.CLICK, function(){
    	obacht.addNumber('9');
    });
       
        
    // Listener for delete-key
	goog.events.listen(keyDelete, lime.Button.Event.CLICK, function() {
        obacht.deleteNumber();
    });    
            
};

//Create Keys
obacht.NumberKey = function (x,number) {
    var key = new lime.RoundedRect().setFill('#888').setRadius(15).setPosition(x, 550).setSize(70, 70);
    key.label = new lime.Label().setAlign('center').setText(number).setFontColor('#fff').setFontSize(40).setSize(70, 45).setFontWeight('bold');
    key.appendChild(key.label);
    return key;   
};

//Add Number
obacht.addNumber = function (insertNumber) {
    	codeArray[codeposition] = insertNumber;
        if(codeposition<4){
            codeposition++;
        }
        code = codeArray[0]+codeArray[1]+codeArray[2]+codeArray[3];
        codeVisualization = codeArray[0]+' '+codeArray[1]+' '+codeArray[2]+' '+codeArray[3];
        field.label.setText(codeVisualization);
};

//Delete Number
obacht.deleteNumber = function (){
	codeArray[codeposition-1] = '_';	
    
    if(codeposition>0){
        codeposition--;
    }
    code = codeArray[0]+codeArray[1]+codeArray[2]+codeArray[3];
    codeVisualization = codeArray[0]+' '+codeArray[1]+' '+codeArray[2]+' '+codeArray[3];
    field.label.setText(codeVisualization);		
};

// this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('obacht.start', obacht.start);