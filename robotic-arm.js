// Copyright © 2012 Martin Ueding <dev@martin-ueding.de>

/*****************************************************************************/
/*                                  Options                                  */
/*****************************************************************************/

var width = 300;
var height = 200;
var radius = 10;
var thickness = 4;

var circleAttributes = {
	fill: "red"
};

var armAttributes = {
	fill: "gray"
};

/*****************************************************************************/
/*                              Implementation                               */
/*****************************************************************************/

var first, middle, last, arm1, arm2;

var maxrange = width - 2 * radius;
var range = maxrange / 2;

var armLength = maxrange / 2;

var angle = function(range) {
	var p = range/(2 * armLength);
	return Math.acos(p);
};

var midPos = function(range) {
	return {
		x: range / 2 + radius,
			y: height - Math.sin(angle(range)) * armLength - radius
	};
};

var onMove = function(dx, dy, x, y, e) {
	if (x > width - radius) {
		x = width - radius;
	}
	else if (x < 3 * radius) {
		x = 3 * radius;
	}

	this.attr({cx: x});

	range = x - radius;

	p = midPos(range);

	middle.attr({
		cx: p.x,
		cy: p.y
	});

	setTransform(range);
};

var onStart = function(x, y, e) {
};

var onEnd = function(e) {
};

var middle = undefined;

var setTransform = function(range) {
	var a = angle(range) * 180 / Math.PI;

	arm1.transform("t-"+armLength/2+",0r-"+a+"t"+armLength/2+",0");
	mid = midPos(range);
	arm2.attr({x: mid.x, y: mid.y});
	arm2.transform("t-"+armLength/2+",0r"+a+"t"+armLength/2+",0");
};

var main = function() {
	var paper = Raphael("roboticarm", width, height);
	
	var initMidPos = midPos(range);

	var x1 = radius;
	var y1 = height-radius;
	var x2 = initMidPos.x;
	var y2 = initMidPos.y;
	var x3 = range + radius;
	var y3 = height-radius;

	arm1 = paper.rect(x1, y1, maxrange/2, thickness);
	arm2 = paper.rect(x2, y2, maxrange/2, thickness);

	first = paper.circle(x1, y1, radius).attr(circleAttributes);
	middle = paper.circle(x2, y2, radius).attr(circleAttributes);
	last = paper.circle(x3, y3, radius).attr(circleAttributes);

	last.attr({cursor: "move"});

	last.drag(onMove, onStart, onEnd);
};

window.onload = main;
