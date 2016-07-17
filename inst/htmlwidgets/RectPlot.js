// Generated by CoffeeScript 1.8.0
var RectPlot;

RectPlot = (function() {
  function RectPlot(width, height, X, Y, group, label, svg) {
    this.svg = svg;
    this.yAxisPadding = 50;
    this.xAxisPadding = 40;
    this.legendDim = {
      width: 300,
      heightOfRow: 25,
      rightPadding: 10,
      ptRadius: 6,
      ptMovedRadius: 2,
      leftPadding: 30,
      ptToTextSpace: 15,
      yPtOffset: 4,
      maxTextWidth: -Infinity
    };
    this.viewBoxDim = {
      svgWidth: width,
      svgHeight: height,
      width: width - this.legendDim.width,
      height: height - this.xAxisPadding - 20,
      x: this.yAxisPadding + 25,
      y: 10
    };
    this.legendDim.x = this.viewBoxDim.x + this.viewBoxDim.width;
    this.data = new PlotData(X, Y, group, label, this.viewBoxDim, this.legendDim);
  }

  RectPlot.prototype.draw = function() {
    this.drawLegend(this, this.data);
    this.drawRect(this.svg, this.viewBoxDim);
    this.drawDimensionMarkers();
    this.drawAxisLabels(this.svg, this.viewBoxDim, this.xAxisPadding, this.yAxisPadding);
    this.drawAnc(this.data);
    return this.drawLabs(this);
  };

  RectPlot.prototype.redraw = function(data) {
    var elem, plotElems, _i, _len;
    plotElems = ['.plot-viewbox', '.origin', '.dim-marker', '.dim-marker-leader', '.dim-marker-label', '.axis-label', '.legend-pts', '.legend-text', '.anc', '.lab', '.link'];
    for (_i = 0, _len = plotElems.length; _i < _len; _i++) {
      elem = plotElems[_i];
      this.svg.selectAll(elem).remove();
    }
    data.calcDataArrays();
    return this.draw();
  };

  RectPlot.prototype.drawRect = function() {
    this.svg.selectAll('.plot-viewbox').remove();
    return this.svg.append('rect').attr('class', 'plot-viewbox').attr('x', this.viewBoxDim.x).attr('y', this.viewBoxDim.y).attr('width', this.viewBoxDim.width).attr('height', this.viewBoxDim.height).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px');
  };

  RectPlot.prototype.drawDimensionMarkers = function() {
    var between, colsNegative, colsPositive, data, dimensionMarkerLabelStack, dimensionMarkerLeaderStack, dimensionMarkerStack, getTickRange, i, normalizeXCoords, normalizeYCoords, oax, oay, originAxis, pushDimensionMarker, rowsNegative, rowsPositive, ticksX, ticksY, val, viewBoxDim, x1, x2, y1, y2;
    data = this.data;
    viewBoxDim = this.viewBoxDim;
    if (!(data.len > 0)) {
      return;
    }
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
    normalizeXCoords = function(Xcoord) {
      return (Xcoord - data.minX) / (data.maxX - data.minX) * viewBoxDim.width + viewBoxDim.x;
    };
    normalizeYCoords = function(Ycoord) {
      return -(Ycoord - data.minY) / (data.maxY - data.minY) * viewBoxDim.height + viewBoxDim.y + viewBoxDim.height;
    };
    dimensionMarkerStack = [];
    dimensionMarkerLeaderStack = [];
    dimensionMarkerLabelStack = [];
    ticksX = getTickRange(this.data.maxX, this.data.minX);
    ticksY = getTickRange(this.data.maxY, this.data.minY);
    originAxis = [];
    oax = {
      x1: this.viewBoxDim.x,
      y1: normalizeYCoords(0),
      x2: this.viewBoxDim.x + this.viewBoxDim.width,
      y2: normalizeYCoords(0)
    };
    pushDimensionMarker('r', oax.x1, oax.y1, oax.x2, oax.y2, 0);
    if (!((this.data.minY === 0) || (this.data.maxY === 0))) {
      originAxis.push(oax);
    }
    oay = {
      x1: normalizeXCoords(0),
      y1: this.viewBoxDim.y,
      x2: normalizeXCoords(0),
      y2: this.viewBoxDim.y + this.viewBoxDim.height
    };
    pushDimensionMarker('c', oay.x1, oay.y1, oay.x2, oay.y2, 0);
    if (!((this.data.minX === 0) || (this.data.maxX === 0))) {
      originAxis.push(oay);
    }
    this.svg.selectAll('.origin').remove();
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
    while (between(i, this.data.minX, this.data.maxX) || between(-i, this.data.minX, this.data.maxX)) {
      if (between(i, this.data.minX, this.data.maxX)) {
        colsPositive++;
      }
      if (between(-i, this.data.minX, this.data.maxX)) {
        colsNegative++;
      }
      i += ticksX;
    }
    rowsPositive = 0;
    rowsNegative = 0;
    i = ticksY;
    while (between(i, this.data.minY, this.data.maxY) || between(-i, this.data.minY, this.data.maxY)) {
      if (between(i, this.data.minY, this.data.maxY)) {
        rowsNegative++;
      }
      if (between(-i, this.data.minY, this.data.maxY)) {
        rowsPositive++;
      }
      i += ticksY;
    }
    i = 0;
    while (i < Math.max(colsPositive, colsNegative)) {
      if (i < colsPositive) {
        val = (i + 1) * ticksX;
        x1 = normalizeXCoords(val);
        y1 = this.viewBoxDim.y;
        x2 = normalizeXCoords(val);
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
        x1 = normalizeXCoords(val);
        y1 = this.viewBoxDim.y;
        x2 = normalizeXCoords(val);
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
        y1 = normalizeYCoords(val);
        x2 = this.viewBoxDim.x + this.viewBoxDim.width;
        y2 = normalizeYCoords(val);
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
        y1 = normalizeYCoords(val);
        x2 = this.viewBoxDim.x + this.viewBoxDim.width;
        y2 = normalizeYCoords(val);
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
    this.svg.selectAll('.dim-marker').remove();
    this.svg.selectAll('.dim-marker').data(dimensionMarkerStack).enter().append('line').attr('class', 'dim-marker').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', 0.2).attr('stroke', 'grey');
    this.svg.selectAll('.dim-marker-leader').remove();
    this.svg.selectAll('.dim-marker-leader').data(dimensionMarkerLeaderStack).enter().append('line').attr('class', 'dim-marker-leader').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', 1).attr('stroke', 'black');
    this.svg.selectAll('.dim-marker-label').remove();
    return this.svg.selectAll('.dim-marker-label').data(dimensionMarkerLabelStack).enter().append('text').attr('class', 'dim-marker-label').attr('x', function(d) {
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
    var axisLabels;
    axisLabels = [
      {
        x: this.viewBoxDim.x + this.viewBoxDim.width / 2,
        y: this.viewBoxDim.y + this.viewBoxDim.height + this.xAxisPadding,
        text: 'Dimension 1 (64%)',
        anchor: 'middle',
        transform: 'rotate(0)'
      }, {
        x: this.viewBoxDim.x - this.yAxisPadding,
        y: this.viewBoxDim.y + this.viewBoxDim.height / 2,
        text: 'Dimension 2 (24%)',
        anchor: 'middle',
        transform: 'rotate(270,' + (this.viewBoxDim.x - this.yAxisPadding) + ', ' + (this.viewBoxDim.y + this.viewBoxDim.height / 2) + ')'
      }
    ];
    this.svg.selectAll('.axis-label').remove();
    return this.svg.selectAll('.axis-label').data(axisLabels).enter().append('text').attr('class', 'axis-label').attr('x', function(d) {
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

  RectPlot.prototype.drawLegend = function(plot, data) {
    var i, legendGroupsLab, legendPtsLab;
    data.calcLegendDisplayPtsAndGroups(data.legendGroups, data.legendDim, data.legendPts);
    this.svg.selectAll('.legend-groups-pts').remove();
    this.svg.selectAll('.legend-groups-pts').data(data.legendGroups).enter().append('circle').attr('class', 'legend-groups-pts').attr('cx', function(d) {
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
    this.svg.selectAll('.legend-groups-text').remove();
    this.svg.selectAll('.legend-groups-text').data(data.legendGroups).enter().append('text').attr('class', 'legend-groups-text').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').text(function(d) {
      return d.text;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    });
    this.svg.selectAll('.legend-pts-pts').remove();
    this.svg.selectAll('.legend-pts-pts').data(data.legendPts).enter().append('circle').attr('class', 'legend-pts-pts').attr('cx', function(d) {
      return d.cx;
    }).attr('cy', function(d) {
      return d.cy - d.yOffset;
    }).attr('r', function(d) {
      return d.r;
    }).attr('fill', function(d) {
      return d.color;
    });
    this.svg.selectAll('.legend-pts-text').remove();
    this.svg.selectAll('.legend-pts-text').data(data.legendPts).enter().append('text').attr('class', 'legend-pts-text').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').text(function(d) {
      return d.text;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    }).attr('fill', function(d) {
      return d.color;
    });
    legendGroupsLab = this.svg.selectAll('.legend-groups-text');
    legendPtsLab = this.svg.selectAll('.legend-pts-text');
    i = 0;
    while (i < data.legendGroups.length) {
      data.legendGroups[i].width = legendGroupsLab[0][i].getBBox().width;
      data.legendGroups[i].height = legendGroupsLab[0][i].getBBox().height;
      i++;
    }
    i = 0;
    while (i < data.legendPts.length) {
      data.legendPts[i].width = legendPtsLab[0][i].getBBox().width;
      data.legendPts[i].height = legendPtsLab[0][i].getBBox().height;
      i++;
    }
    if (data.resizedAfterLegendGroupsDrawn()) {
      console.log('Legend resize triggered');
      plot.redraw(data);
      return plot.drawLegend(plot, data);
    }
  };

  RectPlot.prototype.drawAnc = function(data) {
    this.svg.selectAll('.anc').remove();
    return this.svg.selectAll('.anc').data(data.pts).enter().append('circle').attr('class', 'anc').attr('cx', function(d) {
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

  RectPlot.prototype.elemDraggedOffPlot = function(plot, data, id) {
    data.moveElemToLegend(id, data.legendPts);
    plot.drawRect();
    plot.drawAxisLabels();
    plot.drawDimensionMarkers();
    plot.drawAnc(data);
    plot.drawLabs(plot);
    return plot.drawLegend(plot, data);
  };

  RectPlot.prototype.drawLabs = function(plot) {
    var drag, i, labelDragAndDrop, labeler, labels_svg;
    labelDragAndDrop = function() {
      var dragEnd, dragMove, dragStart;
      dragStart = function() {
        return plot.svg.selectAll('.link').remove();
      };
      dragMove = function() {
        var id, label;
        d3.select(this).attr('x', d3.select(this).x = d3.event.x).attr('y', d3.select(this).y = d3.event.y);
        id = d3.select(this).attr('id');
        label = _.find(plot.data.lab, function(l) {
          return l.id === Number(id);
        });
        label.x = d3.event.x;
        return label.y = d3.event.y;
      };
      dragEnd = function() {
        var id, lab;
        id = Number(d3.select(this).attr('id'));
        lab = _.find(plot.data.lab, function(l) {
          return l.id === id;
        });
        if (plot.data.isOutsideViewBox(lab)) {
          return plot.elemDraggedOffPlot(plot, plot.data, id);
        } else {
          return plot.drawLinks(plot.svg, plot.data);
        }
      };
      return d3.behavior.drag().origin(function() {
        return {
          x: d3.select(this).attr("x"),
          y: d3.select(this).attr("y")
        };
      }).on('dragstart', dragStart).on('drag', dragMove).on('dragend', dragEnd);
    };
    drag = labelDragAndDrop();
    plot.svg.selectAll('.lab').remove();
    plot.svg.selectAll('.lab').data(plot.data.lab).enter().append('text').attr('class', 'lab').attr('id', function(d) {
      return d.id;
    }).attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', 'Arial').text(function(d) {
      return d.text;
    }).attr('text-anchor', 'middle').attr('fill', function(d) {
      return d.color;
    }).call(drag);
    labels_svg = plot.svg.selectAll('.lab');
    i = 0;
    while (i < plot.data.len) {
      plot.data.lab[i].width = labels_svg[0][i].getBBox().width;
      plot.data.lab[i].height = labels_svg[0][i].getBBox().height;
      i++;
    }
    labeler = d3.labeler().svg(plot.svg).w1(plot.viewBoxDim.x).w2(plot.viewBoxDim.x + plot.viewBoxDim.width).h1(plot.viewBoxDim.y).h2(plot.viewBoxDim.y + plot.viewBoxDim.height).anchor(plot.data.anc).label(plot.data.lab).start(500);
    labels_svg.transition().duration(800).attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    });
    return plot.drawLinks(plot.svg, plot.data);
  };

  RectPlot.prototype.drawLinks = function(svg, data) {
    var i, links, newLinkPt, newPtOnLabelBorder;
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
    links = [];
    i = 0;
    while (i < data.len) {
      newLinkPt = newPtOnLabelBorder(data.lab[i], data.anc[i], data.pts);
      if (newLinkPt != null) {
        links.push({
          x1: data.anc[i].x,
          y1: data.anc[i].y,
          x2: newLinkPt[0],
          y2: newLinkPt[1],
          width: 1
        });
      }
      i++;
    }
    return svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').attr('x1', function(d) {
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
