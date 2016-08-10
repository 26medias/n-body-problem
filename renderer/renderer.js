
var Renderer = function(canvas) {
	this.canvas			= $(canvas).get(0);
	this.canvas.width	= $(canvas).parent().innerWidth();
	this.canvas.height	= $(canvas).parent().innerHeight();
    this.context		= this.canvas.getContext('2d');
    
    this.width			= this.canvas.width;
    this.height			= this.canvas.height;
    
    // Pre-create a pixel for speed
    this._pixel			= this.context.createImageData(1,1);
    this._pixelData		= this._pixel.data;
    
}
Renderer.prototype.clear = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
Renderer.prototype.circle = function(props) {
	this.context.beginPath();
	this.context.arc(props.x, props.y, props.r, 0, 2 * Math.PI, false);
	this.context.fillStyle = '#333333';
	this.context.fill();
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#EBEDEF';
	this.context.stroke();
}
Renderer.prototype.pixel = function(x, y, rgba) {
	this.context.fillStyle	= "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+(rgba.a)+")";
	this.context.fillRect(x, y, 1, 1);
	
	/*this._pixelData[0]   = rgba.r;
	this._pixelData[1]   = rgba.g;
	this._pixelData[2]   = rgba.b;
	this._pixelData[3]   = rgba.a;
	this.context.putImageData(this._pixel,x,y);*/
}
