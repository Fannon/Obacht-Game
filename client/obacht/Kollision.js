goog.provide('obacht.Kollision');

obacht.Kollision = function(object1,object2){

    object1pos=object1.getPosition();
    object2pos=object2.getPosition();

    var obj1 = new Array();
    var obj2 = new Array();

    obj1[0]=Math.round(object1pos.x/10)*10-(object1.getSize().width/2);
    obj1[1]=Math.round(object1pos.y/10)*10-(object1.getSize().height/2);

    obj1w=hindernis.getSize().width;
    obj1h=hindernis.getSize().height;

    obj2[0]=Math.round(object2pos.x/10)*10-(object2.getSize().width/2);
    obj2[1]=Math.round(object2pos.y/10)*10-(object2.getSize().height/2);

    obj2w=object2.getSize().width;
    obj2h=object2.getSize().height;

    return 	obj1[0] < obj2[0] + obj2w  &&
		obj2[0] < obj1[0] + obj1w  &&
		obj1[1] < obj2[1] + obj2h &&
		obj2[1] < obj1[1] + obj1h;
};
