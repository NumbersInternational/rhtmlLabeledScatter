'use strict'

class LabeledScatter

  @plot = null
  @data = null

  constructor: (@width, @height, @stateChangedCallback) ->

  resize: (el, width, height) ->
    console.log 'rhtmlLabeledScatter: resize'
    @width = width
    @height = height
    d3.select('.plot-container').remove()
    svg = d3.select(el)
            .append('svg')
            .attr('width', @width)
            .attr('height', @height)
            .attr('class', 'plot-container')
    @plot.setDim(svg, @width, @height)
    @plot.draw()
    return

  draw: (data, el, state) ->
    svg = d3.select(el)
            .append('svg')
            .attr('width', @width)
            .attr('height', @height)
            .attr('class', 'plot-container')

    if data.X? and data.Y?
      @data = data
    else # For debuggning in browser
      # @data = bubble1
      @data = testData6

    @plot = new RectPlot(state,
                        @stateChangedCallback,
                        @width,
                        @height,
                        @data.X,
                        @data.Y,
                        @data.Z,
                        @data.group,
                        @data.label,
                        svg,
                        @data.fixedAspectRatio,
                        @data.xTitle,
                        @data.yTitle,
                        @data.zTitle,
                        @data.title,
                        @data.colors,
                        @data.transparency,
                        @data.grid,
                        @data.origin,
                        @data.originAlign,
                        @data.titleFontFamily,
                        @data.titleFontSize,
                        @data.titleFontColor,
                        @data.xTitleFontFamily,
                        @data.xTitleFontSize,
                        @data.xTitleFontColor,
                        @data.yTitleFontFamily,
                        @data.yTitleFontSize,
                        @data.yTitleFontColor,
                        @data.showLabels,
                        @data.labelsFontFamily,
                        @data.labelsFontSize,
                        @data.labelsFontColor,
                        @data.xDecimals,
                        @data.yDecimals,
                        @data.zDecimals,
                        @data.xPrefix,
                        @data.yPrefix,
                        @data.zPrefix,
                        @data.xSuffix,
                        @data.ySuffix,
                        @data.zSuffix,
                        @data.legendShow,
                        @data.legendFontFamily,
                        @data.legendFontSize,
                        @data.legendFontColor,
                        @data.axisFontFamily,
                        @data.axisFontColor,
                        @data.axisFontSize,
                        @data.pointRadius,
                        @data.xBoundsMinimum,
                        @data.xBoundsMaximum,
                        @data.yBoundsMinimum,
                        @data.yBoundsMaximum,
                        @data.xBoundsUnitsMajor,
                        @data.yBoundsUnitsMajor)
    @plot.draw()
    return @
