// Generated by CoffeeScript 1.8.0
var RectPlot;

RectPlot = (function() {
  function RectPlot(width, height, X, Y, Z, group, label, svg, fixedRatio, xTitle, yTitle, zTitle, title, colors, grid, origin, originAlign, titleFontFamily, titleFontSize, titleFontColor, xTitleFontFamily, xTitleFontSize, xTitleFontColor, yTitleFontFamily, yTitleFontSize, yTitleFontColor, showLabels, labelsFontFamily, labelsFontSize, labelsFontColor, xDecimals, yDecimals, xPrefix, yPrefix, legendShow, legendFontFamily, legendFontSize, legendFontColor, axisFontFamily, axisFontColor, axisFontSize, pointRadius) {
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
    this.originAlign = originAlign;
    this.showLabels = showLabels != null ? showLabels : true;
    this.xDecimals = xDecimals;
    this.yDecimals = yDecimals;
    this.xPrefix = xPrefix;
    this.yPrefix = yPrefix;
    this.legendShow = legendShow;
    this.legendFontFamily = legendFontFamily;
    this.legendFontSize = legendFontSize;
    this.legendFontColor = legendFontColor;
    this.axisFontFamily = axisFontFamily;
    this.axisFontColor = axisFontColor;
    this.axisFontSize = axisFontSize;
    this.pointRadius = pointRadius != null ? pointRadius : 2;
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
    this.verticalPadding = 5;
    this.horizontalPadding = 10;
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
      width: width - this.legendDim.width - this.horizontalPadding * 3 - this.axisLeaderLineLength - this.axisDimensionTextWidth - this.yTitle.textHeight,
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
    return this.data = new PlotData(this.X, this.Y, this.Z, this.group, this.label, this.viewBoxDim, this.legendDim, this.colors, this.fixedRatio, this.originAlign, this.pointRadius);
  };

  RectPlot.prototype.draw = function(plot) {
    var dimensionMarkerPromise, legendPromise, resizePromises;
    dimensionMarkerPromise = new Promise(function(resolve, reject) {
      plot.drawDimensionMarkers(reject);
      return resolve();
    });
    legendPromise = new Promise(function(resolve, reject) {
      plot.drawLegend(plot, plot.data, reject);
      return resolve();
    });
    resizePromises = [dimensionMarkerPromise, legendPromise];
    return Promise.all(resizePromises).then(function() {
      plot.data.normalizeData(plot.data);
      plot.data.calcDataArrays();
      plot.title.x = plot.viewBoxDim.x + plot.viewBoxDim.width / 2;
      plot.drawTitle();
      plot.drawAnc(plot.data);
      plot.drawLabs(plot);
      plot.drawDraggedMarkers(plot.data);
      plot.drawRect();
      return plot.drawAxisLabels();
    })["catch"](function(resizedPlot) {
      return resizedPlot.draw(resizedPlot);
    });
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

  RectPlot.prototype.drawDimensionMarkers = function(reject) {
    var axisArrays, bb, i, initHeight, initWidth, ml;
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
    ml = this.svg.selectAll('.dim-marker-label').data(axisArrays.axisLeaderLabel).enter().append('text').attr('class', 'dim-marker-label').attr('x', function(d) {
      return d.x;
    }).attr('y', function(d) {
      return d.y;
    }).attr('font-family', this.axisFontFamily).attr('fill', this.axisFontColor).attr('font-size', this.axisFontSize).text(function(d) {
      return d.label;
    }).attr('text-anchor', function(d) {
      return d.anchor;
    });
    this.maxTextWidthOfDimensionMarkerLabels = 0;
    initWidth = this.axisDimensionTextWidth;
    initHeight = this.axisDimensionTextHeight;
    i = 0;
    while (i < ml[0].length) {
      bb = ml[0][i].getBBox();
      if (this.axisDimensionTextWidth < bb.width) {
        this.axisDimensionTextWidth = bb.width;
      }
      if (this.axisDimensionTextHeight < bb.height) {
        this.axisDimensionTextHeight = bb.height;
      }
      i++;
    }
    if (initWidth !== this.axisDimensionTextWidth || initHeight !== this.axisDimensionTextHeight) {
      this.setDim(this.svg, this.width, this.height);
      return reject(this);
    }
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

  RectPlot.prototype.drawLegend = function(plot, data, reject) {
    var drag, getSuperscript, legendBubbleTitleSvg, legendDraggedPtsLab, legendFontSize, legendGroupsLab, legendLabelDragAndDrop, superscript;
    data.setupLegendGroupsAndPts(data);
    superscript = [8304, 185, 178, 179, 8308, 8309, 8310, 8311, 8312, 8313];
    getSuperscript = function(id) {
      var digit, ss;
      ss = '';
      while (id > 0) {
        digit = id % 10;
        ss = String.fromCharCode(superscript[id % 10]) + ss;
        id = (id - digit) / 10;
      }
      return ss;
    };
    legendLabelDragAndDrop = function(plot, data) {
      var dragEnd, dragMove, dragStart;
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
          return plot.elemDraggedOnPlot(plot, id);
        }
      };
      return d3.behavior.drag().origin(function() {
        return {
          x: d3.select(this).attr("x"),
          y: d3.select(this).attr("y")
        };
      }).on('dragstart', dragStart).on('drag', dragMove).on('dragend', dragEnd);
    };
    if (this.legendShow) {
      if ((this.Z != null) && this.Z instanceof Array) {
        this.svg.selectAll('.legend-bubbles').remove();
        this.svg.selectAll('.legend-bubbles').data(data.legendBubbles).enter().append('circle').attr('class', 'legend-bubbles').attr('cx', function(d) {
          return d.cx;
        }).attr('cy', function(d) {
          return d.cy;
        }).attr('r', function(d) {
          return d.r;
        }).attr('fill', 'none').attr('stroke', 'black').attr('stroke-opacity', 0.5);
      }
      this.svg.selectAll('.legend-bubbles-labels').remove();
      this.svg.selectAll('.legend-bubbles-labels').data(data.legendBubbles).enter().append('text').attr('class', 'legend-bubbles-labels').attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      }).attr('text-anchor', 'middle').attr('font-size', this.legendFontSize).attr('font-family', this.legendFontFamily).attr('fill', this.legendFontColor).text(function(d) {
        return d.text;
      });
      if (this.zTitle !== '') {
        legendFontSize = this.legendFontSize;
        this.svg.selectAll('.legend-bubbles-title').remove();
        legendBubbleTitleSvg = this.svg.selectAll('.legend-bubbles-title').data(data.legendBubblesTitle).enter().append('text').attr('class', 'legend-bubbles-title').attr('x', function(d) {
          return d.x;
        }).attr('y', function(d) {
          return d.y - (legendFontSize * 1.5);
        }).attr('text-anchor', 'middle').attr('font-family', this.legendFontFamily).attr('font-weight', 'bold').attr('fill', this.legendFontColor).text(this.zTitle);
        SvgUtils.get().setSvgBBoxWidthAndHeight(data.legendBubblesTitle.length, data.legendBubblesTitle, legendBubbleTitleSvg);
      }
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
      }).attr('font-family', this.legendFontFamily).attr('fill', this.legendFontColor).attr('font-size', this.legendFontSize).text(function(d) {
        return d.text;
      }).attr('text-anchor', function(d) {
        return d.anchor;
      });
      drag = legendLabelDragAndDrop(plot, data);
      this.svg.selectAll('.legend-dragged-pts-text').remove();
      this.svg.selectAll('.legend-dragged-pts-text').data(data.legendPts).enter().append('text').attr('class', 'legend-dragged-pts-text').attr('id', function(d) {
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
          return getSuperscript(d.markerId + 1) + d.text;
        } else {
          return d.text;
        }
      }).call(drag);
      legendGroupsLab = this.svg.selectAll('.legend-groups-text');
      legendDraggedPtsLab = this.svg.selectAll('.legend-dragged-pts-text');
      SvgUtils.get().setSvgBBoxWidthAndHeight(data.legendGroups.length, data.legendGroups, legendGroupsLab);
      SvgUtils.get().setSvgBBoxWidthAndHeight(data.legendPts.length, data.legendPts, legendDraggedPtsLab);
      if (data.resizedAfterLegendGroupsDrawn()) {
        return reject(plot);
      }
    }
  };

  RectPlot.prototype.drawAnc = function(data) {
    var anc;
    this.svg.selectAll('.anc').remove();
    anc = this.svg.selectAll('.anc').data(data.pts).enter().append('circle').attr('class', 'anc').attr('cx', function(d) {
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
    if ((this.Z != null) && this.Z instanceof Array) {
      return anc.append('title').text(function(d) {
        return "" + d.label + "\n" + d.labelZ + "\n" + d.group + "\n[" + d.labelX + ", " + d.labelY + "]";
      });
    } else {
      return anc.append('title').text(function(d) {
        return "" + d.label + "\n" + d.group + "\n[" + d.labelX + ", " + d.labelY + "]";
      });
    }
  };

  RectPlot.prototype.drawDraggedMarkers = function(data) {
    this.svg.selectAll('.marker').remove();
    this.svg.selectAll('.marker').data(data.draggedOutMarkers).enter().append('line').attr('class', 'marker').attr('x1', function(d) {
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
    return this.svg.selectAll('.marker-label').data(data.draggedOutMarkers).enter().append('text').attr('class', 'marker-label').attr('x', function(d) {
      return d.markerTextX;
    }).attr('y', function(d) {
      return d.markerTextY;
    }).attr('font-family', 'Arial').attr('text-anchor', 'start').attr('font-size', data.legendDim.markerTextSize).attr('fill', function(d) {
      return d.color;
    }).text(function(d) {
      return d.markerLabel;
    });
  };

  RectPlot.prototype.elemDraggedOffPlot = function(plot, id) {
    plot.data.moveElemToLegend(id, plot.data);
    return plot.resetPlotAfterDragEvent(plot);
  };

  RectPlot.prototype.elemDraggedOnPlot = function(plot, id) {
    plot.data.removeElemFromLegend(id, plot.data);
    return plot.resetPlotAfterDragEvent(plot);
  };

  RectPlot.prototype.resetPlotAfterDragEvent = function(plot) {
    var elem, plotElems, _i, _len;
    plotElems = ['.plot-viewbox', '.origin', '.dim-marker', '.dim-marker-leader', '.dim-marker-label', '.axis-label', '.legend-pts', '.legend-text', '.anc', '.lab', '.link'];
    for (_i = 0, _len = plotElems.length; _i < _len; _i++) {
      elem = plotElems[_i];
      this.svg.selectAll(elem).remove();
    }
    return plot.draw(plot);
  };

  RectPlot.prototype.drawLabs = function(plot) {
    var drag, labelDragAndDrop, labeler, labels_svg;
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
          return plot.elemDraggedOffPlot(plot, id);
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
    if (this.showLabels) {
      drag = labelDragAndDrop();
      plot.svg.selectAll('.lab').remove();
      plot.svg.selectAll('.lab').data(plot.data.lab).enter().append('text').attr('class', 'lab').attr('id', function(d) {
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
      labels_svg = plot.svg.selectAll('.lab');
      SvgUtils.get().setSvgBBoxWidthAndHeight(plot.data.len, plot.data.lab, labels_svg);
      console.log("Running label placement algorithm...");
      labeler = d3.labeler().svg(plot.svg).w1(plot.viewBoxDim.x).w2(plot.viewBoxDim.x + plot.viewBoxDim.width).h1(plot.viewBoxDim.y).h2(plot.viewBoxDim.y + plot.viewBoxDim.height).anchor(plot.data.pts).label(plot.data.lab).start(500);
      labels_svg.transition().duration(800).attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      });
      return plot.drawLinks(plot.svg, plot.data);
    }
  };

  RectPlot.prototype.drawLinks = function(svg, data) {
    var ancBorderPt, i, links, newLinkPt, utils;
    utils = LinkUtils.get();
    links = [];
    i = 0;
    while (i < data.len) {
      newLinkPt = utils.getNewPtOnLabelBorder(data.lab[i], data.pts[i], data.pts);
      if (newLinkPt != null) {
        ancBorderPt = utils.getPtOnAncBorder(data.pts[i].x, data.pts[i].y, data.pts[i].r, newLinkPt[0], newLinkPt[1]);
        links.push({
          x1: ancBorderPt[0],
          y1: ancBorderPt[1],
          x2: newLinkPt[0],
          y2: newLinkPt[1],
          width: 1,
          color: data.pts[i].color
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
    }).attr('stroke', function(d) {
      return d.color;
    }).style('stroke-opacity', 0.7);
  };

  return RectPlot;

})();
