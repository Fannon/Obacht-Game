goog.provide('obacht.Collision');

obacht.Collision = function(object1,object2){

    this.object1pos = object1.getPosition();
    this.object2pos = object2.getPosition();

    this.obj1x = Math.round(this.object1pos.x/10) * 10 - (object1.getSize().width/2);
    this.obj1y = Math.round(this.object1pos.y/10) * 10 - (object1.getSize().height/2);

    this.obj1w = object1.getSize().width;
    this.obj1h = object1.getSize().height;

    this.obj2x = Math.round(this.object2pos.x/10) * 10 - (object2.getSize().width/2);
    this.obj2y = Math.round(this.object2pos.y/10) * 10 - (object2.getSize().height/2);

    this.obj2w = object2.getSize().width;
    this.obj2h = object2.getSize().height;

};

obacht.Collision.prototype = {
    rect: function() {
        "use strict";
        return this.obj1x < this.obj2x + this.obj2w  &&
		this.obj2x < this.obj1x + this.obj1w  &&
		this.obj1y < this.obj2y + this.obj2h &&
		this.obj2y < this.obj1y + this.obj1h;
    }
};