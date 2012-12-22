// Copyright © 2012 Martin Ueding <dev@martin-ueding.de>

/*****************************************************************************/
/*                                  Options                                  */
/*****************************************************************************/

var width = 300;
var height = 200;
var radius = 10;

var circleAttributes = {
	fill: "red"
};

/*****************************************************************************/
/*                              Implementation                               */
/*****************************************************************************/

var maxrange = width - 2 * radius;
var range = maxrange / 2;

var armLength = maxrange / 2;

var angle = function(range) {
	return Math.acos(range/(2 * armLength));
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
};

var onStart = function(x, y, e) {
};

var onEnd = function(e) {
};

var middle = undefined;

var main = function() {
	var paper = Raphael("roboticarm", width, height);
	
	var initMidPos = midPos(range);

	var dots = [
		paper.circle(radius, height-radius, radius).attr(circleAttributes),
		paper.circle(initMidPos.x, initMidPos.y, radius).attr(circleAttributes),
		paper.circle(range + radius, height-radius, radius).attr(circleAttributes)
			];

	middle = dots[1];
	var last = dots[2];

	last.attr({cursor: "move"});

	last.drag(onMove, onStart, onEnd);
};

window.onload = main;
