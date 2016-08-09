
var Engine = function(options) {
	this.options	= _.extend({
		scale:	2000
	}, options);
	
	this.objects	= {};
	
	this.renderer	= new Renderer($('canvas'));
}
Engine.prototype.add = function(name, x, y, props) {
	this.objects[name]	= {
		x:		x,
		y:		y,
		props:	props
	};
}
Engine.prototype.refresh = function() {
	var scope = this;
	this.renderer.clear();
	_.each(this.objects, function(object, name) {
		scope.renderer.circle({
			x:	object.x,
			y:	object.y,
			r:	100
		});
	});
	
}
Engine.prototype.start = function() {
	this.refresh();
}
