// Copyright © 2012 Martin Ueding <dev@martin-ueding.de>

/*
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var roboticArm = function(width, height, totalMeasure) {
	this.width = width;
	this.height = height - 50;
	this.totalheight = height;
	this.totalMeasure = totalMeasure;
	this.radius = [20, 18, 15];
	this.thickness = [15, 4];

	this.circleAttributes = {
		fill: "white",
		stroke: "blue",
	};

	this.armAttributes = {
		fill: "white",
		stroke: "blue",
	};

	this.first, this.middle, this.last, this.arm1, this.arm2;

	this.maxrange = this.width - this.radius[0] - this.radius[2];
	this.range = this.maxrange / 2;

	this.armLength = this.maxrange / 2;

	this.angle = function(range) {
		var p = range/(2 * this.armLength);
		return Math.acos(p);
	};

	this.midPos = function(range) {
		return {
			x: this.range / 2 + this.radius[0],
			y: this.height - Math.sin(this.angle(range)) * this.armLength - this.radius[0]
		};
	};

	this.onMove = function(dx, dy, x, y, e) {
		if (x > this.width - this.radius[2]) {
			x = this.width - this.radius[2];
		}
		else if (x < 2 * this.radius[0] + this.radius[2]) {
			x = 2 * this.radius[0] + this.radius[2];
		}

		this.last.attr({cx: x});

		this.range = x - this.radius[0];

		var p = this.midPos(this.range);

		this.middle.attr({
			cx: p.x,
			cy: p.y,
		});

		this.setTransform(this.range);
	};

	this.onStart = function(x, y, e) {
	};

	this.onEnd = function(e) {
	};

	this.middle = undefined;

	this.setTransform = function(range) {
		var a = this.angle(range) * 180 / Math.PI;

		this.arm1.transform("t-"+this.armLength/2+",0r-"+a+"t"+this.armLength/2+",0");
		var mid = this.midPos(range);
		this.arm2.attr({x: mid.x, y: mid.y - this.thickness[1]/2});
		this.arm2.transform("t-"+this.armLength/2+",0r"+a+"t"+this.armLength/2+",0");
	};

	this.realRangePart = function(range) {
		return (range-this.radius[0]-this.radius[2])/(this.maxrange-this.radius[0]-this.radius[2]);
	};

	this.realRange = function(range) {
		return this.totalMeasure * this.realRangePart(range);
	}

	this.drawRuler = function(paper) {
		var y = this.height - (this.radius[0] - this.radius[2]) + 2;
		var x = 2 * this.radius[0] + this.radius[2];
		var end = this.width - this.radius[2];
		var step = (end - x) / 25;
		var ticks = [];
		for (var i = 0; x <= end; x += step, ++i) {
			var width = i % 5 == 0 ? 2 : 1;
			ticks.push(paper.path("M"+x+","+y+"v5").attr({fill: "#000", stroke: "#000", "stroke-width": width}));
			if (i % 5 == 0) {
				ticks.push(paper.text(x, y+20, Math.round(this.realRange(x - this.radius[0]))));
			}
		}
	};

	this.main = function() {
		var paper = Raphael("roboticarm", this.width, this.totalheight);

		var initMidPos = this.midPos(this.range);

		var x1 = this.radius[0];
		var y1 = this.height-this.radius[0];
		var x2 = initMidPos.x;
		var y2 = initMidPos.y;
		var x3 = this.range + this.radius[0];
		var y3 = this.height-this.radius[0];

		this.arm1 = paper.rect(x1, y1-this.thickness[0]/2, this.maxrange/2, this.thickness[0]).attr(this.armAttributes);
		this.arm2 = paper.rect(x2, y2-this.thickness[1]/2, this.maxrange/2, this.thickness[1]).attr(this.armAttributes);

		this.first = paper.circle(x1, y1, this.radius[0]).attr(this.circleAttributes);
		this.middle = paper.circle(x2, y2, this.radius[1]).attr(this.circleAttributes);
		this.last = paper.circle(x3, y3, this.radius[2]).attr(this.circleAttributes);

		this.last.attr({cursor: "move"});

		this.last.drag(this.onMove.bind(this), this.onStart.bind(this), this.onEnd.bind(this));

		this.setTransform(this.range);

		this.drawRuler(paper);
	};

	window.onload = this.main.bind(this);
};
