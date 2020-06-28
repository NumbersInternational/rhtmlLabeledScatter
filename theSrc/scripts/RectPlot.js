
import _ from 'lodash'
import d3 from 'd3'
import 'babel-polyfill'
import md5 from 'md5'
import autoBind from 'es6-autobind'
import AxisTitle from './AxisTitle'
import AxisTypeEnum from './utils/AxisTypeEnum'
import DataTypeEnum from './utils/DataTypeEnum'
import DebugMessage from './DebugMessage'
import DragUtils from './utils/DragUtils'
import Footer from './Footer'
import LabelPlacement from './LabelPlacement'
import Legend from './Legend'
import LegendSettings from './LegendSettings'
import Links from './Links'
import PlotAxis from './PlotAxis'
import PlotAxisLabels from './PlotAxisLabels'
import PlotLabel from './PlotLabel'
import PlotData from './PlotData'
import ResetButton from './ResetButton'
import Subtitle from './Subtitle'
import SvgUtils from './utils/SvgUtils'
import Title from './Title'
import TooltipUtils from './utils/TooltipUtils'
import TrendLine from './TrendLine'
import Utils from './utils/Utils'
import ViewBox from './ViewBox'

const DEBUG_ADD_BBOX_TO_LABELS = false
const SUPPRESS_ERRORS = false

class RectPlot {
  constructor ({ config, stateObj, svg } = {}) {
    console.log('RectPlot constructor')
    autoBind(this)
    this.pltUniqueId = md5((new Date()).getTime())
    this.state = stateObj
    this.width = config.width
    this.height = config.height

    const { X, xLevels, xIsDateTime } = config
    if (xIsDateTime) {
      this.X = _.map(X, (d) => new Date(d))
      this.xLevels = null
      this.xDataType = DataTypeEnum.date
    } else if (Utils.isArrOfNumTypes(X)) {
      this.X = X
      this.xLevels = null
      this.xDataType = DataTypeEnum.numeric
    } else {
      this.X = X
      this.xLevels = _.isNull(xLevels) ? _.uniq(X) : xLevels
      this.xDataType = DataTypeEnum.ordinal
    }

    const { Y, yLevels, yIsDateTime } = config
    if (yIsDateTime) {
      this.Y = _.map(Y, (d) => new Date(d))
      this.yLevels = null
      this.yDataType = DataTypeEnum.date
    } else if (Utils.isArrOfNumTypes(Y)) {
      this.Y = Y
      this.yLevels = null
      this.yDataType = DataTypeEnum.numeric
    } else {
      this.Y = Y
      this.yLevels = _.isNull(yLevels) ? _(Y).uniq().reverse().value() : yLevels
      this.yDataType = DataTypeEnum.ordinal
    }

    this.Z = config.Z
    this.group = config.group
    this.label = config.label
    this.labelAlt = config.labelAlt
    this.svg = svg
    this.zTitle = config.zTitle
    this.colors = config.colors
    this.transparency = config.transparency
    this.originAlign = config.originAlign
    this.showLabels = config.showLabels
    this.pointRadius = config.pointRadius

    this.plotBorder = {
      show: config.plotBorderShow,
      color: config.plotBorderColor,
      width: `${parseInt(config.plotBorderWidth)}px`
    }
    this.maxDrawFailureCount = 200 // TODO configure

    this.axisSettings = {
      fontFamily: config.axisFontFamily,
      fontSize: config.axisFontSize,
      fontColor: config.axisFontColor,
      showX: config.showXAxis,
      showY: config.showYAxis,
      textDimensions: {
        rowMaxWidth: 0,
        rowMaxHeight: 0,
        colMaxWidth: 0,
        colMaxHeight: 0,
        rightPadding: 0 // Set later, for when axis markers labels protrude (VIS-146)
      },
      leaderLineLength: 5,
      x: {
        format: config.xFormat,
        boundsUnitsMajor: config.xBoundsUnitsMajor,
        prefix: config.xPrefix,
        suffix: config.xSuffix,
        decimals: config.xDecimals
      },
      y: {
        format: config.yFormat,
        boundsUnitsMajor: config.yBoundsUnitsMajor,
        prefix: config.yPrefix,
        suffix: config.ySuffix,
        decimals: config.yDecimals
      },
      z: {
        prefix: config.zPrefix,
        suffix: config.zSuffix,
        decimals: config.zDecimals
      },
      strokeWidth: 1 // VIS-380: this currently matches plotly for chrome rendering bug
    }

    this.labelsFont = {
      size: config.labelsFontSize,
      color: config.labelsFontColor,
      family: config.labelsFontFamily,
      logoScale: config.labelsLogoScale
    }

    this.leaderLineConfig = {
      minimumDistance: config.leaderLineDistanceMinimum,
      nearbyAnchorDistanceThreshold: config.leaderLineDistanceNearbyAnchors
    }

    this.xTitle = new AxisTitle(config.xTitle, config.xTitleFontColor, config.xTitleFontSize, config.xTitleFontFamily, 5, 1)
    this.yTitle = new AxisTitle(config.yTitle, config.yTitleFontColor, config.yTitleFontSize, config.yTitleFontFamily, 0, 2)

    // TODO convert to object signature
    this.legendSettings = new LegendSettings(
      config.legendShow,
      config.legendBubblesShow,
      config.legendFontFamily,
      config.legendFontSize,
      config.legendFontColor,
      config.legendBubbleFontFamily,
      config.legendBubbleFontSize,
      config.legendBubbleFontColor,
      config.legendBubbleTitleFontFamily,
      config.legendBubbleTitleFontSize,
      config.legendBubbleTitleFontColor,
      this.zTitle
    )

    this.trendLines = {
      show: config.trendLines,
      lineThickness: config.trendLinesLineThickness,
      pointSize: config.trendLinesPointSize
    }

    // TODO configure
    this.padding = {
      vertical: 5,
      horizontal: 10
    }

    this.bounds = {
      xmin: config.xBoundsMinimum,
      xmax: config.xBoundsMaximum,
      ymin: config.yBoundsMinimum,
      ymax: config.yBoundsMaximum
    }

    this.title = new Title(config.title, config.titleFontColor, config.titleFontSize, config.titleFontFamily, this.axisSettings.fontSize, this.padding.vertical)
    this.subtitle = new Subtitle(config.subtitle, config.subtitleFontColor, config.subtitleFontSize, config.subtitleFontFamily, this.title.text)
    this.subtitle.setY(this.title.getSubtitleY())
    this.footer = new Footer(config.footer, config.footerFontColor, config.footerFontSize, config.footerFontFamily, this.height)

    this.grid = config.grid
    this.origin = config.origin
    this.fixedRatio = config.fixedAspectRatio // TODO rename for consistency

    if (_.isNull(this.label)) {
      this.label = _.map(config.X, () => { return '' })
      this.showLabels = false
    }

    const numNonEmptyLabels = (_.filter(this.label, (l) => l !== '')).length
    const labelPlacementAlgoOnToggle = numNonEmptyLabels < 100

    this.tooltipText = config.tooltipText

    this.debugMode = config.debugMode
    this.showResetButton = config.showResetButton

    this.labelPlacement = new LabelPlacement({
      svg: this.svg,
      pltId: this.pltUniqueId,
      isBubble: Utils.isArrOfNums(this.Z),
      isLabelPlacementAlgoOn: labelPlacementAlgoOnToggle,
      weights: {
        distance: {
          base: config.labelPlacementWeightDistance,
          multipliers: {
            centeredAboveAnchor: config.labelPlacementWeightDistanceMultiplierCenteredAboveAnchor,
            centeredUnderneathAnchor: config.labelPlacementWeightDistanceMultiplierCenteredUnderneathAnchor,
            besideAnchor: config.labelPlacementWeightDistanceMultiplierBesideAnchor,
            diagonalOfAnchor: config.labelPlacementWeightDistanceMultiplierDiagonalOfAnchor
          }
        },
        labelLabelOverlap: config.labelPlacementWeightLabelLabelOverlap,
        labelPlacementWeightLabelLabelOverlap: config.labelPlacementWeightLabelAnchorOverlap
      },
      numSweeps: config.labelPlacementNumSweeps,
      maxMove: config.labelPlacementMaxMove,
      maxAngle: config.labelPlacementMaxAngle,
      seed: config.labelPlacementSeed,
      initialTemperature: config.labelPlacementTemperatureInitial,
      finalTemperature: config.labelPlacementTemperatureFinal
    })
  }

  // this is an async call, put all async things here
  doAsyncThings () {
    console.log('RectPlot doasyncThings')
    this.setDim(this.svg, this.width, this.height)
    return this.determineLabelDimensions()
      .then(labelDimensions => {
        // resolvedLabels is array of { height, width, label, url }
        this.labelDimensions = labelDimensions
        this.initialisePlotData()
      })
  }

  determineLabelDimensions () {

    const plotLabel = new PlotLabel(this.label, this.labelAlt, this.vb.labelLogoScale, this.svg, this.labelsFont.size, this.labelsFont.family)
    return plotLabel.getLabels()
  }

  setDim (svg, width, height) {
    console.log('RectPlot setDim')
    this.svg = svg
    this.width = width
    this.height = height
    const initTitleX = this.width / 2
    this.title.setX(initTitleX)
    this.subtitle.setX(initTitleX)
    this.footer.setX(initTitleX)
    this.legend = new Legend(this.legendSettings, this.axisSettings)

    this.vb = new ViewBox(width, height, this.padding, this.legend, this.title, this.subtitle, this.footer,
      this.labelsFont, this.axisSettings.leaderLineLength, this.axisSettings.textDimensions, this.xTitle, this.yTitle)

    this.legend.setX(this.vb.getLegendX())
    this.title.setX(this.vb.getTitleX())
    this.subtitle.setX(this.vb.getTitleX())
    this.footer.setX(this.vb.getTitleX())
  }

  initialisePlotData () {
    console.log('RectPlot initialisePlotData')
    this.data = new PlotData({
      bounds: this.bounds,
      colors: this.colors,
      fixedRatio: this.fixedRatio,
      group: this.group,
      labelAlt: this.labelAlt,
      labelDimensions: this.labelDimensions,
      labelsFontFamily: this.labelsFont.family,
      labelsFontSize: this.labelsFont.size,
      legend: this.legend,
      legendSettings: this.legendSettings,
      originAlign: this.originAlign,
      pointRadius: this.pointRadius,
      state: this.state,
      svg: this.svg,
      transparency: this.transparency,
      vb: this.vb,
      X: this.X,
      xDataType: this.xDataType,
      xLevels: this.xLevels,
      Y: this.Y,
      yDataType: this.yDataType,
      yLevels: this.yLevels,
      Z: this.Z
    })

    this.drawFailureCount = 0
  }

  draw () {
    // Tell visual tests widget as not ready
    this.svg.attr('class', (this.svg.attr('class')).replace('rhtmlLabeledScatter-isReadySelector', ''))

    this.drawDimensionMarkers()
      .then(this.drawLegend.bind(this))
      .then(this.drawLabsAndPlot.bind(this))
      .then(() => {
        // TODO Po if you remove this then the life expectancy bubble plot will not have the legendLabels in the legend. It will only have the groups
        if (this.data.legendRequiresRedraw) {
          return this.drawLegend()
        }
      })
      .then(() => {
        const debugMsg = new DebugMessage(this.svg, this.vb, this.debugMode)
        debugMsg.draw(this.data.lab)
        console.log(`draw succeeded after ${this.drawFailureCount} failures`)
        this.drawFailureCount = 0
      })
      .catch((err) => {
        this.drawFailureCount++
        if (this.drawFailureCount >= this.maxDrawFailureCount) {
          console.log(`draw failure ${err.message} (fail count: ${this.drawFailureCount}). Exceeded max draw failures of ${this.maxDrawFailureCount}. Terminating`)
          throw err
        }

        if (err && err.retry) {
          console.log(`draw failure ${err.message} (fail count: ${this.drawFailureCount}). Redrawing`)
          return this.draw()
        }

        throw err
      }).finally(() => {
        // Tell visual tests that widget is done rendering
        if (!this.svg.attr('class').includes('rhtmlLabeledScatter-isReadySelector')) {
          this.svg.attr('class', this.svg.attr('class') + ' rhtmlLabeledScatter-isReadySelector')
        }
      })
  }

  isEqual (otherPlot) {
    // Test if RectPlot is equal to another, does not include all parameters for comparison (only those set in Displayr added now)
    // TODO: Add rest of the data components
    const eqX = _.isEqual(this.X, otherPlot.X)
    const eqY = _.isEqual(this.Y, otherPlot.Y)
    const eqZ = _.isEqual(this.Z, otherPlot.Z)
    const eqGroup = _.isEqual(this.group, otherPlot.group)
    const eqLabel = _.isEqual(this.label, otherPlot.label)
    const eqLabelAlt = _.isEqual(this.labelAlt, otherPlot.labelAlt)
    const eqTitle = _.isEqual(this.title.text, otherPlot.title)
    const eqXTitle = _.isEqual(this.xTitle.getText(), otherPlot.xTitle)
    const eqYTitle = _.isEqual(this.yTitle.getText(), otherPlot.yTitle)
    const eqZTitle = _.isEqual(this.zTitle, otherPlot.zTitle)
    const listOfComparisons = [eqX, eqY, eqZ, eqGroup, eqLabel, eqLabelAlt, eqTitle, eqXTitle, eqYTitle, eqZTitle]
    return _.every(listOfComparisons, e => _.isEqual(e, true))
  }

  drawLabsAndPlot () {
    this.data.normalizeData()
    this.data.buildPoints('RectPlot.drawLabsAndPlot')

    const titlesX = this.vb.x + (this.vb.width / 2)
    this.title.setX(titlesX)
    this.subtitle.setX(titlesX)
    this.footer.setX(titlesX)

    if (!this.state.isLegendPtsSynced(this.data.outsidePlotPtsId)) {
      _.map(this.state.getLegendPts(), pt => {
        if (!_.includes(this.data.outsidePlotPtsId, pt)) {
          this.data.addElemToLegend(pt)
        }
      })

      _.map(this.data.outsidePlotPtsId, pt => {
        if (!_.includes(this.state.getLegendPts(), pt)) {
          this.state.pushLegendPt(pt)
        }
      })
      const error = new Error('drawLabsAndPlot failed : state.isLegendPtsSynced = false')
      error.retry = true
      throw error
    }

    try {
      this.title.drawWith(this.pltUniqueId, this.svg)
      this.subtitle.drawWith(this.pltUniqueId, this.svg)
      this.footer.drawWith(this.pltUniqueId, this.svg)
      this.drawResetButton()
      
      this.drawPlotArea()

      if (this.plotBorder.show) { this.vb.drawBorderWith(this.svg, this.plotBorder) }
      this.axisLabels = new PlotAxisLabels(this.vb, this.axisSettings.leaderLineLength, this.axisSettings.textDimensions, this.xTitle, this.yTitle, this.padding)
      this.axisLabels.drawWith(this.pltUniqueId, this.svg)
    } catch (error) {
      if (SUPPRESS_ERRORS) {
        console.log(error)
      } else {
        throw error
      }
    }
  }

  drawResetButton () {
    if (this.showResetButton) {
      this.resetButton = new ResetButton(this)
      this.resetButton.drawWith(this.svg, this.width, this.height, this.title, this.state)
    }
  }

  drawDimensionMarkers () {
    return new Promise((function (resolve, reject) {
      this.axis = new PlotAxis(this.axisSettings, this.data, this.vb)

      if (this.grid) {
        this.axis.drawGridOriginWith(this.svg, this.origin)
        this.axis.drawGridLinesWith(this.svg)
      } else if (!this.grid && this.origin) {
        this.axis.drawGridOriginWith(this.svg, this.origin)
      }

      if (this.axisSettings.showX || this.axisSettings.showY) {
        this.axis.drawAxisLeaderWith(this.svg, this.origin, this.grid)
        const markerLabels = this.svg.selectAll('.dim-marker-label')

        // Figure out the max width of the yaxis dimensional labels
        const initAxisTextRowWidth = this.axisSettings.textDimensions.rowMaxWidth
        const initAxisTextColWidth = this.axisSettings.textDimensions.colMaxWidth
        const initAxisTextRowHeight = this.axisSettings.textDimensions.rowMaxHeight
        const initAxisTextColHeight = this.axisSettings.textDimensions.colMaxHeight
        for (let i = 0; i < markerLabels[0].length; i++) {
          const markerLabel = markerLabels[0][i]
          const labelType = Number(d3.select(markerLabel).attr('type'))
          const bb = markerLabel.getBBox()
          if ((this.axisSettings.textDimensions.rowMaxWidth < bb.width) && (labelType === AxisTypeEnum.Y)) { this.axisSettings.textDimensions.rowMaxWidth = bb.width }
          if ((this.axisSettings.textDimensions.colMaxWidth < bb.width) && (labelType === AxisTypeEnum.X)) { this.axisSettings.textDimensions.colMaxWidth = bb.width }
          if ((this.axisSettings.textDimensions.rowMaxHeight < bb.height) && (labelType === AxisTypeEnum.Y)) { this.axisSettings.textDimensions.rowMaxHeight = bb.height }
          if ((this.axisSettings.textDimensions.colMaxHeight < bb.height) && (labelType === AxisTypeEnum.X)) { this.axisSettings.textDimensions.colMaxHeight = bb.height }

          if (this.width < (bb.x + bb.width)) {
            this.axisSettings.textDimensions.rightPadding = bb.width / 2
          }
        }

        if ((initAxisTextRowWidth !== this.axisSettings.textDimensions.rowMaxWidth) ||
          (initAxisTextColWidth !== this.axisSettings.textDimensions.colMaxWidth) ||
          (initAxisTextRowHeight !== this.axisSettings.textDimensions.rowMaxHeight) ||
          (initAxisTextColHeight !== this.axisSettings.textDimensions.colMaxHeight)) {
          this.setDim(this.svg, this.width, this.height)
          this.initialisePlotData()
          this.data.revertMinMax()
          const error = new Error('axis marker out of bound')
          error.retry = true
          return reject(error)
        }
      }

      return resolve()
    }.bind(this)))
  }

  drawLegend () {
    return new Promise(function (resolve, reject) {
      this.data.setLegend()
      if (this.legendSettings.showBubblesInLegend() && Utils.isArrOfNums(this.Z)) {
        this.legend.drawBubblesWith(this.svg, this.axisSettings)
        this.legend.drawBubblesLabelsWith(this.svg)
        this.legend.drawBubblesTitleWith(this.svg)
      }

      const drag = DragUtils.getLegendLabelDragAndDrop(this, this.data)
      this.legend.drawDraggedPtsTextWith(this.svg, drag)

      if (this.legendSettings.showLegend()) {
        this.legend.drawGroupsTextWith(this.svg)
        this.legend.drawGroupsPts(this.svg)
      }

      if (this.legendSettings.isDisplayed(this.Z, this.data.legendPts)) {
        if (this.legend.resizedAfterLegendGroupsDrawn(this.data.vb, this.axisSettings.textDimensions)) {
          this.data.revertMinMax()
          const error = new Error('drawLegend Failed')
          error.retry = true
          return reject(error)
        }
      }
      return resolve()
    }.bind(this))
  }

  resetPlotAfterDragEvent () {
    const plotElems = [
      '.plot-viewbox',
      '.origin',
      '.dim-marker',
      '.dim-marker-leader',
      '.dim-marker-label',
      '.axis-label',
      '.legend-pts',
      '.legend-text',
      '.anc',
      '.link'
    ]
    _.forEach(plotElems, (elem, i) => {
      this.svg.selectAll(elem).remove()
    })
    return this.draw()
  }

  drawPlotArea () {
    this.drawAnchors()
    // TODO ENABLE
    if (this.trendLines.show) {
      this.drawTrendLines()
    } else {
      this.drawLabels()
      this.drawLinks()
    }
    this.drawDraggedMarkers()
  }

  drawAnchors () {
    const anchors = this.data.getAnchors()
    this.svg.selectAll('.anc').remove()
    this.svg.selectAll('.anc')
      .data(anchors)
      .enter()
      .append('circle')
      .attr('class', 'anc')
      .attr('id', d => `anc-${d.id}`)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => d.color)
      .attr('fill-opacity', d => d.fillOpacity)
      .attr('r', d => d.r)

    // TODO ENABLE
    // TooltipUtils.appendTooltips(anchors, this.Z, this.axisSettings, this.tooltipText)

    // Clip paths used to crop bubbles if they expand beyond the plot's borders
    if (this.plotBorder.show) {
      this.svg.selectAll('clipPath').remove()
      SvgUtils.clipBubbleIfOutsidePlotArea(this.svg, anchors, this.vb, this.pltUniqueId)
    }
  }

  drawLabels () {
    if (this.showLabels) {
      let drag = DragUtils.getLabelDragAndDrop(this)

      this.labelPlacement.placeLabels({
        vb: this.vb,
        plotArea: this.data.getPlotArea()
      })

      this.svg.selectAll(`.plt-${this.pltUniqueId}-lab-img`).remove()
      this.svg.selectAll(`.plt-${this.pltUniqueId}-lab-img`)
        .data(this.data.getImgLabels())
        .enter()
        .append('svg:image')
        .attr('class', `plt-${this.pltUniqueId}-lab-img`)
        .attr('xlink:href', d => d.url)
        .attr('id', d => d.id)
        .attr('x', d => d.x - (d.width / 2))
        .attr('y', d => d.y - d.height)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .call(drag)

      this.svg.selectAll(`.plt-${this.pltUniqueId}-lab`).remove()
      this.svg.selectAll(`.plt-${this.pltUniqueId}-lab`)
        .data(this.data.getTextLabels())
        .enter()
        .append('text')
        .attr('class', `plt-${this.pltUniqueId}-lab`)
        .attr('id', d => d.id)
        .attr('x', d => d.x - (d.width / 2))
        .attr('y', d => d.y - d.height)
        .attr('font-family', d => d.fontFamily)
        .attr('dominant-baseline', 'text-before-edge')
        .attr('fill', d => d.color)
        .attr('font-size', d => d.fontSize)
        .style('cursor', 'pointer')
        .text(d => d.text)
        .call(drag)

      if (DEBUG_ADD_BBOX_TO_LABELS) {
        this.svg.selectAll(`.plt-${this.pltUniqueId}-lab-debug-bbox`)
          .data(this.data.getTextLabels())
          .enter()
          .append('rect')
          .attr('class', `plt-${this.pltUniqueId}-lab-debug-bbox`)
          .attr('x', d => d.x - (d.width / 2))
          .attr('y', d => d.y - d.height)
          .attr('width', d => d.width)
          .attr('height', d => d.height)
          .attr('fill', 'none')
          .attr('stroke', 'black')
        // .each(d => console.log('debug box', JSON.stringify({ id: d.id, x: d.x.toFixed(1), y: d.y.toFixed(1), height: d.height.toFixed(1), width: d.width.toFixed(1) })))

        this.svg.selectAll(`.plt-${this.pltUniqueId}-lab-img-debug-bbox`)
          .data(this.data.getImgLabels())
          .enter()
          .append('rect')
          .attr('class', `plt-${this.pltUniqueId}-lab-img-debug-bbox`)
          .attr('x', d => d.x - (d.width / 2))
          .attr('y', d => d.y - d.height)
          .attr('width', d => d.width)
          .attr('height', d => d.height)
          .attr('fill', 'none')
          .attr('stroke', 'black')
      }

      this.drawLinks()

    } else {
      return Promise.reject('Labels turned off')
    }
  }

  drawTrendLines () {
    return

    this.tl = new TrendLine(this.data.getAnchors(), this.data.getLabelsOnPlot())
    if (this.showLabels) {

      drag = DragUtils.getLabelDragAndDrop(this, this.trendLines.show)

      const nestUnderField = (array, type) => array.map(item => ({ id: item.id, [type]: item }))
      const pinnedLabelIds = this.state.getPositionedLabIds(this.vb)
      const pinnedById = _.transform(pinnedLabelIds, (result, id) => { result[id] = { pinned: true } }, {})

      const mergedStructure = _.merge(
        _.keyBy(nestUnderField(this.tl.arrowheadLabels, 'label'), 'id'),
        _.keyBy(nestUnderField(this.tl.pts, 'anchor'), 'id'),
        pinnedById
      )
      const trendLinePoints = Object.values(mergedStructure)

      this.labelPlacement.placeTrendLabels({
        vb: this.vb,
        points: trendLinePoints
      })

      this.tl.drawLabelsWith(this.pltUniqueId, this.svg, drag)
    } else {
      this.tl.drawWith(this.svg, this.data.plotColors, this.trendLines)
    }
  }

  drawDraggedMarkers () {
    return
    this.svg.selectAll('.marker').remove()
    this.svg.selectAll('.marker')
      .data(this.data.outsidePlotMarkers)
      .enter()
      .append('line')
      .attr('class', 'marker')
      .attr('x1', d => d.x1)
      .attr('y1', d => d.y1)
      .attr('x2', d => d.x2)
      .attr('y2', d => d.y2)
      .attr('stroke-width', d => d.width)
      .attr('stroke', d => d.color)

    this.svg.selectAll('.marker-label').remove()
    this.svg.selectAll('.marker-label')
      .data(this.data.outsidePlotMarkers)
      .enter()
      .append('text')
      .attr('class', 'marker-label')
      .attr('x', d => d.markerTextX)
      .attr('y', d => d.markerTextY)
      .attr('font-family', 'Arial')
      .attr('text-anchor', 'start')
      .attr('font-size', this.legend.getMarkerTextSize())
      .attr('fill', d => d.color)
      .text(d => d.markerLabel)
  }
  
  drawLinks () {
    const links = new Links({
      plotArea: this.data.getPlotArea(),
      minimumDistance: this.leaderLineConfig.minimumDistance,
      nearbyAnchorDistanceThreshold: this.leaderLineConfig.nearbyAnchorDistanceThreshold
    })
    links.drawWith(this.svg, this.data.plotColors, this.transparency)
  }

  resized (svg, width, height) {
    this.svg = svg
    this.width = width
    this.height = height
    this.footer.updateContainerHeight(this.height)
    this.setDim(this.svg, this.width, this.height)
    this.initialisePlotData()
    this.labelPlacement.updateSvgOnResize(this.svg)
    this.state.resetStateOnResize(this.vb)
    this.draw()
  }
}

module.exports = RectPlot
