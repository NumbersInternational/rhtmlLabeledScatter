
import labeler from './lib/labeler'

class LabelPlacement {
  constructor ({
                 svg,
                 pltId,
                 isBubble,
                 isLabelPlacementAlgoOn,
                 weights,
                 numSweeps,
                 maxMove,
                 maxAngle,
                 seed,
                 initialTemperature,
                 finalTemperature
               }) {
    this.svg = svg
    this.pltId = pltId
    this.isBubble = isBubble
    this.isLabelPlacementAlgoOn = isLabelPlacementAlgoOn

    this.weights = weights
    this.numSweeps = numSweeps
    this.maxMove = maxMove
    this.maxAngle = maxAngle
    this.seed = seed
    this.initialTemperature = initialTemperature
    this.finalTemperature = finalTemperature
  }

  updateSvgOnResize (svg) {
    this.svg = svg
  }

  place ({ vb, plotArea }) {
    labeler()
      .svg(this.svg)
      .plotArea(plotArea)
      // .w1(vb.x)
      // .w2(vb.x + vb.width)
      // .h1(vb.y)
      // .h2(vb.y + vb.height)
      // .points(points)
      .anchorType(this.isBubble)
      .setTemperatureBounds(this.initialTemperature, this.finalTemperature)
      .weights(this.weights)
      .settings(this.seed, this.maxMove, this.maxAngle, this.isLabelPlacementAlgoOn)
      .start(this.numSweeps)
  }

  placeTrendLabels ({ vb, points }) {
    this.place({ vb, points })
  }

  placeLabels ({ vb, plotArea }) {
    this.place({ vb, plotArea })
  }
}

module.exports = LabelPlacement
