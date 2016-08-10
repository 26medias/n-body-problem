/*
	Basic proof of concept
*/

var engine = new Engine();

engine.add('Earth', 0, 0, {
	radius:	6371,
	mass:	5.97237e+24
});

engine.add('Moon', 356500, 33, {
	radius:	1737,
	mass:	7.342e+22
});

engine.start();