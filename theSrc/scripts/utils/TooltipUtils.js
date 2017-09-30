import _ from 'lodash'
import d3 from 'd3'
import $ from 'jquery'
const Utils = require('./Utils.js')

class TooltipUtils {
  static appendTooltips (anchors,
                         Z,
                         xDecimals,
                         yDecimals,
                         zDecimals,
                         xPrefix,
                         yPrefix,
                         zPrefix,
                         xSuffix,
                         ySuffix,
                         zSuffix) {
    let labelTxt,
      xlabel,
      ylabel,
      groupLabel
    if (Utils.isArrOfNums(Z)) {
      anchors.append('title')
      .text((d) => {
        xlabel = Utils.getFormattedNum(d.labelX, xDecimals, xPrefix, xSuffix)
        ylabel = Utils.getFormattedNum(d.labelY, yDecimals, yPrefix, ySuffix)
        const zlabel = Utils.getFormattedNum(d.labelZ, zDecimals, zPrefix, zSuffix)
        labelTxt = d.label === '' ? d.labelAlt : d.label
        groupLabel = _.isUndefined(d.group) ? '' : `,  ${d.group}`
        return `${labelTxt}${groupLabel}\n${zlabel}\n(${xlabel}, ${ylabel})`
      })
    } else {
      anchors.append('title')
      .text((d) => {
        xlabel = Utils.getFormattedNum(d.labelX, xDecimals, xPrefix, xSuffix)
        ylabel = Utils.getFormattedNum(d.labelY, yDecimals, yPrefix, ySuffix)
        labelTxt = d.label === '' ? d.labelAlt : d.label
        groupLabel = _.isUndefined(d.group) ? '' : `,  ${d.group}`
        return `${labelTxt}${groupLabel}\n(${xlabel}, ${ylabel})`
      })
    }
  }

  static addSimpleTooltip (object, tooltipText) {
    d3.selectAll($(object)).append('title').text(tooltipText)
  }
}

module.exports = TooltipUtils
