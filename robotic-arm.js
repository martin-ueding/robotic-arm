// Copyright © 2012 Martin Ueding <dev@martin-ueding.de>

/*****************************************************************************/
/*                                  Options                                  */
/*****************************************************************************/

var width = 300;
var height = 200;
var radius = 30;

var circleAttributes = {
	fill: "red"
};

/*****************************************************************************/
/*                              Implementation                               */
/*****************************************************************************/

var maxrange = width - 4 * radius;
var range = maxrange / 2;

var main = function() {

	var paper = Raphael("roboticarm", width, height);


	var dots = [
		paper.circle(radius, height-radius, radius).attr(circleAttributes),
		paper.circle(radius + range/2, height-radius, radius).attr(circleAttributes)
			];
};

window.onload = main;
