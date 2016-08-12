/*
	Basic proof of concept
*/

var engine = new Engine({
	renderer:	{
		objects:	$('.simulator>#objects'),
		gravity:	$('.simulator>#gravity')
	}
});

engine.add('Earth', 0, 0, {
	radius:	6371,
	mass:	5.97237e+24
});

engine.add('Moon', 356500, 33, {
	radius:	1737,
	mass:	7.342e+22
});

engine.add('Spaceship', 50000, 172, {
	radius:	3000,
	mass:	1.97237e+24
});


engine.start();

engine.renderGravityField();

/*
$('canvas').on('click', function(e) {
	console.info("Click", e.clientX, engine.renderers.gravity.reverse(e.clientY));
	engine.gravityAt(e.clientX, engine.renderers.gravity.reverse(e.clientY));
});
*/

/*
engine.getGravityAt(engine.objects['Moon'], 100000, 0);

$('canvas').on('click', function(e) {
	console.info("Click", e.clientX, engine.renderer.reverse(e.clientY));
	_.each(engine.objects, function(object, name) {
		console.log(name,engine.xy2da(e.clientX, engine.renderer.reverse(e.clientY), object));
	});
});
*/
//engine.refresh();
/*
setInterval(function() {
	// Test the gravity
	//engine.renderer.clear();
	engine.refresh();
	engine.getGravityAt(engine.objects['Moon'], _.random(50000,100000), _.random(0,360));
}, 100);
*/
$(window).on('resize', function() {
	engine.refresh();
});



/*

engine.add('Earth', 0, 0, {
	radius:	6371,
	mass:	5.97237e+24
});

engine.add('Moon', 356500, 33, {
	radius:	1737,
	mass:	7.342e+22
});
*/