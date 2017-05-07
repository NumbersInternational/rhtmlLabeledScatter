import _ from 'lodash';
import PlotColors from './PlotColors';
import PlotLabel from './PlotLabel';
import LegendUtils from './utils/LegendUtils';
import Utils from './utils/Utils';

// To Refactor:
//   * fixed aspect ratio code can (probably) be simplified : see Pictograph utils/geometryUtils.js
//


class PlotData {
  constructor(X,
    Y,
    Z,
    group,
    label,
    labelAlt,
    viewBoxDim,
    legendDim,
    colorWheel,
    fixedAspectRatio,
    originAlign,
    pointRadius,
    bounds,
    transparency,
    legendShow,
    legendBubblesShow,
    axisDimensionText) {
    this.revertMinMax = this.revertMinMax.bind(this);
    this.calculateMinMax = this.calculateMinMax.bind(this);
    this.normalizeData = this.normalizeData.bind(this);
    this.normalizeZData = this.normalizeZData.bind(this);
    this.getPtsAndLabs = this.getPtsAndLabs.bind(this);
    this.setLegendItemsPositions = this.setLegendItemsPositions.bind(this);
    this.setupLegendGroupsAndPts = this.setupLegendGroupsAndPts.bind(this);
    this.resizedAfterLegendGroupsDrawn = this.resizedAfterLegendGroupsDrawn.bind(this);
    this.isOutsideViewBox = this.isOutsideViewBox.bind(this);
    this.isLegendPtOutsideViewBox = this.isLegendPtOutsideViewBox.bind(this);
    this.addElemToLegend = this.addElemToLegend.bind(this);
    this.removeElemFromLegend = this.removeElemFromLegend.bind(this);
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.group = group;
    this.label = label;
    this.labelAlt = labelAlt;
    this.viewBoxDim = viewBoxDim;
    this.legendDim = legendDim;
    this.colorWheel = colorWheel;
    this.fixedAspectRatio = fixedAspectRatio;
    this.originAlign = originAlign;
    this.pointRadius = pointRadius;
    this.bounds = bounds;
    this.transparency = transparency;
    this.legendShow = legendShow;
    this.legendBubblesShow = legendBubblesShow;
    this.axisDimensionText = axisDimensionText;
    this.origX = this.X.slice(0);
    this.origY = this.Y.slice(0);
    this.normX = this.X.slice(0);
    this.normY = this.Y.slice(0);
    if (Utils.isArrOfNums(this.Z) && (this.Z.length === this.X.length)) { this.normZ = this.Z.slice(); }
    this.outsidePlotPtsId = [];
    this.legendPts = [];
    this.outsidePlotCondensedPts = [];
    this.legendBubbles = [];
    this.legendBubblesLab = [];
    this.legendRequiresRedraw = false;

    if (this.X.length === this.Y.length) {
      this.len = (this.origLen = X.length);
      this.normalizeData();
      if (Utils.isArrOfNums(this.Z)) { this.normalizeZData(); }
      this.plotColors = new PlotColors(this);
      this.labelNew = new PlotLabel(this.label, this.labelAlt, this.viewBoxDim.labelLogoScale);
    } else {
      throw new Error('Inputs X and Y lengths do not match!');
    }
  }

  revertMinMax() {
    this.minX = this.minXold;
    this.maxX = this.maxXold;
    this.minY = this.minYold;
    return this.maxY = this.maxYold;
  }

  calculateMinMax() {
    this.minXold = this.minX;
    this.maxXold = this.maxX;
    this.minYold = this.minY;
    this.maxYold = this.maxY;

    const ptsOut = this.outsidePlotPtsId;
    const notMovedX = _.filter(this.origX, (val, key) => !(_.includes(ptsOut, key)));
    const notMovedY = _.filter(this.origY, (val, key) => !(_.includes(ptsOut, key)));

    this.minX = _.min(notMovedX);
    this.maxX = _.max(notMovedX);
    this.minY = _.min(notMovedY);
    this.maxY = _.max(notMovedY);

    // threshold used so pts are not right on border of plot
    let rangeX = this.maxX - this.minX;
    let rangeY = this.maxY - this.minY;
    const thres = 0.08;
    let xThres = thres * rangeX;
    let yThres = thres * rangeY;
    if (xThres === 0) { // if there is no difference, add arbitrary threshold of 1
      xThres = 1;
    }
    if (yThres === 0) { // if there is no difference, add arbitrary threshold of 1
      yThres = 1;
    }

    // Note: Thresholding increase the space around the points which is why we add to the max and min
    this.maxX += xThres;
    this.minX -= xThres;
    this.maxY += yThres;
    this.minY -= yThres;

    // originAlign: compensates to make sure origin lines are on axis
    if (this.originAlign) {
      this.maxX = this.maxX < 0 ? 0 : this.maxX + xThres; // so axis can be on origin
      this.minX = this.minX > 0 ? 0 : this.minX - xThres;
      this.maxY = this.maxY < 0 ? 0 : this.maxY + yThres;
      this.minY = this.minY > 0 ? 0 : this.minY - yThres;
    }


    // TODO KZ (another) this can be simplified : see Pictograph utils/geometryUtils.js
    if (this.fixedAspectRatio) {
      rangeX = this.maxX - this.minX;
      rangeY = this.maxY - this.minY;
      const rangeAR = Math.abs(rangeX / rangeY);
      const widgetAR = (this.viewBoxDim.width / this.viewBoxDim.height);
      const rangeToWidgetARRatio = widgetAR / rangeAR;

      if (widgetAR >= 1) {
        if (rangeX > rangeY) {
          if (rangeToWidgetARRatio > 1) {
            this.maxX += (((widgetAR * rangeY) - rangeX) / 2);
            this.minX -= (((widgetAR * rangeY) - rangeX) / 2);
          } else {
            this.maxY += (((1 / widgetAR) * rangeX) - rangeY) / 2;
            this.minY -= (((1 / widgetAR) * rangeX) - rangeY) / 2;
          }
        } else if (rangeX < rangeY) {
          this.maxX += ((widgetAR * rangeY) - rangeX) / 2;
          this.minX -= ((widgetAR * rangeY) - rangeX) / 2;
        }
      } else if (rangeX < rangeY) {
        if (rangeToWidgetARRatio < 1) {
          this.maxY += (((1 / widgetAR) * rangeX) - rangeY) / 2;
          this.minY -= (((1 / widgetAR) * rangeX) - rangeY) / 2;
        } else {
          this.maxX += ((widgetAR * rangeY) - rangeX) / 2;
          this.minX -= ((widgetAR * rangeY) - rangeX) / 2;
        }
      } else if (rangeX > rangeY) {
        this.maxY += (((1 / widgetAR) * rangeX) - rangeY) / 2;
        this.minY -= (((1 / widgetAR) * rangeX) - rangeY) / 2;
      }
    }

    // TODO KZ this should be done first to skip the wasted computation (unless there are side effect in the above) ??
    // If user has sent x and y boundaries, these hold higher priority
    if (Utils.isNum(this.bounds.xmax)) { this.maxX = this.bounds.xmax; }
    if (Utils.isNum(this.bounds.xmin)) { this.minX = this.bounds.xmin; }
    if (Utils.isNum(this.bounds.ymax)) { this.maxY = this.bounds.ymax; }
    if (Utils.isNum(this.bounds.ymin)) { return this.minY = this.bounds.ymin; }
  }

  normalizeData() {
    // TODO KZ remove this side effect. Plus Data.calcMinMax is called over and over in the code. Why ??
    let i;
    this.calculateMinMax();

    // create list of movedOffPts that need markers
    this.outsidePlotMarkers = [];
    this.outsidePlotMarkersIter = 0;

    for (const lp of Array.from(this.legendPts)) {
      var { id } = lp.pt;
      let draggedNormX = (this.X[id] - this.minX) / (this.maxX - this.minX);
      let draggedNormY = (this.Y[id] - this.minY) / (this.maxY - this.minY);
      // TODO KZ the ++ should be immed. after the use of the iter !
      const newMarkerId = this.outsidePlotMarkersIter;
      lp.markerId = newMarkerId;

      if ((Math.abs(draggedNormX) > 1) || (Math.abs(draggedNormY) > 1) ||
         (draggedNormX < 0) || (draggedNormY < 0)) {
        var markerTextY,
          x1,
          y1;
        draggedNormX = draggedNormX > 1 ? 1 : draggedNormX;
        draggedNormX = draggedNormX < 0 ? 0 : draggedNormX;
        draggedNormY = draggedNormY > 1 ? 1 : draggedNormY;
        draggedNormY = draggedNormY < 0 ? 0 : draggedNormY;
        const x2 = (draggedNormX * this.viewBoxDim.width) + this.viewBoxDim.x;
        const y2 = ((1 - draggedNormY) * this.viewBoxDim.height) + this.viewBoxDim.y;

        let markerTextX = (markerTextY = 0);
        const numDigitsInId = Math.ceil(Math.log(newMarkerId + 1.1) / Math.LN10);
        if (draggedNormX === 1) { // right bound
          x1 = x2 + this.legendDim.markerLen;
          y1 = y2;
          markerTextX = x1;
          markerTextY = y1 + (this.legendDim.markerTextSize / 2);
        } else if (draggedNormX === 0) { // left bound
          x1 = x2 - this.legendDim.markerLen;
          y1 = y2;
          markerTextX = x1 - (this.legendDim.markerCharWidth * (numDigitsInId + 1));
          markerTextY = y1 + (this.legendDim.markerTextSize / 2);
        } else if (draggedNormY === 1) { // top bound
          x1 = x2;
          y1 = y2 + (-draggedNormY * this.legendDim.markerLen);
          markerTextX = x1 - (this.legendDim.markerCharWidth * (numDigitsInId));
          markerTextY = y1;
        } else if (draggedNormY === 0) { // bot bound
          x1 = x2;
          y1 = y2 + this.legendDim.markerLen;
          markerTextX = x1 - (this.legendDim.markerCharWidth * (numDigitsInId));
          markerTextY = y1 + this.legendDim.markerTextSize;
        }

        // TODO KZ bug? : newMarkerId + 1, but lp.markerId = newMarker ??
        this.outsidePlotMarkers.push({
          markerLabel: newMarkerId + 1,
          ptId: id,
          x1,
          y1,
          x2,
          y2,
          markerTextX,
          markerTextY,
          width: this.legendDim.markerWidth,
          color: lp.color,
        });

        // if the points were condensed, remove point
        this.outsidePlotCondensedPts = _.filter(this.outsidePlotCondensedPts, e => e.dataId !== id);
        this.len = this.origLen - this.outsidePlotMarkers.length;
      } else { // no marker required, but still inside plot window
        console.log('rhtmlLabeledScatter: Condensed point added');
        const condensedPtsDataIdArray = _.map(this.outsidePlotCondensedPts, e => e.dataId);
        if (!_.includes(condensedPtsDataIdArray, id)) {
          this.outsidePlotCondensedPts.push({
            dataId: id,
            markerId: newMarkerId,
          });
        }
      }
      this.outsidePlotMarkersIter++;
    }

    // Remove pts that are outside plot if user bounds were set
    this.outsideBoundsPtsId = [];
    if (_.some(this.bounds, b => Utils.isNum(b))) {
      i = 0;
      while (i < this.origLen) {
        if (!_.includes(this.outsideBoundsPtsId, i)) {
          if ((this.X[i] < this.minX) || (this.X[i] > this.maxX) ||
             (this.Y[i] < this.minY) || (this.Y[i] > this.maxY)) {
            this.outsideBoundsPtsId.push(i);
          }
        }
        i++;
      }
    }

    i = 0;
    return (() => {
      const result = [];
      while (i < this.origLen) {
        this.normX[i] = this.minX === this.maxX ? this.minX : (this.X[i] - this.minX) / (this.maxX - this.minX);
        // copy/paste bug using x when calculating Y. WTF is this even doing ?
        this.normY[i] = this.minY === this.maxY ? this.minX : (this.Y[i] - this.minY) / (this.maxY - this.minY);
        result.push(i++);
      }
      return result;
    })();
  }

  normalizeZData() {
    const legendUtils = LegendUtils;

    const maxZ = _.max(this.Z);
    legendUtils.calcZQuartiles(this, maxZ);
    return legendUtils.normalizeZValues(this, maxZ);
  }

  getPtsAndLabs(calleeName) {
    console.log(`getPtsAndLabs(${calleeName})`);
    return Promise.all(this.labelNew.getLabels()).then((resolvedLabels) => {
//      console.log("resolvedLabels for getPtsandLabs callee name #{calleeName}")
//      console.log(resolvedLabels)

      this.pts = [];
      this.lab = [];

      let i = 0;
      while (i < this.origLen) {
        if ((!_.includes(this.outsidePlotPtsId, i)) ||
           _.includes((_.map(this.outsidePlotCondensedPts, e => e.dataId)), i)) {
          var ptColor;
          const x = (this.normX[i] * this.viewBoxDim.width) + this.viewBoxDim.x;
          const y = ((1 - this.normY[i]) * this.viewBoxDim.height) + this.viewBoxDim.y;
          let r = this.pointRadius;
          if (Utils.isArrOfNums(this.Z)) {
            const legendUtils = LegendUtils;
            r = legendUtils.normalizedZtoRadius(this.viewBoxDim, this.normZ[i]);
          }
          const fillOpacity = this.plotColors.getFillOpacity(this.transparency);

          let { label } = resolvedLabels[i];
          const labelAlt = ((this.labelAlt != null ? this.labelAlt[i] : undefined) != null) ? this.labelAlt[i] : '';
          let { width } = resolvedLabels[i];
          let { height } = resolvedLabels[i];
          let { url } = resolvedLabels[i];

          const labelZ = Utils.isArrOfNums(this.Z) ? this.Z[i].toString() : '';
          let fontSize = this.viewBoxDim.labelFontSize;

          // If pt hsa been already condensed
          if (_.includes((_.map(this.outsidePlotCondensedPts, e => e.dataId)), i)) {
            const pt = _.find(this.outsidePlotCondensedPts, e => e.dataId === i);
            label = pt.markerId + 1;
            fontSize = this.viewBoxDim.labelSmallFontSize;
            url = '';
            width = null;
            height = null;
          }

          let fontColor = (ptColor = this.plotColors.getColor(i));
          if ((this.viewBoxDim.labelFontColor != null) && !(this.viewBoxDim.labelFontColor === '')) { fontColor = this.viewBoxDim.labelFontColor; }
          const group = (this.group != null) ? this.group[i] : '';
          this.pts.push({
            x,
            y,
            r,
            label,
            labelAlt,
            labelX: this.origX[i].toPrecision(3).toString(),
            labelY: this.origY[i].toPrecision(3).toString(),
            labelZ,
            group,
            color: ptColor,
            id: i,
            fillOpacity,
          });
          this.lab.push({
            x,
            y,
            color: fontColor,
            id: i,
            fontSize,
            fontFamily: this.viewBoxDim.labelFontFamily,
            text: label,
            width,
            height,
            url,
          });
        }
        i++;
      }

      // Remove pts outside plot because user bounds set
      return (() => {
        const result = [];
        for (const p of Array.from(this.outsideBoundsPtsId)) {
          let item;
          if (!_.includes(this.outsidePlotPtsId, p)) { item = this.addElemToLegend(p); }
          result.push(item);
        }
        return result;
      })();
    }).catch(err => console.log(err));
  }

  // TODO KZ rename to numColumns once meaning is confirmed
  // TODO KZ If I have an array, I dont need to be told its length
  setLegendItemsPositions(numItems, itemsArray, cols) {
    const bubbleLegendTextHeight = 20;
    this.legendHeight = this.viewBoxDim.height;
    if ((this.legendBubblesTitle != null) && this.legendBubblesShow) {
      this.legendHeight = this.legendBubblesTitle[0].y - bubbleLegendTextHeight - this.viewBoxDim.y;
    }

    if (this.Zquartiles != null) {
      const legendUtils = LegendUtils;
      legendUtils.setupBubbles(this);
    }

    const startOfCenteredLegendItems = (((this.viewBoxDim.y + (this.legendHeight / 2)) -
                                  ((this.legendDim.heightOfRow * (numItems / cols)) / 2)) +
                                  this.legendDim.ptRadius);
    const startOfViewBox = this.viewBoxDim.y + this.legendDim.ptRadius;
    const legendStartY = Math.max(startOfCenteredLegendItems, startOfViewBox);

    let colSpacing = 0;
    let numItemsInPrevCols = 0;

    let i = 0;
    let currentCol = 1;
    return (() => {
      const result = [];
      while (i < numItems) {
        if (cols > 1) {
          const numElemsInCol = numItems / cols;
          const exceededCurrentCol = (legendStartY + ((i - numItemsInPrevCols) * this.legendDim.heightOfRow)) > (this.viewBoxDim.y + this.legendHeight);
          const plottedEvenBalanceOfItemsBtwnCols = i >= (numElemsInCol * currentCol);
          if (exceededCurrentCol || plottedEvenBalanceOfItemsBtwnCols) {
            colSpacing = (this.legendDim.colSpace + (this.legendDim.ptRadius * 2) + this.legendDim.ptToTextSpace) * currentCol;
            numItemsInPrevCols = i;
            currentCol++;
          }

          const totalItemsSpacingExceedLegendArea = (legendStartY + ((i - numItemsInPrevCols) * this.legendDim.heightOfRow)) > (this.viewBoxDim.y + this.legendHeight);
          if (totalItemsSpacingExceedLegendArea) { break; }
        }

        const li = itemsArray[i];
        if (li.isDraggedPt) {
          li.x = this.legendDim.x + this.legendDim.leftPadding + colSpacing;
          li.y = legendStartY + ((i - numItemsInPrevCols) * this.legendDim.heightOfRow) + this.legendDim.vertPtPadding;
        } else {
          li.cx = this.legendDim.x + this.legendDim.leftPadding + colSpacing + li.r;
          li.cy = legendStartY + ((i - numItemsInPrevCols) * this.legendDim.heightOfRow);
          li.x = li.cx + this.legendDim.ptToTextSpace;
          li.y = li.cy + li.r;
        }
        result.push(i++);
      }
      return result;
    })();
  }

  setupLegendGroupsAndPts() {
    if ((this.legendPts.length > 0) && (this.legendShow === true)) {
      const totalLegendItems = this.legendGroups.length + this.legendPts.length;
      const legendItemArray = [];
      let i = 0;
      let j = 0;

      // KZ TODO possibly the worst array concat ive ever seen
      while (i < totalLegendItems) {
        if (i < this.legendGroups.length) {
          legendItemArray.push(this.legendGroups[i]);
        } else {
          j = i - this.legendGroups.length;
          legendItemArray.push(this.legendPts[j]);
        }
        i++;
      }

      return this.setLegendItemsPositions(totalLegendItems, legendItemArray, this.legendDim.cols);
    } else if ((this.legendPts.length > 0) && (this.legendShow === false)) {
      return this.setLegendItemsPositions(this.legendPts.length, this.legendPts, this.legendDim.cols);
    } else {
      return this.setLegendItemsPositions(this.legendGroups.length, this.legendGroups, this.legendDim.cols);
    }
  }

  resizedAfterLegendGroupsDrawn() {
    const initWidth = this.viewBoxDim.width;

    const totalLegendItems = this.legendShow ? this.legendGroups.length + this.legendPts.length : this.legendPts.length;
    const legendGrpsTextMax = (this.legendGroups.length > 0) && this.legendShow ? (_.maxBy(this.legendGroups, e => e.width)).width : 0;
    const legendPtsTextMax = this.legendPts.length > 0 ? (_.maxBy(this.legendPts, e => e.width)).width : 0;

    const maxTextWidth = _.max([legendGrpsTextMax, legendPtsTextMax]);

    const spacingAroundMaxTextWidth = this.legendDim.leftPadding +
                                (this.legendDim.ptRadius * 2) +
                                this.legendDim.rightPadding +
                                this.legendDim.ptToTextSpace;

    const bubbleLeftRightPadding = this.legendDim.leftPadding + this.legendDim.rightPadding;

    this.legendDim.cols = Math.ceil(((totalLegendItems) * this.legendDim.heightOfRow) / this.legendHeight);
    this.legendDim.width = (maxTextWidth * this.legendDim.cols) + spacingAroundMaxTextWidth + (this.legendDim.centerPadding * (this.legendDim.cols - 1));

    const bubbleTitleWidth = this.legendBubblesTitle != null ? this.legendBubblesTitle[0].width : undefined;
    this.legendDim.width = _.max([this.legendDim.width, bubbleTitleWidth + bubbleLeftRightPadding, this.legendBubblesMaxWidth + bubbleLeftRightPadding]);

    this.legendDim.colSpace = maxTextWidth;

    this.viewBoxDim.width = this.viewBoxDim.svgWidth - this.legendDim.width - this.viewBoxDim.x - this.axisDimensionText.rowMaxWidth;
    this.legendDim.x = this.viewBoxDim.x + this.viewBoxDim.width;

    return initWidth !== this.viewBoxDim.width;
  }

  isOutsideViewBox(lab) {
    const left = lab.x - (lab.width / 2);
    const right = lab.x + (lab.width / 2);
    const top = lab.y - lab.height;
    const bot = lab.y;

    if ((left < this.viewBoxDim.x) ||
        (right > (this.viewBoxDim.x + this.viewBoxDim.width)) ||
        (top < this.viewBoxDim.y) ||
        (bot > (this.viewBoxDim.y + this.viewBoxDim.height))) {
      return true;
    }
    return false;
  }

  isLegendPtOutsideViewBox(lab) {
    const left = lab.x;
    const right = lab.x + lab.width;
    const top = lab.y - lab.height;
    const bot = lab.y;

    if ((left < this.viewBoxDim.x) ||
        (right > (this.viewBoxDim.x + this.viewBoxDim.width)) ||
        (top < this.viewBoxDim.y) ||
        (bot > (this.viewBoxDim.y + this.viewBoxDim.height))) {
      return true;
    }
    return false;
  }

  addElemToLegend(id) {
    const checkId = e => e.id === id;
    const movedPt = _.remove(this.pts, checkId);
    const movedLab = _.remove(this.lab, checkId);
    this.legendPts.push({
      id,
      pt: movedPt[0],
      lab: movedLab[0],
      anchor: 'start',
      text: `${movedLab[0].text} (${movedPt[0].labelX}, ${movedPt[0].labelY})`,
      color: movedPt[0].color,
      isDraggedPt: true,
    });
//    console.log("pushed legendPt : #{JSON.stringify(@legendPts[@legendPts.length-1])}")

    this.outsidePlotPtsId.push(id);
    this.normalizeData();
    this.getPtsAndLabs('PlotData.addElemToLegend');
    this.setupLegendGroupsAndPts();
    return this.legendRequiresRedraw = true;
  }

  removeElemFromLegend(id) {
    const checkId = e => e.id === id;
    const legendPt = _.remove(this.legendPts, checkId);
    this.pts.push(legendPt.pt);
    this.lab.push(legendPt.lab);

    _.remove(this.outsidePlotPtsId, i => i === id);
    _.remove(this.outsidePlotCondensedPts, i => i.dataId === id);

    this.normalizeData();
    this.getPtsAndLabs('PlotData.removeElemFromLegend');
    return this.setupLegendGroupsAndPts();
  }
}

module.exports = PlotData;