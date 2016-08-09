/*
	Basic proof of concept
*/

var engine = new Engine({
	scale:	2000
});

engine.add('Sun', 0, 0, {
	radius:	695700,
	mass:	1.98855e+30
});

engine.add('Earth', 0, 149597870700, {
	radius:	6371,
	mass:	5.97237e+24
});

engine.start();