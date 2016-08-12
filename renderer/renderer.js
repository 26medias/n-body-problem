
var Renderer = function(canvas) {
	this.el				= $(canvas);
	this.canvas			= this.el.get(0);
	this.clear();
}
Renderer.prototype.clear = function() {
	
	this.canvas.width	= this.el.parent().innerWidth();
	this.canvas.height	= this.el.parent().innerHeight();
    this.context		= this.canvas.getContext('2d');
    
    this.width			= this.canvas.width;
    this.height			= this.canvas.height;
    
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
Renderer.prototype.reverse = function(y) {
	return this.height-y;
}
Renderer.prototype.circle = function(coords, r) {
	this.context.beginPath();
	this.context.arc(coords.x, this.reverse(coords.y), r, 0, 2 * Math.PI, false);
	this.context.fillStyle = '#333333';
	this.context.fill();
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#EBEDEF';
	this.context.stroke();
}
Renderer.prototype.pixel = function(coords, rgba) {
	this.context.fillStyle	= "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+(rgba.a)+")";
	this.context.fillRect(coords.x, this.reverse(coords.y), 1, 1);
}
Renderer.prototype.line = function(from, to, rgba) {
	console.log("line",from, to);
	this.context.lineWidth		= 1;
	this.context.strokeStyle	= "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+(rgba.a)+")";
	this.context.beginPath();
	this.context.moveTo(from.x, this.reverse(from.y));
	this.context.lineTo(to.x, this.reverse(to.y));
	this.context.stroke();
}
// Call a funtion on each piwxel to assigna  value, then heatmap the shit out of it
Renderer.prototype.heatmap = function(getValue) {
	var x,y,i,rgba;
	var l	= this.width*this.height;
	var matrix	= new Float32Array(l);
	var range	= {min:1000000,max:-1000000};
	for (y=1;y<=this.height;y++) {
		for (x=1;x<=this.width;x++) {
			matrix[this.index(x,this.reverse(y))]	= getValue(x,y);
			if (matrix[this.index(x,this.reverse(y))] > 1) {
				matrix[this.index(x,this.reverse(y))] = 1;
			}
		}
	}
	// Draw the heatmap
	var rainbow	= new Rainbow();
	rainbow.setSpectrum.apply(null, ['#000080', '#00FFFF', '#FFFF00', '#800000']);
	rainbow.setNumberRange(0,255);
	
	var imageData	= this.context.getImageData(0, 0, this.width, this.height);
	var data		= imageData.data;
	
	for (i=0;i<l;i++) {
		if (matrix[i]>0) {
			rgba	= rainbow.rgbAt(this.map(matrix[i],0,1,0,255),100);
			
			data[i*4+0]	= rgba.r;
			data[i*4+1]	= rgba.g;
			data[i*4+2]	= rgba.b;
			data[i*4+3]	= rgba.a;
		}
	}
	
	//console.log("data",data);
	
	this.context.putImageData(imageData, 0, 0);
}

// Utils
Renderer.prototype.map = function( x,  in_min,  in_max,  out_min,  out_max) {
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
Renderer.prototype.index = function(x, y, w) {
	if (!w) {
		w = this.width;
	}
	return y * w + x;
}
Renderer.prototype.inv_index = function(i, w) {
	/*
		y	= (i/w)^0
		x	= i-(y*w)
	*/
	if (!w) {
		w = this.width;
	}
	var y	= (i/w)^0;
	var x	= i-(y*w);
	return {
		x:	x,
		y:	y
	}
}