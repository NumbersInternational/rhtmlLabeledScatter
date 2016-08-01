// Generated by CoffeeScript 1.8.0
'use strict';
var LabeledScatter;

LabeledScatter = (function() {
  LabeledScatter.plot = null;

  LabeledScatter.data = null;

  function LabeledScatter(width, height) {
    this.width = width;
    this.height = height;
  }

  LabeledScatter.prototype.resize = function(el, width, height) {
    var svg;
    this.width = width;
    this.height = height;
    d3.select('.plot-container').remove();
    svg = d3.select(el).append('svg').attr('width', this.width).attr('height', this.height).attr('class', 'plot-container');
    return this.plot.setDim(svg, this.width, this.height);
  };

  LabeledScatter.prototype.draw = function(data, el) {
    var svg;
    svg = d3.select(el).append('svg').attr('width', this.width).attr('height', this.height).attr('class', 'plot-container');
    if ((data.X != null) && (data.Y != null)) {
      this.data = data;
    } else {
      this.data = testData;
      this.data.fixedAspectRatio = false;
    }
    this.plot = new RectPlot(this.width, this.height, this.data.X, this.data.Y, this.data.group, this.data.label, svg, this.data.fixedAspectRatio);
    return this.plot.draw();
  };

  return LabeledScatter;

})();
