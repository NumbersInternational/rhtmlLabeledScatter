// Generated by CoffeeScript 1.8.0
var RectPlot;

RectPlot = (function() {
  function RectPlot(width, height, X, Y, group, label, svg) {
    this.svg = svg;
    this.viewBoxDim = {
      width: width - 200,
      height: height - 60,
      rangeX: Math.max.apply(null, X) - Math.min.apply(null, X),
      rangeY: Math.max.apply(null, Y) - Math.min.apply(null, Y)
    };
    this.viewBoxDim['x'] = 70;
    this.viewBoxDim['y'] = 10;
    this.data = new PlotData(X, Y, group, label, this.viewBoxDim);
    this.minX = this.data.minX;
    this.maxX = this.data.maxX;
    this.minY = this.data.minY;
    this.maxY = this.data.maxY;
  }

  RectPlot.prototype.draw = function() {
    this.svg.append('rect').attr('class', 'plot-viewbox').attr('x', this.viewBoxDim.x).attr('y', this.viewBoxDim.y).attr('width', this.viewBoxDim.width).attr('height', this.viewBoxDim.height).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px');
    this.drawDimensionMarkers();
    this.drawAxisLabels();
    this.drawAnc();
    this.drawLabs();
    return this.drawLegend();
  };

  RectPlot.prototype.drawDimensionMarkers = function() {
    var between, colsNegative, colsPositive, dimensionMarkerLabelStack, dimensionMarkerLeaderStack, dimensionMarkerStack, getTickRange, i, oax, oay, originAxis, pushDimensionMarker, rowsNegative, rowsPositive, ticksX, ticksY, val, x1, x2, y1, y2;
    getTickRange = function(max, min) {
      var maxTicks, pow10x, range, roundedTickRange, unroundedTickSize, x;
      maxTicks = 8;
      range = max - min;
      unroundedTickSize = range / (maxTicks - 1);
      x = Math.ceil(Math.log10(unroundedTickSize) - 1);
      pow10x = Math.pow(10, x);
      roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
      return roundedTickRange;
    };
    between = function(num, min, max) {
      return num > min && num < max;
    };
    pushDimensionMarker = function(type, x1, y1, x2, y2, label) {
      var labelHeight, leaderLineLen, numShown;
      leaderLineLen = 5;
      labelHeight = 15;
      numShown = label.toFixed(1);
      if (type === 'c') {
        dimensionMarkerLeaderStack.push({
          x1: x1,
          y1: y2,
          x2: x1,
          y2: y2 + leaderLineLen
        });
        dimensionMarkerLabelStack.push({
          x: x1,
          y: y2 + leaderLineLen + labelHeight,
          label: numShown,
          anchor: 'middle'
        });
      }
      if (type === 'r') {
        dimensionMarkerLeaderStack.push({
          x1: x1 - leaderLineLen,
          y1: y1,
          x2: x1,
          y2: y2
        });
        return dimensionMarkerLabelStack.push({
          x: x1 - leaderLineLen,
          y: y2 + labelHeight / 3,
          label: numShown,
          anchor: 'end'
        });
      }
    };
    dimensionMarkerStack = [];
    dimensionMarkerLeaderStack = [];
    dimensionMarkerLabelStack = [];
    ticksX = getTickRange(this.maxX, this.minX);
    ticksY = getTickRange(this.maxY, this.minY);
    originAxis = [];
    oax = {
      x1: this.viewBoxDim.x,
      y1: this._normalizeYCoords(0),
      x2: this.viewBoxDim.x + this.viewBoxDim.width,
      y2: this._normalizeYCoords(0)
    };
    pushDimensionMarker('r', oax.x1, oax.y1, oax.x2, oax.y2, 0);
    if (!((this.minY === 0) || (this.maxY === 0))) {
      originAxis.push(oax);
    }
    oay = {
      x1: this._normalizeXCoords(0),
      y1: this.viewBoxDim.y,
      x2: this._normalizeXCoords(0),
      y2: this.viewBoxDim.y + this.viewBoxDim.height
    };
    pushDimensionMarker('c', oay.x1, oay.y1, oay.x2, oay.y2, 0);
    if (!((this.minX === 0) || (this.maxX === 0))) {
      originAxis.push(oay);
    }
    this.svg.selectAll('.origin').data(originAxis).enter().append('line').attr('class', 'origin').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', 1).attr('stroke', 'black').style('stroke-dasharray', '4, 6');
    colsPositive = 0;
    colsNegative = 0;
    i = ticksX;
    while (between(i, this.minX, this.maxX) || between(-i, this.minX, this.maxX)) {
      if (between(i, this.minX, this.maxX)) {
        colsPositive++;
      }
      if (between(-i, this.minX, this.maxX)) {
        colsNegative++;
      }
      i += ticksX;
    }
    rowsPositive = 0;
    rowsNegative = 0;
    i = ticksY;
    while (between(i, this.minY, this.maxY) || between(-i, this.minY, this.maxY)) {
      if (between(i, this.minY, this.maxY)) {
        rowsNegative++;
      }
      if (between(-i, this.minY, this.maxY)) {
        rowsPositive++;
      }
      i += ticksY;
    }
    i = 0;
    while (i < Math.max(colsPositive, colsNegative)) {
      if (i < colsPositive) {
        val = (i + 1) * ticksX;
        x1 = this._normalizeXCoords(val);
        y1 = this.viewBoxDim.y;
        x2 = this._normalizeXCoords(val);
        y2 = this.viewBoxDim.y + this.viewBoxDim.height;
        dimensionMarkerStack.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        });
        if (i % 2) {
          pushDimensionMarker('c', x1, y1, x2, y2, val);
        }
      }
      if (i < colsNegative) {
        val = -(i + 1) * ticksX;
        x1 = this._normalizeXCoords(val);
        y1 = this.viewBoxDim.y;
        x2 = this._normalizeXCoords(val);
        y2 = this.viewBoxDim.y + this.viewBoxDim.height;
        dimensionMarkerStack.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        });
        if (i % 2) {
          pushDimensionMarker('c', x1, y1, x2, y2, val);
        }
      }
      i++;
    }
    i = 0;
    while (i < Math.max(rowsPositive, rowsNegative)) {
      x1 = y1 = x2 = y2 = 0;
      if (i < rowsPositive) {
        val = -(i + 1) * ticksY;
        x1 = this.viewBoxDim.x;
        y1 = this._normalizeYCoords(val);
        x2 = this.viewBoxDim.x + this.viewBoxDim.width;
        y2 = this._normalizeYCoords(val);
        dimensionMarkerStack.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        });
        if (i % 2) {
          pushDimensionMarker('r', x1, y1, x2, y2, val);
        }
      }
      if (i < rowsNegative) {
        val = (i + 1) * ticksY;
        x1 = this.viewBoxDim.x;
        y1 = this._normalizeYCoords(val);
        x2 = this.viewBoxDim.x + this.viewBoxDim.width;
        y2 = this._normalizeYCoords(val);
        dimensionMarkerStack.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        });
        if (i % 2) {
          pushDimensionMarker('r', x1, y1, x2, y2, val);
        }
      }
      i++;
    }
    this.svg.selectAll('.dim-marker').data(dimensionMarkerStack).enter().append('line').attr('class', 'dim-marker').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', 0.2).attr('stroke', 'grey');
    this.svg.selectAll('.dim-marker-leader').data(dimensionMarkerLeaderStack).enter().append('line').attr('class', 'dim-marker-leader').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', 1).attr('stroke', 'black');
    return this.svg.selectAll('.dim-marker-label').data(dimensionMarkerLabelStack).enter().append('text').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').text(function(d) {
      return d.label;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    });
  };

  RectPlot.prototype.drawAxisLabels = function() {
    var axisLabels, xAxisPadding, yAxisPadding;
    yAxisPadding = 45;
    xAxisPadding = 40;
    axisLabels = [
      {
        x: this.viewBoxDim.x + this.viewBoxDim.width / 2,
        y: this.viewBoxDim.y + this.viewBoxDim.height + xAxisPadding,
        text: 'Dimension 1 (64%)',
        anchor: 'middle',
        transform: 'rotate(0)'
      }, {
        x: this.viewBoxDim.x - yAxisPadding,
        y: this.viewBoxDim.y + this.viewBoxDim.height / 2,
        text: 'Dimension 2 (24%)',
        anchor: 'middle',
        transform: 'rotate(270,' + (this.viewBoxDim.x - yAxisPadding) + ', ' + (this.viewBoxDim.y + this.viewBoxDim.height / 2) + ')'
      }
    ];
    return this.svg.selectAll('.axis-label').data(axisLabels).enter().append('text').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').attr('text-anchor', function(d) {
      return d.anchor;
    }).attr('transform', function(d) {
      return d.transform;
    }).text(function(d) {
      return d.text;
    }).style('font-weight', 'bold');
  };

  RectPlot.prototype.drawLegend = function() {
    var heightOfRow, i, legendLeftPadding, legendPtRad, legendStartY, li;
    legendPtRad = 6;
    legendLeftPadding = 30;
    heightOfRow = 25;
    legendStartY = Math.max(this.viewBoxDim.y + this.viewBoxDim.height / 2 - heightOfRow * this.data.legend.length / 2 + legendPtRad, this.viewBoxDim.y + legendPtRad);
    i = 0;
    while (i < this.data.legend.length) {
      li = this.data.legend[i];
      li['r'] = legendPtRad;
      li['cx'] = this.viewBoxDim.x + this.viewBoxDim.width + legendLeftPadding;
      li['cy'] = legendStartY + i * heightOfRow;
      li['x'] = li['cx'] + 15;
      li['y'] = li['cy'] + li['r'];
      li['anchor'] = 'start';
      i++;
    }
    this.svg.selectAll('.legend-pts').data(this.data.legend).enter().append('circle').attr('cx', function(d) {
      return d.cx;
    }).attr('cy', function(d) {
      return d.cy;
    }).attr('r', function(d) {
      return d.r;
    }).attr('fill', function(d) {
      return d.color;
    }).attr('stroke', function(d) {
      return d.stroke;
    }).attr('stroke-opacity', function(d) {
      return d['stroke-opacity'];
    });
    return this.svg.selectAll('.legend-text').data(this.data.legend).enter().append('text').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').text(function(d) {
      return d.text;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    });
  };

  RectPlot.prototype._normalizeXCoords = function(Xcoord) {
    return (Xcoord - this.minX) / (this.maxX - this.minX) * this.viewBoxDim.width + this.viewBoxDim.x;
  };

  RectPlot.prototype._normalizeYCoords = function(Ycoord) {
    return -(Ycoord - this.minY) / (this.maxY - this.minY) * this.viewBoxDim.height + this.viewBoxDim.y + this.viewBoxDim.height;
  };

  RectPlot.prototype.drawAnc = function() {
    return this.svg.selectAll('.anc').data(this.data.pts).enter().append('circle').attr('class', 'anc').attr('cx', function(d) {
      return d.x;
    }).attr('cy', function(d) {
      return d.y;
    }).attr('r', function(d) {
      return d.r;
    }).attr('fill', function(d) {
      return d.color;
    }).append('title').text(function(d) {
      return "" + d.label + "\n" + d.group + "\n[" + d.labelX + ", " + d.labelY + "]";
    });
  };

  RectPlot.prototype.drawLabs = function() {
    var i, labeler, labels_svg;
    labels_svg = this.svg.selectAll('.label').data(this.data.lab).enter().append('text').attr('class', 'init-labs').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').text(function(d) {
      return d.text;
    }).attr('text-anchor', 'middle').attr('fill', function(d) {
      return d.color;
    });
    i = 0;
    while (i < this.data.len) {
      this.data.lab[i].width = labels_svg[0][i].getBBox().width;
      this.data.lab[i].height = labels_svg[0][i].getBBox().height;
      i++;
    }
    labeler = d3.labeler().svg(this.svg).w1(this.viewBoxDim.x).w2(this.viewBoxDim.x + this.viewBoxDim.width).h1(this.viewBoxDim.y).h2(this.viewBoxDim.y + this.viewBoxDim.height).anchor(this.data.anc).label(this.data.lab).start(500);
    labels_svg.transition().duration(800).attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    });
    return this.drawLinks();
  };

  RectPlot.prototype.drawLinks = function() {
    var i, newLinkPt, newPtOnLabelBorder;
    newPtOnLabelBorder = function(label, anchor, anchor_array) {
      var a, above, aboveMid, abovePadded, ambiguityFactor, ancNearby, below, belowMid, belowPadded, centered, labelBorder, left, leftPadded, padB, padL, padR, padT, paddedCenter, padding, right, rightPadded, _i, _len;
      labelBorder = {
        botL: [label.x - label.width / 2, label.y],
        botC: [label.x, label.y],
        botR: [label.x + label.width / 2, label.y],
        topL: [label.x - label.width / 2, label.y - label.height + 8],
        topC: [label.x, label.y - label.height + 8],
        topR: [label.x + label.width / 2, label.y - label.height + 8],
        midL: [label.x - label.width / 2, label.y - label.height / 2],
        midR: [label.x + label.width / 2, label.y - label.height / 2]
      };
      padding = 10;
      centered = (anchor.x > label.x - label.width / 2) && (anchor.x < label.x + label.width / 2);
      paddedCenter = (anchor.x > label.x - label.width / 2 - padding) && (anchor.x < label.x + label.width / 2 + padding);
      abovePadded = anchor.y < label.y - label.height - padding;
      above = anchor.y < label.y - label.height;
      aboveMid = anchor.y < label.y - label.height / 2;
      belowPadded = anchor.y > label.y + padding;
      below = anchor.y > label.y;
      belowMid = anchor.y >= label.y - label.height / 2;
      left = anchor.x < label.x - label.width / 2;
      right = anchor.x > label.x + label.width / 2;
      leftPadded = anchor.x < label.x - label.width / 2 - padding;
      rightPadded = anchor.x > label.x + label.width / 2 + padding;
      if (centered && abovePadded) {
        return labelBorder.topC;
      } else if (centered && belowPadded) {
        return labelBorder.botC;
      } else if (above && left) {
        return labelBorder.topL;
      } else if (above && right) {
        return labelBorder.topR;
      } else if (below && left) {
        return labelBorder.botL;
      } else if (below && right) {
        return labelBorder.botR;
      } else if (leftPadded) {
        return labelBorder.midL;
      } else if (rightPadded) {
        return labelBorder.midR;
      } else {
        ambiguityFactor = 10;
        padL = labelBorder.topL[0] - ambiguityFactor;
        padR = labelBorder.topR[0] + ambiguityFactor;
        padT = labelBorder.topL[1] - ambiguityFactor;
        padB = labelBorder.botR[1] + ambiguityFactor;
        ancNearby = 0;
        for (_i = 0, _len = anchor_array.length; _i < _len; _i++) {
          a = anchor_array[_i];
          if ((a.x > padL && a.x < padR) && (a.y > padT && a.y < padB)) {
            ancNearby++;
          }
        }
        if (ancNearby > 1) {
          if (!left && !right && !above && !below) {
            return labelBorder.botC;
          } else if (centered && above) {
            return labelBorder.topC;
          } else if (centered && below) {
            return labelBorder.botC;
          } else if (left && above) {
            return labelBorder.topL;
          } else if (left && below) {
            return labelBorder.botL;
          } else if (right && above) {
            return labelBorder.topR;
          } else if (right && below) {
            return labelBorder.botR;
          } else if (left) {
            return labelBorder.midL;
          } else if (right) {
            return labelBorder.midR;
          }
        }
      }
    };
    this.links = [];
    i = 0;
    while (i < this.data.len) {
      newLinkPt = newPtOnLabelBorder(this.data.lab[i], this.data.anc[i], this.data.pts);
      if (newLinkPt != null) {
        this.links.push({
          x1: this.data.anc[i].x,
          y1: this.data.anc[i].y,
          x2: newLinkPt[0],
          y2: newLinkPt[1],
          width: 1
        });
      }
      i++;
    }
    return this.svg.selectAll('.link').data(this.links).enter().append('line').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', function(d) {
      return d.width;
    }).attr('stroke', 'gray');
  };

  return RectPlot;

})();
