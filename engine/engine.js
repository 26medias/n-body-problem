
var Engine = function(options) {
	this.options	= _.extend({
		
	}, options);
	
	this.objects	= {};
	
	this.renderer	= new Renderer($('canvas'));
	
}
Engine.prototype.add = function(name, distance, angle, props) {
	this.objects[name]	= {
		d:		distance,
		a:		angle,
		props:	props
	};
}
Engine.prototype.calculateScale = function() {
	var scope = this;
	var maxDistance	 = 0;
	_.each(this.objects, function(object, name) {
		if (object.d>maxDistance) {
			maxDistance	= object.d;
		}
	});
	
	this.scale	= {
		scale:	(maxDistance/(Math.min(this.renderer.width, this.renderer.height)/2))*1.05,
		cx:		this.renderer.width/2,
		cy:		this.renderer.height/2
	};
	
}
Engine.prototype.refresh = function() {
	var scope = this;
	
	// Calculate the scale of the scene
	this.calculateScale();
	
	// Clear the canvas
	this.renderer.clear();
	
	// Draw the objects
	_.each(this.objects, function(object, name) {
		
		var coords	= scope.da2xy(object.d, object.a);
		
		console.info(name, coords,object);
		
		// Draw the circle
		scope.renderer.circle({
			x:	scope.scale.cx+coords.x,
			y:	scope.scale.cy+coords.y,
			r:	Math.round(object.props.radius/scope.scale.scale)
		});
		
		// Draw the line around
		_.each(_.range(0,360,10), function(n) {
			var xy	= scope.objPoint(object, 100000, n);
			console.log(name,n,xy);
			scope.renderer.pixel(xy.x,xy.y,{r:0,g:0,b:0,a:1});
		});
		
		// Render the gravity well around each object
		scope.renderGravityWell(object);
	});
}
Engine.prototype.objPoint = function(object, d, a) {
	var objCoord	= this.da2xy(object.d, object.a);
	var pointCoord	= this.da2xy(d, a);
	
	return {
		x:	this.scale.cx+objCoord.x+pointCoord.x,
		y:	this.scale.cy+objCoord.y+pointCoord.y
	}
}
Engine.prototype.getGravityAt = function(d, a) {
	
}
Engine.prototype.deg2rad = function(a) {
	return a*Math.PI/180
}
Engine.prototype.rad2deg = function(a) {
	return a*180/Math.PI;
}
Engine.prototype.da2xy = function(d, a) {
	return {
		x:	Math.round(Math.cos(this.deg2rad(a))*d/this.scale.scale),
		y:	Math.round(Math.sin(this.deg2rad(a))*d/this.scale.scale)
	}
}
Engine.prototype.start = function() {
	this.refresh();
}
