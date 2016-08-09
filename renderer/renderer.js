
var Renderer = function(canvas) {
	this.canvas		= $(canvas).get(0);
    this.context	= this.canvas.getContext('2d');
}
Renderer.prototype.clear = function() {
	 this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
Renderer.prototype.circle = function(name, x, y, props) {
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = 'green';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = '#003300';
	context.stroke();
}
Renderer.prototype.start = function(name, x, y, props) {
	
}
