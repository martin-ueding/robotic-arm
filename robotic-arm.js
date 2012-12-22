// Copyright © 2012 Martin Ueding <dev@martin-ueding.de>

/*****************************************************************************/
/*                                  Options                                  */
/*****************************************************************************/

var width = 600;
var height = 400;
var radius = [20, 18, 15];
var thickness1 = 15;
var thickness2 = 7;

var circleAttributes = {
	fill: "white",
	stroke: "blue",
};

var armAttributes = {
	fill: "white",
	stroke: "blue",
};

/*****************************************************************************/
/*                              Implementation                               */
/*****************************************************************************/

var first, middle, last, arm1, arm2, text;

var maxrange = width - radius[0] - radius[2];
var range = maxrange / 2;

var armLength = maxrange / 2;

var angle = function(range) {
	var p = range/(2 * armLength);
	return Math.acos(p);
};

var midPos = function(range) {
	return {
		x: range / 2 + radius[0],
			y: height - Math.sin(angle(range)) * armLength - radius[0]
	};
};

var onMove = function(dx, dy, x, y, e) {
	if (x > width - radius[2]) {
		x = width - radius[2];
	}
	else if (x < 2 * radius[0] + radius[2]) {
		x = 2 * radius[0] + radius[2];
	}

	this.attr({cx: x});

	range = x - radius[0];

	p = midPos(range);

	middle.attr({
		cx: p.x,
		cy: p.y,
	});

	setTransform(range);
	updateText(range);
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
	arm2.attr({x: mid.x, y: mid.y - thickness2/2});
	arm2.transform("t-"+armLength/2+",0r"+a+"t"+armLength/2+",0");
};

var realRangePart = function(range) {
	return (range-radius[0]-radius[2])/(maxrange-radius[0]-radius[2]);
};

var updateText = function(range) {
	text.attr({text: "Reichweite "+Math.round(realRangePart(range)*100)+" %"});
};

var main = function() {
	var paper = Raphael("roboticarm", width, height);
	
	var initMidPos = midPos(range);

	var x1 = radius[0];
	var y1 = height-radius[0];
	var x2 = initMidPos.x;
	var y2 = initMidPos.y;
	var x3 = range + radius[0];
	var y3 = height-radius[0];

	arm1 = paper.rect(x1, y1-thickness1/2, maxrange/2, thickness1).attr(armAttributes);
	arm2 = paper.rect(x2, y2-thickness2/2, maxrange/2, thickness2).attr(armAttributes);

	first = paper.circle(x1, y1, radius[0]).attr(circleAttributes);
	middle = paper.circle(x2, y2, radius[1]).attr(circleAttributes);
	last = paper.circle(x3, y3, radius[2]).attr(circleAttributes);

	last.attr({cursor: "move"});

	last.drag(onMove, onStart, onEnd);

	setTransform(range);

	text = paper.text(width/2, 20);
	updateText(range);
};

window.onload = main;
