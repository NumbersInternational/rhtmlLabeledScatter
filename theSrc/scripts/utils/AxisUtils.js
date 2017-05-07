import _ from 'lodash';
import Utils from './Utils';

/* To Refactor:
 *  * marker leader lines + labels can surely be grouped or at least the lines can be derived at presentation time
 */

class AxisUtils {

  // Calc tick increments - http://stackoverflow.com/questions/326679/choosing-an-attractive-linear-scale-for-a-graphs-y-axis
  static _getTickRange(max, min) {
    const maxTicks = 8;
    const range = max - min;
    const unroundedTickSize = range / (maxTicks - 1);

    const pow10x = 10 ** (Math.ceil((Math.log(unroundedTickSize) / Math.LN10) - 1));
    const roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
    return roundedTickRange;
  }

  static _between(num, min, max) {
    return (num >= min) && (num <= max);
  }

  static _normalizeXCoords(data, Xcoord) {
    const { viewBoxDim } = data;
    return (((Xcoord - data.minX) / (data.maxX - data.minX)) * viewBoxDim.width) + viewBoxDim.x;
  }

  static _normalizeYCoords(data, Ycoord) {
    const { viewBoxDim } = data;
    return ((-(Ycoord - data.minY) / (data.maxY - data.minY)) * viewBoxDim.height) + viewBoxDim.y + viewBoxDim.height;
  }

  // TODO KZ calculation of x axis and y axis are independent ? If so, then split into a reusable function
  static getAxisDataArrays(plot, data, viewBoxDim) {
    // exit if all points have been dragged off plot
    if (!(data.len > 0)) {
      return {};
    }

    const dimensionMarkerStack = [];
    const dimensionMarkerLeaderStack = [];
    const dimensionMarkerLabelStack = [];

    const pushDimensionMarker = function (type, x1, y1, x2, y2, label) {
      const leaderLineLen = plot.axisLeaderLineLength;
      const labelHeight = _.max([plot.axisDimensionText.rowMaxHeight, plot.axisDimensionText.colMaxHeight]);
      const { xDecimals, yDecimals, xPrefix, yPrefix, xSuffix, ySuffix } = plot;

      if (type === 'col') {
        dimensionMarkerLeaderStack.push({
          x1,
          y1: y2,
          x2: x1,
          y2: y2 + leaderLineLen,
        });
        dimensionMarkerLabelStack.push({
          x: x1,
          y: y2 + leaderLineLen + labelHeight,
          label: Utils.getFormattedNum(label, xDecimals, xPrefix, xSuffix),
          anchor: 'middle',
          type,
        });
      }

      if (type === 'row') {
        dimensionMarkerLeaderStack.push({
          x1: x1 - leaderLineLen,
          y1,
          x2: x1,
          y2,
        });
        dimensionMarkerLabelStack.push({
          x: x1 - leaderLineLen,
          y: y2 + (labelHeight / 3),
          label: Utils.getFormattedNum(label, yDecimals, yPrefix, ySuffix),
          anchor: 'end',
          type,
        });
      }
    };

    // TODO KZ (another) Unecessary call to calculateMinMax ??
    data.calculateMinMax();

    let ticksX = null;
    let ticksY = null;

    if (Utils.isNum(plot.xBoundsUnitsMajor)) {
      ticksX = plot.xBoundsUnitsMajor / 2;
    } else {
      ticksX = this._getTickRange(data.maxX, data.minX);
    }

    if (Utils.isNum(plot.yBoundsUnitsMajor)) {
      ticksY = plot.yBoundsUnitsMajor / 2;
    } else {
      ticksY = this._getTickRange(data.maxY, data.minY);
    }

    // Compute origins if they are within bounds

    const originAxis = [];
    const yCoordOfXAxisOrigin = this._normalizeYCoords(data, 0);
    if ((yCoordOfXAxisOrigin <= (viewBoxDim.y + viewBoxDim.height)) && (yCoordOfXAxisOrigin >= viewBoxDim.y)) {
      const xAxisOrigin = {
        x1: viewBoxDim.x,
        y1: yCoordOfXAxisOrigin,
        x2: viewBoxDim.x + viewBoxDim.width,
        y2: yCoordOfXAxisOrigin,
      };
      pushDimensionMarker('row', xAxisOrigin.x1, xAxisOrigin.y1, xAxisOrigin.x2, xAxisOrigin.y2, 0);
      if ((data.minY !== 0) && (data.maxY !== 0)) {
        originAxis.push(xAxisOrigin);
      }
    }

    const xCoordOfYAxisOrigin = this._normalizeXCoords(data, 0);
    if ((xCoordOfYAxisOrigin >= viewBoxDim.x) && (xCoordOfYAxisOrigin <= (viewBoxDim.x + viewBoxDim.width))) {
      const yAxisOrigin = {
        x1: xCoordOfYAxisOrigin,
        y1: viewBoxDim.y,
        x2: xCoordOfYAxisOrigin,
        y2: viewBoxDim.y + viewBoxDim.height,
      };
      pushDimensionMarker('col', yAxisOrigin.x1, yAxisOrigin.y1, yAxisOrigin.x2, yAxisOrigin.y2, 0);
      if ((data.minX !== 0) && (data.maxX !== 0)) {
        originAxis.push(yAxisOrigin);
      }
    }

    // calculate number of dimension markers

    let colsPositive = 0;
    let colsNegative = 0;
    if (this._between(0, data.minX, data.maxX)) {
      colsPositive = (data.maxX / ticksX) - 1;
      colsNegative = Math.abs(data.minX / ticksX) - 1;
    } else {
      const numColumns = (data.maxX - data.minX) / ticksX;
      if (data.minX < 0) {
        colsNegative = numColumns;
        colsPositive = 0;
      } else {
        colsNegative = 0;
        colsPositive = numColumns;
      }
    }

    let rowsPositive = 0;
    let rowsNegative = 0;
    if (this._between(0, data.minY, data.maxY)) {
      rowsPositive = Math.abs(data.minY / ticksY) - 1;
      rowsNegative = (data.maxY / ticksY) - 1;
    } else {
      const numRows = (data.maxY - data.minY) / ticksY;
      if (data.minY < 0) {
        rowsNegative = 0;
        rowsPositive = numRows;
      } else {
        rowsNegative = numRows;
        rowsPositive = 0;
      }
    }

    let i = 0;
    while (i < Math.max(colsPositive, colsNegative)) {
      let val, x1, x2, y1, y2 = null;

      if (i < colsPositive) {
        val = (i + 1) * ticksX;
        if (!this._between(0, data.minX, data.maxX)) {
          val = data.minX + (i * ticksX);
        }
        x1 = this._normalizeXCoords(data, val);
        y1 = viewBoxDim.y;
        x2 = this._normalizeXCoords(data, val);
        y2 = viewBoxDim.y + viewBoxDim.height;

        dimensionMarkerStack.push({ x1, y1, x2, y2 });
        if (i % 2) {
          pushDimensionMarker('col', x1, y1, x2, y2, val.toPrecision(14));
        }
      }

      if (i < colsNegative) {
        val = -(i + 1) * ticksX;
        x1 = this._normalizeXCoords(data, val);
        y1 = viewBoxDim.y;
        x2 = this._normalizeXCoords(data, val);
        y2 = viewBoxDim.y + viewBoxDim.height;
        dimensionMarkerStack.push({ x1, y1, x2, y2 });
        if (i % 2) {
          pushDimensionMarker('col', x1, y1, x2, y2, val.toPrecision(14));
        }
      }
      i++;
    }

    i = 0;
    while (i < Math.max(rowsPositive, rowsNegative)) {
      let val, x1, x2, y1, y2 = null;

      if (i < rowsPositive) {
        val = -(i + 1) * ticksY;
        x1 = viewBoxDim.x;
        y1 = this._normalizeYCoords(data, val);
        x2 = viewBoxDim.x + viewBoxDim.width;
        y2 = this._normalizeYCoords(data, val);
        dimensionMarkerStack.push({ x1, y1, x2, y2 });
        if (i % 2) {
          pushDimensionMarker('row', x1, y1, x2, y2, val.toPrecision(14));
        }
      }

      if (i < rowsNegative) {
        val = (i + 1) * ticksY;
        if (!this._between(0, data.minY, data.maxY)) {
          val = data.minY + (i * ticksY);
        }
        x1 = viewBoxDim.x;
        y1 = this._normalizeYCoords(data, val);
        x2 = viewBoxDim.x + viewBoxDim.width;
        y2 = this._normalizeYCoords(data, val);
        dimensionMarkerStack.push({ x1, y1, x2, y2 });
        if (i % 2) {
          pushDimensionMarker('row', x1, y1, x2, y2, val.toPrecision(14));
        }
      }
      i++;
    }

    return {
      gridOrigin: originAxis,
      gridLines: dimensionMarkerStack,
      axisLeader: dimensionMarkerLeaderStack,
      axisLeaderLabel: dimensionMarkerLabelStack,
    };
  }
}

module.exports = AxisUtils;