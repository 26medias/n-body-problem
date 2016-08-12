/*
	Note: Y coordinates are reversed, origin is on the bottom left as it should be.
*/


var Engine = function(options) {
	this.options	= _.extend({
		renderer:	{
			objects:	$('.simulator>#objects'),
			gravity:	$('.simulator>#gravity')
		}
	}, options);
	
	this.objects	= {};
	
	this.G	= 6.673e+11;	// Gravitationnal constant
	
	this.renderers	= {
		objects:	new Renderer(this.options.renderer.objects),
		gravity:	new Renderer(this.options.renderer.gravity)
	};
	
}
Engine.prototype.add = function(name, distance, angle, props) {
	this.objects[name]	= {
		distance:	distance,
		angle:		angle,
		props:		props,
		coords:		{}
	};
}
Engine.prototype.calculateScale = function() {
	var scope = this;
	var maxDistance	 = 0;
	_.each(this.objects, function(object, name) {
		if (object.distance>maxDistance) {
			maxDistance	= object.distance;
		}
	});
	
	this.scale	= {
		scale:	(maxDistance/(Math.min(this.renderers.objects.width, this.renderers.objects.height)/2))*1.05,
		cx:		this.renderers.objects.width/2,
		cy:		this.renderers.objects.height/2
	};
	
}
Engine.prototype.refresh = function() {
	var scope = this;
	
	// Calculate the scale of the scene
	this.calculateScale();
	
	// Clear the canvas
	this.renderers.objects.clear();
	
	// Process the objects
	_.each(this.objects, function(object, name) {
		
		// Get and save the global coordinates
		scope.objects[name].coords		= scope.da2xy(object.distance, object.angle);
		
		console.info(name, object);
		
		// Draw the circle
		scope.renderers.objects.circle(scope.g2l(scope.objects[name].coords.x, scope.objects[name].coords.y), Math.round(object.props.radius/scope.scale.scale));
		/*
		// Draw the line around
		_.each(_.range(0,90,10), function(n) {
			//console.log(">> Angle: ", n ,scope.g2l(scope.da2xy(100000, n, object)));
			scope.renderers.objects.pixel(scope.g2l(scope.da2xy(100000, n, object)),n==0?{r:255,g:0,b:0,a:1}:{r:0,g:0,b:0,a:1});
		});
		*/
	});
	
}



Engine.prototype.gravityAt = function(x, y) {
	var scope = this;
	var g	= 0;
	var exclude	= false;
	_.each(this.objects, function(object, name) {
		var da	= scope.xy2da(x,y,object)
		// Exclude the gravity inside objects
		if (da.d<object.props.radius) {
			exclude	= true;
		}
		g	+= ((scope.G*object.props.mass)/Math.pow(da.d*1000,2))/10e22;
	});
	
	return !exclude?g:0;
}


Engine.prototype.renderGravityField = function() {
	var scope = this;
	scope.renderers.gravity.heatmap(function(x,y) {
		return scope.gravityAt(x,y)
	});
}



/*
Engine.prototype.getGravityAt = function(object, d, a) {
	var scope = this;
	
	var pointCoord	= this.da2xy(d, a);
	var newCoords	= {
		x:	object.coords.x+pointCoord.x,
		y:	object.coords.y+pointCoord.y
	};
	
	var G	= 6.673e+11;
	var g	= 0;
	
	_.each(this.objects, function(object, name) {
		// Render the position from each object using a line
		scope.renderers.objects.line(scope.g2l(newCoords), scope.g2l(object.coords), {r:74,g:166,b:240,a:0.8});
		
		// Caluclate the distance
		var d = Math.sqrt(Math.pow(Math.abs(newCoords.x-object.coords.x),2)+Math.pow(Math.abs(newCoords.y-object.coords.y),2));
		console.log("> "+name+" distance", d);
		
		var localG	= (G*object.props.mass)/Math.pow(d,2);
		console.log("> "+name,"local g", localG);
		g	+= localG;
	});
	
	console.log("Total g",g);
}
*/




// Angle conversion
Engine.prototype.deg2rad = function(a) {
	return a*Math.PI/180
}
Engine.prototype.rad2deg = function(a) {
	return a*180/Math.PI;
}
// Coordinate systems
// Distance-Angle to Global XY (from the origin of from an object)
Engine.prototype.da2xy = function(d, a, object) {
	if (object) {
		var pointCoord	= this.da2xy(d, a);
		
		var newCoords	= {
			x:	object.coords.x+pointCoord.x,
			y:	object.coords.y+pointCoord.y
		};
		
		return newCoords;
	} else {
		return {
			x:	Math.cos(this.deg2rad(a))*d,
			y:	Math.sin(this.deg2rad(a))*d
		}
	}
}
Engine.prototype.xy2da = function(x, y, object) {
	
	var globalCoords	= this.l2g(x, y);
	
	//return globalCoords;
	
	var cx	= 0;
	var cy	= 0;
	
	if (object) {
		cx	= object.coords.x;
		cy	= object.coords.y;
	}
	
	// The easy one: distance (basic pythagore)
	var d	= Math.sqrt(Math.pow(Math.abs(globalCoords.x-cx),2)+Math.pow(Math.abs(globalCoords.y-cy),2));
	
	// The angle
	var a	= this.rad2deg(Math.atan2((globalCoords.y-cy),(globalCoords.x-cx)));
	if (a<0) {
		a	= 360+a;
	}
	
	
	return {
		d:	d,
		a:	a
	};
}
// Global coordinates to local coordinates
Engine.prototype.g2l = function(x,y) {
	
	if (_.isObject(x) && !y) {
		var y = x.y;
		var x = x.x;
	}
	
	return {
		x:	Math.round(this.scale.cx+x/this.scale.scale),
		y:	Math.round(this.scale.cy+y/this.scale.scale)
	}
}
// Local coordinates to global coordinates
Engine.prototype.l2g = function(x,y) {
	
	if (_.isObject(x) && !y) {
		var y = x.y;
		var x = x.x;
	}
	
	return {
		x:	(x-this.scale.cx)*this.scale.scale,
		y:	(y-this.scale.cy)*this.scale.scale
	}
}


Engine.prototype.start = function() {
	this.refresh();
}
