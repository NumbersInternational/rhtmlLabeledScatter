// Generated by CoffeeScript 1.8.0
var PlotData;

PlotData = (function() {
  function PlotData(X, Y, group, label, viewBoxDim, legendDim, colors) {
    this.X = X;
    this.Y = Y;
    this.origX = X.slice(0);
    this.origY = Y.slice(0);
    this.normX = X.slice(0);
    this.normY = Y.slice(0);
    this.group = group;
    this.label = label;
    this.viewBoxDim = viewBoxDim;
    this.legendDim = legendDim;
    this.draggedOutPtsId = [];
    this.legendPts = [];
    this.colorWheel = colors ? colors : ['#5B9BD5', '#ED7D31', '#A5A5A5', '#1EC000', '#4472C4', '#70AD47', '#255E91', '#9E480E', '#636363', '#997300', '#264478', '#43682B', '#FF2323'];
    this.cIndex = 0;
    if (this.X.length === this.Y.length) {
      this.len = this.origLen = X.length;
      this.normalizeData();
      this.setupColors();
      this.calcDataArrays();
    } else {
      throw new Error("Inputs X and Y lengths do not match!");
    }
  }

  PlotData.prototype.normalizeData = function() {
    var i, notMovedX, notMovedY, ptsOut, thres, xThres, yThres, _results;
    ptsOut = this.draggedOutPtsId;
    notMovedX = _.filter(this.origX, function(val, key) {
      return !(_.includes(ptsOut, key));
    });
    notMovedY = _.filter(this.origY, function(val, key) {
      return !(_.includes(ptsOut, key));
    });
    this.minX = _.min(notMovedX);
    this.maxX = _.max(notMovedX);
    this.minY = _.min(notMovedY);
    this.maxY = _.max(notMovedY);
    thres = 0.08;
    xThres = thres * (this.maxX - this.minX);
    this.maxX = this.maxX < 0 ? 0 : this.maxX + xThres;
    this.minX = this.minX > 0 ? 0 : this.minX - xThres;
    yThres = thres * (this.maxY - this.minY);
    this.maxY = this.maxY < 0 ? 0 : this.maxY + yThres;
    this.minY = this.minY > 0 ? 0 : this.minY - yThres;
    i = 0;
    _results = [];
    while (i < this.origLen) {
      if (!_.includes(ptsOut, i)) {
        this.normX[i] = (this.X[i] - this.minX) / (this.maxX - this.minX);
        this.normY[i] = (this.Y[i] - this.minY) / (this.maxY - this.minY);
      }
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.setupColors = function() {
    var group, i, newColor, _results;
    this.legendGroups = [];
    this.groupToColorMap = {};
    group = this.group;
    i = 0;
    _results = [];
    while (i < this.len) {
      if (!(_.some(this.legendGroups, function(e) {
        return e.text === group[i];
      }))) {
        newColor = this.getDefaultColor();
        this.legendGroups.push({
          text: this.group[i],
          color: newColor
        });
        this.groupToColorMap[this.group[i]] = newColor;
      }
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.calcDataArrays = function() {
    var i, x, y, _results;
    this.pts = [];
    this.lab = [];
    this.anc = [];
    i = 0;
    _results = [];
    while (i < this.origLen) {
      if (!_.includes(this.draggedOutPtsId, i)) {
        x = this.normX[i] * this.viewBoxDim.width + this.viewBoxDim.x;
        y = (1 - this.normY[i]) * this.viewBoxDim.height + this.viewBoxDim.y;
        this.pts.push({
          x: x,
          y: y,
          r: 2,
          label: this.label[i],
          labelX: this.origX[i].toPrecision(3).toString(),
          labelY: this.origY[i].toPrecision(3).toString(),
          group: this.group[i],
          color: this.groupToColorMap[this.group[i]],
          id: i
        });
        this.lab.push({
          x: x,
          y: y,
          text: this.label[i],
          color: this.groupToColorMap[this.group[i]],
          id: i
        });
        this.anc.push({
          x: x,
          y: y,
          r: 2,
          id: i
        });
      }
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.setupLegendGroups = function(legendGroups, legendDim) {
    var i, legendStartY, li, _results;
    legendStartY = Math.max(this.viewBoxDim.y + this.viewBoxDim.height / 2 - legendDim.heightOfRow * legendGroups.length / 2 + legendDim.ptRadius, this.viewBoxDim.y + legendDim.ptRadius);
    i = 0;
    _results = [];
    while (i < legendGroups.length) {
      li = legendGroups[i];
      li.r = legendDim.ptRadius;
      li.cx = legendDim.x + legendDim.leftPadding;
      li.cy = legendStartY + i * legendDim.heightOfRow;
      li.x = li.cx + legendDim.ptToTextSpace;
      li.y = li.cy + li.r;
      li.anchor = 'start';
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.calcLegendDisplayPtsAndGroups = function(legendGroups, legendDim, legendPts) {
    var i, j, legendStartY, lgi, lpj, _results;
    if (legendPts.length > 0) {
      legendStartY = Math.max(this.viewBoxDim.y + this.viewBoxDim.height / 2 - legendDim.heightOfRow * (legendGroups.length + legendPts.length) / 2 + legendDim.ptRadius, this.viewBoxDim.y + legendDim.ptRadius);
      i = 0;
      j = 0;
      _results = [];
      while (i < legendGroups.length + legendPts.length) {
        if (i < legendGroups.length) {
          lgi = legendGroups[i];
          lgi.r = legendDim.ptRadius;
          lgi.cx = legendDim.x + legendDim.leftPadding;
          lgi.cy = legendStartY + i * legendDim.heightOfRow;
          lgi.x = lgi.cx + legendDim.ptToTextSpace;
          lgi.y = lgi.cy + lgi.r;
          lgi.anchor = 'start';
        } else {
          j = i - legendGroups.length;
          lpj = legendPts[j];
          lpj.r = legendDim.ptMovedRadius;
          lpj.cx = legendDim.x + legendDim.leftPadding;
          lpj.cy = legendStartY + (i + 1) * legendDim.heightOfRow;
          lpj.yOffset = legendDim.yPtOffset;
          lpj.x = lpj.cx + legendDim.ptToTextSpace;
          lpj.y = lpj.cy + lpj.r;
          lpj.color = lpj.pt.color;
          lpj.text = lpj.pt.label + ' (' + lpj.pt.labelX + ', ' + lpj.pt.labelY + ')';
          lpj.anchor = 'start';
        }
        _results.push(i++);
      }
      return _results;
    } else {
      return this.setupLegendGroups(legendGroups, legendDim);
    }
  };

  PlotData.prototype.resizedAfterLegendGroupsDrawn = function() {
    var initVal, legendGrpsTextMax, legendPtsTextMax;
    initVal = this.legendDim.maxTextWidth;
    legendGrpsTextMax = (_.maxBy(this.legendGroups, function(e) {
      return e.width;
    })).width;
    legendPtsTextMax = this.legendPts.length > 0 ? (_.maxBy(this.legendPts, function(e) {
      return e.width;
    })).width : 0;
    this.legendDim.maxTextWidth = Math.max(legendGrpsTextMax, legendPtsTextMax);
    this.legendDim.width = this.legendDim.maxTextWidth + this.legendDim.leftPadding + this.legendDim.ptRadius * 2 + this.legendDim.rightPadding + this.legendDim.ptToTextSpace;
    this.viewBoxDim.width = this.viewBoxDim.svgWidth - this.legendDim.width - this.viewBoxDim.x;
    this.legendDim.x = this.viewBoxDim.x + this.viewBoxDim.width;
    this.setupLegendGroups(this.legendGroups, this.legendDim);
    this.calcLegendDisplayPtsAndGroups(this.legendGroups, this.legendDim, this.legendPts);
    return initVal !== this.legendDim.maxTextWidth;
  };

  PlotData.prototype.getDefaultColor = function() {
    return this.colorWheel[(this.cIndex++) % this.colorWheel.length];
  };

  PlotData.prototype.isOutsideViewBox = function(lab) {
    var bot, left, right, top;
    left = lab.x - lab.width / 2;
    right = lab.x + lab.width / 2;
    top = lab.y - lab.height;
    bot = lab.y;
    if (left < this.viewBoxDim.x || right > this.viewBoxDim.x + this.viewBoxDim.width || top < this.viewBoxDim.y || bot > this.viewBoxDim.y + this.viewBoxDim.height) {
      return true;
    }
    return false;
  };

  PlotData.prototype.moveElemToLegend = function(id, legendPts) {
    var checkId, movedAnc, movedLab, movedPt;
    checkId = function(e) {
      return e.id === id;
    };
    movedPt = _.remove(this.pts, checkId);
    movedLab = _.remove(this.lab, checkId);
    movedAnc = _.remove(this.anc, checkId);
    legendPts.push({
      pt: movedPt[0],
      lab: movedLab[0],
      anc: movedAnc[0]
    });
    this.draggedOutPtsId.push(id);
    this.len--;
    this.normalizeData();
    this.calcDataArrays();
    return this.calcLegendDisplayPtsAndGroups(this.legendGroups, this.legendDim, legendPts);
  };

  return PlotData;

})();
