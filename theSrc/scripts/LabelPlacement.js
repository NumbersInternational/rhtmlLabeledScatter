
import labeler from './lib/labeler'
import SvgUtils from './utils/SvgUtils'
import _ from 'lodash'

class LabelPlacement {
  static place (svg, viewBoxDim, anchors, labels, pinnedLabels, labelsSvg) {
    console.log('rhtmlLabeledScatter: Running label placement algorithm...')

    labeler()
      .svg(svg)
      .w1(viewBoxDim.x)
      .w2(viewBoxDim.x + viewBoxDim.width)
      .h1(viewBoxDim.y)
      .h2(viewBoxDim.y + viewBoxDim.height)
      .anchor(anchors)
      .label(labels)
      .pinned(pinnedLabels)
      .start(500)

    // Move labels after label placement algorithm
    labelsSvg.attr('x', d => d.x)
              .attr('y', d => d.y)
  }

  static placeTrendLabels (svg, viewBoxDim, anchors, labels, pinnedLabels) {
    const labelsSvg = svg.selectAll('.lab')
    SvgUtils.setSvgBBoxWidthAndHeight(labels, labelsSvg)
    this.place(svg, viewBoxDim, anchors, labels, pinnedLabels, labelsSvg)

    const labelsImgSvg = svg.selectAll('.lab-img')
    labelsImgSvg.attr('x', d => d.x - (d.width / 2))
                  .attr('y', d => d.y - d.height)
  }

  static placeLabels (svg, viewBoxDim, anchors, labels, pinnedLabels) {
    const labelsSvg = svg.selectAll('.lab')
    const labelsImgSvg = svg.selectAll('.lab-img')
    SvgUtils.setSvgBBoxWidthAndHeight(labels, labelsSvg)
    const labsToBePlaced = _.filter(labels, l => l.text !== '' || (l.text === '' && l.url !== ''))

    this.place(svg, viewBoxDim, anchors, labsToBePlaced, pinnedLabels, labelsSvg)

    labelsImgSvg.attr('x', d => d.x - (d.width / 2))
                  .attr('y', d => d.y - d.height)
  }
}

module.exports = LabelPlacement