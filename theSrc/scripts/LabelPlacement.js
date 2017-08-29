
import labeler from './lib/labeler'
import SvgUtils from './utils/SvgUtils'
import _ from 'lodash'

class LabelPlacement {
  static place (svg, vb, anchors, labels, pinnedLabels, labelsSvg, state) {
    console.log('rhtmlLabeledScatter: Running label placement algorithm...')

    labeler()
      .svg(svg)
      .w1(vb.x)
      .w2(vb.x + vb.width)
      .h1(vb.y)
      .h2(vb.y + vb.height)
      .anchor(anchors)
      .label(labels)
      .pinned(pinnedLabels)
      .start(500)

    // Move labels after label placement algorithm
    labelsSvg.attr('x', d => d.x)
              .attr('y', d => d.y)

    if (pinnedLabels.length < labels.length) {
      state.saveAlgoPositionedLabs(labels, vb)
    }
  }

  static placeTrendLabels (svg, vb, anchors, labels, state) {
    const labelsSvg = svg.selectAll('.lab')
    SvgUtils.setSvgBBoxWidthAndHeight(labels, labelsSvg)
    this.place(svg, vb, anchors, labels, state.getPositionedLabIds(vb), labelsSvg, state)

    const labelsImgSvg = svg.selectAll('.lab-img')
    labelsImgSvg.attr('x', d => d.x - (d.width / 2))
                  .attr('y', d => d.y - d.height)
  }

  static placeLabels (svg, vb, anchors, labels, state) {
    const labelsSvg = svg.selectAll('.lab')
    const labelsImgSvg = svg.selectAll('.lab-img')
    SvgUtils.setSvgBBoxWidthAndHeight(labels, labelsSvg)
    const labsToBePlaced = _.filter(labels, l => l.text !== '' || (l.text === '' && l.url !== ''))

    this.place(svg, vb, anchors, labsToBePlaced, state.getPositionedLabIds(vb), labelsSvg, state)

    labelsImgSvg.attr('x', d => d.x - (d.width / 2))
                  .attr('y', d => d.y - d.height)
  }
}

module.exports = LabelPlacement
