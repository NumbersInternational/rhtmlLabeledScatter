// Generated by CoffeeScript 1.8.0
var RectPlot,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

RectPlot = (function() {
  function RectPlot(stateObj, stateChangedCallback, width, height, X, Y, Z, group, label, svg, fixedRatio, xTitle, yTitle, zTitle, title, colors, transparency, grid, origin, originAlign, titleFontFamily, titleFontSize, titleFontColor, xTitleFontFamily, xTitleFontSize, xTitleFontColor, yTitleFontFamily, yTitleFontSize, yTitleFontColor, showLabels, labelsFontFamily, labelsFontSize, labelsFontColor, xDecimals, yDecimals, zDecimals, xPrefix, yPrefix, zPrefix, xSuffix, ySuffix, zSuffix, legendShow, legendBubblesShow, legendFontFamily, legendFontSize, legendFontColor, axisFontFamily, axisFontColor, axisFontSize, pointRadius, xBoundsMinimum, xBoundsMaximum, yBoundsMinimum, yBoundsMaximum, xBoundsUnitsMajor, yBoundsUnitsMajor) {
    var x, _i, _len, _ref;
    this.width = width;
    this.height = height;
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.group = group;
    this.label = label;
    this.svg = svg;
    this.zTitle = zTitle != null ? zTitle : '';
    this.colors = colors;
    this.transparency = transparency;
    this.originAlign = originAlign;
    this.showLabels = showLabels != null ? showLabels : true;
    this.xDecimals = xDecimals != null ? xDecimals : null;
    this.yDecimals = yDecimals != null ? yDecimals : null;
    this.zDecimals = zDecimals != null ? zDecimals : null;
    this.xPrefix = xPrefix != null ? xPrefix : '';
    this.yPrefix = yPrefix != null ? yPrefix : '';
    this.zPrefix = zPrefix != null ? zPrefix : '';
    this.xSuffix = xSuffix != null ? xSuffix : '';
    this.ySuffix = ySuffix != null ? ySuffix : '';
    this.zSuffix = zSuffix != null ? zSuffix : '';
    this.legendShow = legendShow;
    this.legendBubblesShow = legendBubblesShow != null ? legendBubblesShow : true;
    this.legendFontFamily = legendFontFamily;
    this.legendFontSize = legendFontSize;
    this.legendFontColor = legendFontColor;
    this.axisFontFamily = axisFontFamily;
    this.axisFontColor = axisFontColor;
    this.axisFontSize = axisFontSize;
    this.pointRadius = pointRadius != null ? pointRadius : 2;
    if (xBoundsMinimum == null) {
      xBoundsMinimum = null;
    }
    if (xBoundsMaximum == null) {
      xBoundsMaximum = null;
    }
    if (yBoundsMinimum == null) {
      yBoundsMinimum = null;
    }
    if (yBoundsMaximum == null) {
      yBoundsMaximum = null;
    }
    this.xBoundsUnitsMajor = xBoundsUnitsMajor != null ? xBoundsUnitsMajor : null;
    this.yBoundsUnitsMajor = yBoundsUnitsMajor != null ? yBoundsUnitsMajor : null;
    this.drawLinks = __bind(this.drawLinks, this);
    this.drawLabs = __bind(this.drawLabs, this);
    this.resetPlotAfterDragEvent = __bind(this.resetPlotAfterDragEvent, this);
    this.elemDraggedOnPlot = __bind(this.elemDraggedOnPlot, this);
    this.elemDraggedOffPlot = __bind(this.elemDraggedOffPlot, this);
    this.drawDraggedMarkers = __bind(this.drawDraggedMarkers, this);
    this.drawAnc = __bind(this.drawAnc, this);
    this.drawLegend = __bind(this.drawLegend, this);
    this.drawAxisLabels = __bind(this.drawAxisLabels, this);
    this.drawDimensionMarkers = __bind(this.drawDimensionMarkers, this);
    this.drawRect = __bind(this.drawRect, this);
    this.drawTitle = __bind(this.drawTitle, this);
    this.draw = __bind(this.draw, this);
    this.drawLabsAndPlot = __bind(this.drawLabsAndPlot, this);
    this.setDim = __bind(this.setDim, this);
    this.state = new State(stateObj, stateChangedCallback);
    this.labelsFont = {
      size: labelsFontSize,
      color: labelsFontColor,
      family: labelsFontFamily
    };
    this.xTitle = {
      text: xTitle,
      textHeight: xTitleFontSize,
      fontFamily: xTitleFontFamily,
      fontSize: xTitleFontSize,
      fontColor: xTitleFontColor,
      topPadding: 5
    };
    if (this.xTitle.text === '') {
      this.xTitle.textHeight = 0;
    }
    this.yTitle = {
      text: yTitle,
      textHeight: yTitleFontSize,
      fontFamily: yTitleFontFamily,
      fontSize: yTitleFontSize,
      fontColor: yTitleFontColor
    };
    if (this.yTitle.text === '') {
      this.yTitle.textHeight = 0;
    }
    this.axisLeaderLineLength = 5;
    this.axisDimensionTextHeight = 0;
    this.axisDimensionTextWidth = 0;
    this.axisDimensionTextRightPadding = 0;
    this.verticalPadding = 5;
    this.horizontalPadding = 10;
    this.bounds = {
      xmin: xBoundsMinimum,
      xmax: xBoundsMaximum,
      ymin: yBoundsMinimum,
      ymax: yBoundsMaximum
    };
    this.title = {
      text: title,
      color: titleFontColor,
      anchor: 'middle',
      fontSize: titleFontSize,
      fontWeight: 'bold',
      fontFamily: titleFontFamily
    };
    if (this.title.text === '') {
      this.title.textHeight = 0;
      this.title.paddingBot = 0;
    } else {
      this.title.textHeight = titleFontSize;
      this.title.paddingBot = 20;
    }
    this.title.y = this.verticalPadding + this.title.textHeight;
    this.grid = grid != null ? grid : true;
    this.origin = origin != null ? origin : true;
    this.fixedRatio = fixedRatio != null ? fixedRatio : true;
    if (this.label == null) {
      this.label = [];
      _ref = this.X;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        this.label.push('');
      }
      this.showLabels = false;
    }
    this.setDim(this.svg, this.width, this.height);
  }

  RectPlot.prototype.setDim = function(svg, width, height) {
    this.svg = svg;
    this.title.x = width / 2;
    this.legendDim = {
      width: 0,
      heightOfRow: this.legendFontSize + 9,
      rightPadding: this.legendFontSize / 1.6,
      leftPadding: this.legendFontSize / 0.8,
      centerPadding: this.legendFontSize / 0.53,
      ptRadius: this.legendFontSize / 2.67,
      ptToTextSpace: this.legendFontSize,
      vertPtPadding: 5,
      cols: 1,
      markerLen: 5,
      markerWidth: 1,
      markerTextSize: 10,
      markerCharWidth: 4
    };
    this.viewBoxDim = {
      svgWidth: width,
      svgHeight: height,
      width: width - this.legendDim.width - this.horizontalPadding * 3 - this.axisLeaderLineLength - this.axisDimensionTextWidth - this.yTitle.textHeight - this.axisDimensionTextRightPadding,
      height: height - this.verticalPadding * 2 - this.title.textHeight - this.title.paddingBot - this.axisDimensionTextHeight - this.xTitle.textHeight - this.axisLeaderLineLength - this.xTitle.topPadding,
      x: this.horizontalPadding * 2 + this.axisDimensionTextWidth + this.axisLeaderLineLength + this.yTitle.textHeight,
      y: this.verticalPadding + this.title.textHeight + this.title.paddingBot,
      labelFontSize: this.labelsFont.size,
      labelSmallFontSize: this.labelsFont.size * 0.75,
      labelFontColor: this.labelsFont.color,
      labelFontFamily: this.labelsFont.family
    };
    this.legendDim.x = this.viewBoxDim.x + this.viewBoxDim.width;
    this.title.x = this.viewBoxDim.x + this.viewBoxDim.width / 2;
    return this.data = new PlotData(this.X, this.Y, this.Z, this.group, this.label, this.viewBoxDim, this.legendDim, this.colors, this.fixedRatio, this.originAlign, this.pointRadius, this.bounds, this.transparency);
  };

  RectPlot.prototype.drawLabsAndPlot = function() {
    var pt, _i, _j, _len, _len1, _ref, _ref1;
    this.data.normalizeData();
    this.data.calcDataArrays();
    this.title.x = this.viewBoxDim.x + this.viewBoxDim.width / 2;
    if (!this.state.isLegendPtsSynced(this.data.outsidePlotPtsId)) {
      _ref = this.state.getLegendPts();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pt = _ref[_i];
        if (!_.includes(this.data.outsidePlotPtsId, pt)) {
          this.data.moveElemToLegend(pt);
        }
      }
      _ref1 = this.data.outsidePlotPtsId;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        pt = _ref1[_j];
        if (!_.includes(this.state.getLegendPts(), pt)) {
          this.state.pushLegendPt(pt);
        }
      }
      console.log("rhtmlLabeledScatter: drawLabsAndPlot false");
      return false;
    }
    this.drawTitle();
    this.drawAnc();
    this.drawLabs();
    this.drawDraggedMarkers();
    this.drawRect();
    this.drawAxisLabels();
    return true;
  };

  RectPlot.prototype.draw = function() {
    if (!(this.drawDimensionMarkers() && this.drawLegend() && this.drawLabsAndPlot())) {
      console.log('rhtmlLabeledScatter: redraw');
      this.draw();
    }
  };

  RectPlot.prototype.drawTitle = function() {
    if (this.title.text !== '') {
      this.svg.selectAll('.plot-title').remove();
      return this.svg.append('text').attr('class', 'plot-title').attr('font-family', this.title.fontFamily).attr('x', this.title.x).attr('y', this.title.y).attr('text-anchor', this.title.anchor).attr('fill', this.title.color).attr('font-size', this.title.fontSize).attr('font-weight', this.title.fontWeight).text(this.title.text);
    }
  };

  RectPlot.prototype.drawRect = function() {
    this.svg.selectAll('.plot-viewbox').remove();
    return this.svg.append('rect').attr('class', 'plot-viewbox').attr('x', this.viewBoxDim.x).attr('y', this.viewBoxDim.y).attr('width', this.viewBoxDim.width).attr('height', this.viewBoxDim.height).attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '1px');
  };

  RectPlot.prototype.drawDimensionMarkers = function() {
    var axisArrays, bb, i, initAxisTextHeight, initAxisTextWidth, markerLabel, markerLabels, _i, _len, _ref;
    axisArrays = AxisUtils.get().getAxisDataArrays(this, this.data, this.viewBoxDim);
    if (this.grid) {
      this.svg.selectAll('.origin').remove();
      this.svg.selectAll('.origin').data(axisArrays.gridOrigin).enter().append('line').attr('class', 'origin').attr('x1', function(d) {
        return d.x1;
      }).attr('y1', function(d) {
        return d.y1;
      }).attr('x2', function(d) {
        return d.x2;
      }).attr('y2', function(d) {
        return d.y2;
      }).attr('stroke-width', 0.2).attr('stroke', 'grey');
      if (this.origin) {
        this.svg.selectAll('.origin').style('stroke-dasharray', '4, 6').attr('stroke-width', 1).attr('stroke', 'black');
      }
      this.svg.selectAll('.dim-marker').remove();
      this.svg.selectAll('.dim-marker').data(axisArrays.gridLines).enter().append('line').attr('class', 'dim-marker').attr('x1', function(d) {
        return d.x1;
      }).attr('y1', function(d) {
        return d.y1;
      }).attr('x2', function(d) {
        return d.x2;
      }).attr('y2', function(d) {
        return d.y2;
      }).attr('stroke-width', 0.2).attr('stroke', 'grey');
    } else if (!this.grid && this.origin) {
      this.svg.selectAll('.origin').remove();
      this.svg.selectAll('.origin').data(axisArrays.gridOrigin).enter().append('line').attr('class', 'origin').attr('x1', function(d) {
        return d.x1;
      }).attr('y1', function(d) {
        return d.y1;
      }).attr('x2', function(d) {
        return d.x2;
      }).attr('y2', function(d) {
        return d.y2;
      }).style('stroke-dasharray', '4, 6').attr('stroke-width', 1).attr('stroke', 'black');
    }
    this.svg.selectAll('.dim-marker-leader').remove();
    this.svg.selectAll('.dim-marker-leader').data(axisArrays.axisLeader).enter().append('line').attr('class', 'dim-marker-leader').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', 1).attr('stroke', 'black');
    this.svg.selectAll('.dim-marker-label').remove();
    markerLabels = this.svg.selectAll('.dim-marker-label').data(axisArrays.axisLeaderLabel).enter().append('text').attr('class', 'dim-marker-label').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', this.axisFontFamily).attr('fill', this.axisFontColor).attr('font-size', this.axisFontSize).text(function(d) {
      return d.label;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    });
    this.maxTextWidthOfDimensionMarkerLabels = 0;
    initAxisTextWidth = this.axisDimensionTextWidth;
    initAxisTextHeight = this.axisDimensionTextHeight;
    _ref = markerLabels[0];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      markerLabel = _ref[i];
      bb = markerLabel.getBBox();
      if (this.axisDimensionTextWidth < bb.width) {
        this.axisDimensionTextWidth = bb.width;
      }
      if (this.axisDimensionTextHeight < bb.height) {
        this.axisDimensionTextHeight = bb.height;
      }
      if (this.width < bb.x + bb.width) {
        this.axisDimensionTextRightPadding = bb.width / 2;
      }
    }
    if (initAxisTextWidth !== this.axisDimensionTextWidth || initAxisTextHeight !== this.axisDimensionTextHeight) {
      this.setDim(this.svg, this.width, this.height);
      console.log("rhtmlLabeledScatter: drawDimensionMarkers fail");
      return false;
    }
    return true;
  };

  RectPlot.prototype.drawAxisLabels = function() {
    var axisLabels;
    axisLabels = [
      {
        x: this.viewBoxDim.x + this.viewBoxDim.width / 2,
        y: this.viewBoxDim.y + this.viewBoxDim.height + this.axisLeaderLineLength + this.axisDimensionTextHeight + this.xTitle.topPadding + this.xTitle.textHeight,
        text: this.xTitle.text,
        anchor: 'middle',
        transform: 'rotate(0)',
        display: this.xTitle === '' ? 'none' : '',
        fontFamily: this.xTitle.fontFamily,
        fontSize: this.xTitle.fontSize,
        fontColor: this.xTitle.fontColor
      }, {
        x: this.horizontalPadding + this.yTitle.textHeight,
        y: this.viewBoxDim.y + this.viewBoxDim.height / 2,
        text: this.yTitle.text,
        anchor: 'middle',
        transform: 'rotate(270,' + (this.horizontalPadding + this.yTitle.textHeight) + ', ' + (this.viewBoxDim.y + this.viewBoxDim.height / 2) + ')',
        display: this.yTitle === '' ? 'none' : '',
        fontFamily: this.yTitle.fontFamily,
        fontSize: this.yTitle.fontSize,
        fontColor: this.yTitle.fontColor
      }
    ];
    this.svg.selectAll('.axis-label').remove();
    return this.svg.selectAll('.axis-label').data(axisLabels).enter().append('text').attr('class', 'axis-label').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', function(d) {
      return d.fontFamily;
    }).attr('font-size', function(d) {
      return d.fontSize;
    }).attr('fill', function(d) {
      return d.fontColor;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    }).attr('transform', function(d) {
      return d.transform;
    }).text(function(d) {
      return d.text;
    }).style('font-weight', 'bold').style('display', function(d) {
      return d.display;
    });
  };

  RectPlot.prototype.drawLegend = function() {
    var drag, legendBubbleTitleSvg, legendFontSize, legendLabelDragAndDrop;
    this.data.setupLegendGroupsAndPts();
    legendLabelDragAndDrop = (function(_this) {
      return function() {
        var data, dragEnd, dragMove, dragStart, plot;
        plot = _this;
        data = _this.data;
        dragStart = function() {};
        dragMove = function() {
          var id, legendPt;
          d3.select(this).attr('x', d3.select(this).x = d3.event.x).attr('y', d3.select(this).y = d3.event.y);
          id = d3.select(this).attr('id').split('legend-')[1];
          legendPt = _.find(data.legendPts, function(l) {
            return l.id === Number(id);
          });
          legendPt.lab.x = d3.event.x;
          return legendPt.lab.y = d3.event.y;
        };
        dragEnd = function() {
          var id, legendPt;
          id = Number(d3.select(this).attr('id').split('legend-')[1]);
          legendPt = _.find(data.legendPts, function(l) {
            return l.id === Number(id);
          });
          if (plot.data.isLegendPtOutsideViewBox(legendPt.lab)) {
            return d3.select(this).attr('x', d3.select(this).x = legendPt.x).attr('y', d3.select(this).y = legendPt.y);
          } else {
            return plot.elemDraggedOnPlot(id);
          }
        };
        return d3.behavior.drag().origin(function() {
          return {
            x: d3.select(this).attr("x"),
            y: d3.select(this).attr("y")
          };
        }).on('dragstart', dragStart).on('drag', dragMove).on('dragend', dragEnd);
      };
    })(this);
    if (this.legendBubblesShow && Utils.get().isArr(this.Z)) {
      this.svg.selectAll('.legend-bubbles').remove();
      this.svg.selectAll('.legend-bubbles').data(this.data.legendBubbles).enter().append('circle').attr('class', 'legend-bubbles').attr('cx', function(d) {
        return d.cx;
      }).attr('cy', function(d) {
        return d.cy;
      }).attr('r', function(d) {
        return d.r;
      }).attr('fill', 'none').attr('stroke', 'black').attr('stroke-opacity', 0.5);
      this.svg.selectAll('.legend-bubbles-labels').remove();
      this.svg.selectAll('.legend-bubbles-labels').data(this.data.legendBubbles).enter().append('text').attr('class', 'legend-bubbles-labels').attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      }).attr('text-anchor', 'middle').attr('font-size', this.legendFontSize).attr('font-family', this.legendFontFamily).attr('fill', this.legendFontColor).text(function(d) {
        return d.text;
      });
      if (this.zTitle !== '') {
        legendFontSize = this.legendFontSize;
        this.svg.selectAll('.legend-bubbles-title').remove();
        legendBubbleTitleSvg = this.svg.selectAll('.legend-bubbles-title').data(this.data.legendBubblesTitle).enter().append('text').attr('class', 'legend-bubbles-title').attr('x', function(d) {
          return d.x;
        }).attr('y', function(d) {
          return d.y - (legendFontSize * 1.5);
        }).attr('text-anchor', 'middle').attr('font-family', this.legendFontFamily).attr('font-weight', 'bold').attr('fill', this.legendFontColor).text(this.zTitle);
        SvgUtils.get().setSvgBBoxWidthAndHeight(this.data.legendBubblesTitle, legendBubbleTitleSvg);
      }
    }
    if (this.legendShow) {
      this.svg.selectAll('.legend-groups-pts').remove();
      this.svg.selectAll('.legend-groups-pts').data(this.data.legendGroups).enter().append('circle').attr('class', 'legend-groups-pts').attr('cx', function(d) {
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
      }).attr('fill-opacity', function(d) {
        return d.fillOpacity;
      });
      this.svg.selectAll('.legend-groups-text').remove();
      this.svg.selectAll('.legend-groups-text').data(this.data.legendGroups).enter().append('text').attr('class', 'legend-groups-text').attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      }).attr('font-family', this.legendFontFamily).attr('fill', this.legendFontColor).attr('font-size', this.legendFontSize).text(function(d) {
        return d.text;
      }).attr('text-anchor', function(d) {
        return d.anchor;
      });
      drag = legendLabelDragAndDrop();
      this.svg.selectAll('.legend-dragged-pts-text').remove();
      this.svg.selectAll('.legend-dragged-pts-text').data(this.data.legendPts).enter().append('text').attr('class', 'legend-dragged-pts-text').attr('id', function(d) {
        return "legend-" + d.id;
      }).attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      }).attr('font-family', this.legendFontFamily).attr('font-size', this.legendFontSize).attr('text-anchor', function(d) {
        return d.anchor;
      }).attr('fill', function(d) {
        return d.color;
      }).text(function(d) {
        if (d.markerId != null) {
          return Utils.get().getSuperscript(d.markerId + 1) + d.text;
        } else {
          return d.text;
        }
      }).call(drag);
      SvgUtils.get().setSvgBBoxWidthAndHeight(this.data.legendGroups, this.svg.selectAll('.legend-groups-text'));
      SvgUtils.get().setSvgBBoxWidthAndHeight(this.data.legendPts, this.svg.selectAll('.legend-dragged-pts-text'));
    }
    if (this.legendShow || (this.legendBubblesShow && Utils.get().isArr(this.Z))) {
      if (this.data.resizedAfterLegendGroupsDrawn(this.legendShow)) {
        console.log("rhtmlLabeledScatter: drawLegend false");
        return false;
      }
    }
    return true;
  };

  RectPlot.prototype.drawAnc = function() {
    var anc;
    this.svg.selectAll('.anc').remove();
    anc = this.svg.selectAll('.anc').data(this.data.pts).enter().append('circle').attr('class', 'anc').attr('cx', function(d) {
      return d.x;
    }).attr('cy', function(d) {
      return d.y;
    }).attr('r', function(d) {
      return d.r;
    }).attr('fill', function(d) {
      return d.color;
    }).attr('fill-opacity', function(d) {
      return d.fillOpacity;
    });
    if (Utils.get().isArr(this.Z)) {
      return anc.append('title').text((function(_this) {
        return function(d) {
          var xlabel, ylabel, zlabel;
          xlabel = Utils.get().getFormattedNum(d.labelX, _this.xDecimals, _this.xPrefix, _this.xSuffix);
          ylabel = Utils.get().getFormattedNum(d.labelY, _this.yDecimals, _this.yPrefix, _this.ySuffix);
          zlabel = Utils.get().getFormattedNum(d.labelZ, _this.zDecimals, _this.zPrefix, _this.zSuffix);
          return "" + d.label + "\n" + zlabel + "\n" + d.group + "\n[" + xlabel + ", " + ylabel + "]";
        };
      })(this));
    } else {
      return anc.append('title').text((function(_this) {
        return function(d) {
          var xlabel, ylabel;
          xlabel = Utils.get().getFormattedNum(d.labelX, _this.xDecimals, _this.xPrefix, _this.xSuffix);
          ylabel = Utils.get().getFormattedNum(d.labelY, _this.yDecimals, _this.yPrefix, _this.ySuffix);
          return "" + d.label + "\n" + d.group + "\n[" + xlabel + ", " + ylabel + "]";
        };
      })(this));
    }
  };

  RectPlot.prototype.drawDraggedMarkers = function() {
    this.svg.selectAll('.marker').remove();
    this.svg.selectAll('.marker').data(this.data.outsidePlotMarkers).enter().append('line').attr('class', 'marker').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', function(d) {
      return d.width;
    }).attr('stroke', function(d) {
      return d.color;
    });
    this.svg.selectAll('.marker-label').remove();
    return this.svg.selectAll('.marker-label').data(this.data.outsidePlotMarkers).enter().append('text').attr('class', 'marker-label').attr('x', function(d) {
      return d.markerTextX;
    }).attr('y', function(d) {
      return d.markerTextY;
    }).attr('font-family', 'Arial').attr('text-anchor', 'start').attr('font-size', this.data.legendDim.markerTextSize).attr('fill', function(d) {
      return d.color;
    }).text(function(d) {
      return d.markerLabel;
    });
  };

  RectPlot.prototype.elemDraggedOffPlot = function(id) {
    this.data.moveElemToLegend(id);
    this.state.pushLegendPt(id);
    return this.resetPlotAfterDragEvent();
  };

  RectPlot.prototype.elemDraggedOnPlot = function(id) {
    this.data.removeElemFromLegend(id);
    this.state.pullLegendPt(id);
    return this.resetPlotAfterDragEvent();
  };

  RectPlot.prototype.resetPlotAfterDragEvent = function() {
    var elem, plotElems, _i, _len;
    plotElems = ['.plot-viewbox', '.origin', '.dim-marker', '.dim-marker-leader', '.dim-marker-label', '.axis-label', '.legend-pts', '.legend-text', '.anc', '.lab', '.link'];
    for (_i = 0, _len = plotElems.length; _i < _len; _i++) {
      elem = plotElems[_i];
      this.svg.selectAll(elem).remove();
    }
    return this.draw();
  };

  RectPlot.prototype.drawLabs = function() {
    var drag, labelDragAndDrop, labeler, labels_svg;
    labelDragAndDrop = (function(_this) {
      return function() {
        var dragEnd, dragMove, dragStart, plot;
        plot = _this;
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
            return plot.elemDraggedOffPlot(id);
          } else {
            plot.state.pushUserPositionedLabel(id, lab.x, lab.y, plot.viewBoxDim);
            return plot.drawLinks();
          }
        };
        return d3.behavior.drag().origin(function() {
          return {
            x: d3.select(this).attr("x"),
            y: d3.select(this).attr("y")
          };
        }).on('dragstart', dragStart).on('drag', dragMove).on('dragend', dragEnd);
      };
    })(this);
    if (this.showLabels) {
      drag = labelDragAndDrop();
      this.state.updateLabelsWithUserPositionedData(this.data.lab, this.data.viewBoxDim);
      this.svg.selectAll('.lab').remove();
      this.svg.selectAll('.lab').data(this.data.lab).enter().append('text').attr('class', 'lab').attr('id', function(d) {
        return d.id;
      }).attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      }).attr('font-family', function(d) {
        return d.fontFamily;
      }).text(function(d) {
        return d.text;
      }).attr('text-anchor', 'middle').attr('fill', function(d) {
        return d.color;
      }).attr('font-size', function(d) {
        return d.fontSize;
      }).call(drag);
      labels_svg = this.svg.selectAll('.lab');
      SvgUtils.get().setSvgBBoxWidthAndHeight(this.data.lab, labels_svg);
      console.log("rhtmlLabeledScatter: Running label placement algorithm...");
      labeler = d3.labeler().svg(this.svg).w1(this.viewBoxDim.x).w2(this.viewBoxDim.x + this.viewBoxDim.width).h1(this.viewBoxDim.y).h2(this.viewBoxDim.y + this.viewBoxDim.height).anchor(this.data.pts).label(this.data.lab).pinned(this.state.getUserPositionedLabIds()).start(500);
      labels_svg.transition().duration(800).attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      });
      return this.drawLinks();
    }
  };

  RectPlot.prototype.drawLinks = function() {
    var ancBorderPt, i, links, newLinkPt, pt, _i, _len, _ref;
    links = [];
    _ref = this.data.pts;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      pt = _ref[i];
      newLinkPt = LinkUtils.get().getNewPtOnLabelBorder(this.data.lab[i], pt, this.data.pts);
      if (newLinkPt != null) {
        ancBorderPt = LinkUtils.get().getPtOnAncBorder(pt.x, pt.y, pt.r, newLinkPt[0], newLinkPt[1]);
        links.push({
          x1: ancBorderPt[0],
          y1: ancBorderPt[1],
          x2: newLinkPt[0],
          y2: newLinkPt[1],
          width: 1,
          color: pt.color
        });
      }
    }
    return this.svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').attr('x1', function(d) {
      return d.x1;
    }).attr('y1', function(d) {
      return d.y1;
    }).attr('x2', function(d) {
      return d.x2;
    }).attr('y2', function(d) {
      return d.y2;
    }).attr('stroke-width', function(d) {
      return d.width;
    }).attr('stroke', function(d) {
      return d.color;
    }).style('stroke-opacity', this.data.plotColors.getFillOpacity(this.transparency));
  };

  return RectPlot;

})();
