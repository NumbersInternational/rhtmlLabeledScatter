
import labeler from './lib/labeler'
import SvgUtils from './utils/SvgUtils'
import _ from 'lodash'

class LabelPlacement {
  static place (svg, vb, anchors, isBubble, labels, pinnedLabels, labelsSvg, state, resolve) {
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
      .promise(resolve)
      .anchorType(isBubble)
      .start(500)
  }

  static placeTrendLabels (svg, vb, anchors, isBubble, labels, state, resolve) {
    const labelsSvg = svg.selectAll('.lab')

    SvgUtils.setMatchingSvgBBoxWidthAndHeight(labels, labelsSvg)
    this.place(svg, vb, anchors, isBubble, labels, state.getPositionedLabIds(vb), labelsSvg, state, resolve)

    const labelsImgSvg = svg.selectAll('.lab-img')
    labelsImgSvg.attr('x', d => d.x - (d.width / 2))
                .attr('y', d => d.y - d.height)
                .style('display', 'none')
  }

  static placeLabels (svg, vb, anchors, isBubble, labels, state, resolve) {
    const labelsSvg = svg.selectAll('.lab')
    const labelsImgSvg = svg.selectAll('.lab-img')

    SvgUtils.setMatchingSvgBBoxWidthAndHeight(labels, labelsSvg)
    const labsToBePlaced = _.filter(labels, l => l.text !== '' || (l.text === '' && l.url !== ''))

    // Hide labels until after placement algorithm has completed
    labelsSvg.style('display', 'none')

    this.place(svg, vb, anchors, isBubble, labsToBePlaced, state.getPositionedLabIds(vb), labelsSvg, state, resolve)

    labelsImgSvg.attr('x', d => d.x - (d.width / 2))
                .attr('y', d => d.y - d.height)
                .style('display', 'none')
  }
}

module.exports = LabelPlacement
