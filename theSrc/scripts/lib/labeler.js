/* eslint-disable */
import Random from 'random-js'
import _ from 'lodash'
import RBush from 'rbush'

const NO_LOGGING = 0
const MINIMAL_LOGGING = 1
const OUTER_LOOP_LOGGING = 2
const INNER_LOOP_LOGGING = 3
const HECTIC_LOGGING = 4

// independent log flags
const OBSERVATION_LOGGING = false
const TEMPERATURE_LOGGING = false
const INITIALISATION_LOGGING = false

const LOG_LEVEL = MINIMAL_LOGGING

const labeler = function () {
    // Use Mersenne Twister seeded random number generator
  let random = new Random(Random.engines.mt19937().seed(1))

  let lab = []
  let anc = []
  // TODO: better name for points (they are not points). Nodes ? Members ?
  let points = [] // combined data structure for efficiency like
  let pointsWithLabels = []
  let collisionTree = null
  let isBubble = false
  let h1 = 1
  let h2 = 1
  let w1 = 1
  let w2 = 1
  let labeler = {}
  let svg = {}
  let resolveFunc = null
  let pinned = []
  let minLabWidth = Infinity
  let is_non_blocking_on = false
  let is_placement_algo_on = true

  const labelTopPadding = 5
  let max_move = 5.0
  let max_angle = 2 * 3.1415
  let skip = 0
  let acc = 0
  let acc_worse = 0
  let rej = 0
    
  // default weights
  let weightLineLength = 10.0 // leader line length
  let weightLabelToLabelOverlap = 12.0 // label-label overlap
  let weightLabelToAnchorOverlap = 8 // label-anchor overlap
  // 1.0 - NB legacy value for leader line intersection (was never implemented)
  // 2.0 - NB legacy value for leader line-label intersection (was never implemented)

  // penalty for length of leader line
  const placementPenaltyMultipliers = {
    centeredAboveAnchor: weightLineLength * 1,
    centeredUnderneathAnchor: weightLineLength * 1.5,
    leftOfAnchor: weightLineLength * 8,
    rightOfAnchor: weightLineLength * 8,
    diagonalOfAnchor: weightLineLength * 15
  }

  // booleans for user defined functions
  let user_energy = false
  let user_schedule = false

  let user_defined_energy
  let user_defined_schedule

  function energy (index, sweep = 'N/A') {
    // energy function, tailored for label placement

    const currentLabel = lab[index]
    let currAnchor = anc.find(e => e.id === currentLabel.id) || anc[index]
    let energy = 0

    const labelBoundaries = {
      left: currentLabel.x - currentLabel.width / 2,
      right: currentLabel.x + currentLabel.width / 2,
      top: currentLabel.y - currentLabel.height, // TODO account for padding here ?
      bottom: currentLabel.y,
    }

    // TODO surely I dont have to compute all 8 distances. It should be obvious to determine which is shortest distance ?

    let hdLabelLeftToAnchor = labelBoundaries.left - 4 - currAnchor.x
    let hdLabelCenterToAnchor = currentLabel.x - currAnchor.x
    let hdLabelRightToAnchor = labelBoundaries.right + 4 - currAnchor.x
    let vdLabelBottomToAnchor = labelBoundaries.bottom - (currAnchor.y - 5)
    let vdLabelCenterToAnchor = (currentLabel.y - currentLabel.height / 2) - currAnchor.y
    let vdLabelTopToAnchor = labelBoundaries.top + labelTopPadding - currAnchor.y

    const hypotenuseDistanceGivenTwoSides = (x,y) => Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
    const centerBottomDistance = hypotenuseDistanceGivenTwoSides(hdLabelCenterToAnchor, vdLabelBottomToAnchor)
    const centerTopDistance = hypotenuseDistanceGivenTwoSides(hdLabelCenterToAnchor, vdLabelTopToAnchor)
    const leftCenterDistance = hypotenuseDistanceGivenTwoSides(hdLabelLeftToAnchor, vdLabelCenterToAnchor)
    const rightCenterDistance = hypotenuseDistanceGivenTwoSides(hdLabelRightToAnchor, vdLabelCenterToAnchor)
    const leftTopDistance = hypotenuseDistanceGivenTwoSides(hdLabelLeftToAnchor, vdLabelTopToAnchor)
    const rightBottomDistance = hypotenuseDistanceGivenTwoSides(hdLabelRightToAnchor, vdLabelBottomToAnchor)
    const rightTopDistance = hypotenuseDistanceGivenTwoSides(hdLabelRightToAnchor, vdLabelTopToAnchor)
    const leftBottomDistance = hypotenuseDistanceGivenTwoSides(hdLabelLeftToAnchor, vdLabelBottomToAnchor)

    // Check if label is inside bubble for centering of label inside bubble
    const labIsInsideBubbleAnc = (labelBoundaries.left < currAnchor.x + currAnchor.r)
      && (labelBoundaries.right > currAnchor.x - currAnchor.r)
      && (labelBoundaries.top < currAnchor.y + currAnchor.r)
      && (labelBoundaries.bottom > currAnchor.y - currAnchor.r)
  
    if (isBubble && labIsInsideBubbleAnc) {
      vdLabelBottomToAnchor = (currentLabel.y - currentLabel.height / 4 - currAnchor.y)
      energy += hypotenuseDistanceGivenTwoSides(hdLabelCenterToAnchor, vdLabelBottomToAnchor) * weightLineLength
    } else {

      // TODO is it better to compute energy offset with the distance, then choose smallest distance and then we have the energy, rather than this switch ?
      const minDist = Math.min(centerBottomDistance, centerTopDistance, leftCenterDistance, rightCenterDistance, leftTopDistance, rightBottomDistance, rightTopDistance, leftBottomDistance)
      switch (minDist) {
        case centerBottomDistance:
          energy += centerBottomDistance * placementPenaltyMultipliers.centeredAboveAnchor
          break
        case centerTopDistance:
          energy += centerTopDistance * placementPenaltyMultipliers.centeredUnderneathAnchor
          break
        case leftCenterDistance:
          energy += leftCenterDistance * placementPenaltyMultipliers.rightOfAnchor // NB left<->right swap is deliberate
          break
        case rightCenterDistance:
          energy += rightCenterDistance * placementPenaltyMultipliers.leftOfAnchor // NB left<->right swap is deliberate
          break
        case leftTopDistance:
          energy += leftTopDistance * placementPenaltyMultipliers.diagonalOfAnchor
          break
        case rightBottomDistance:
          energy += rightBottomDistance * placementPenaltyMultipliers.diagonalOfAnchor
          break
        case rightTopDistance:
          energy += rightTopDistance * placementPenaltyMultipliers.diagonalOfAnchor
          break
        case leftBottomDistance:
          energy += leftBottomDistance * placementPenaltyMultipliers.diagonalOfAnchor
      }
    }

    const potentiallyOverlappingLabels = lab

    let x_overlap = null
    let y_overlap = null
    let overlap_area = null

    // penalty for label-label overlap
    let labelOverlapCount = 0
    _.forEach(potentiallyOverlappingLabels, comparisonLab => {
      if (comparisonLab.id !== currentLabel.id) {
        const comparisonLabelBoundaries = {
          left: comparisonLab.x - comparisonLab.width / 2,
          right: comparisonLab.x + comparisonLab.width / 2,
          top: comparisonLab.y - comparisonLab.height,
          bottom: comparisonLab.y,
        }
        x_overlap = Math.max(0, Math.min(comparisonLabelBoundaries.right, labelBoundaries.right) - Math.max(comparisonLabelBoundaries.left, labelBoundaries.left))
        y_overlap = Math.max(0, Math.min(comparisonLabelBoundaries.bottom, labelBoundaries.bottom) - Math.max(comparisonLabelBoundaries.top, labelBoundaries.top))
        overlap_area = x_overlap * y_overlap

        if (LOG_LEVEL >= HECTIC_LOGGING) { if (overlap_area > 0) { labelOverlapCount++; console.log(`label overlap!`) } }
        energy += (overlap_area * weightLabelToLabelOverlap)
      }
    })
    if (LOG_LEVEL >= INNER_LOOP_LOGGING) { console.log(`label overlap percentage: ${(100 * labelOverlapCount / lab.length).toFixed(2)}%`) }

    // penalty for label-anchor overlap
    // VIS-291 - this is separate because there could be different number of anc to lab
    let anchorOverlapCount = 0
    _.forEach(anc, a => {
      const anchorBoundaries = {
        left: a.x - a.r,
        right: a.x + a.r,
        top: a.y - a.r,
        bottom: a.y + a.r,
      }
      x_overlap = Math.max(0, Math.min(anchorBoundaries.right, labelBoundaries.right) - Math.max(anchorBoundaries.left, labelBoundaries.left))
      y_overlap = Math.max(0, Math.min(anchorBoundaries.bottom, labelBoundaries.bottom) - Math.max(anchorBoundaries.top, labelBoundaries.top))
      overlap_area = x_overlap * y_overlap

      // TODO: why ?
      if (isBubble && a.id === currentLabel.id) {
        overlap_area /= 2
      }
      if (LOG_LEVEL >= INNER_LOOP_LOGGING) { if (overlap_area > 0) { anchorOverlapCount++; console.log(`anchor overlap!`) } }
      energy += (overlap_area * weightLabelToAnchorOverlap)
    })
    if (LOG_LEVEL >= INNER_LOOP_LOGGING) { console.log(`anchor overlap percentage: ${(100 * anchorOverlapCount / anc.length).toFixed(2)}%`) }
    return energy
  }

  function mcmove (currTemperature, sweep = 'N/A') {
    // Monte Carlo translation move

    // select a random label
    const i = Math.floor(random.real(0, 1) * pointsWithLabels.length)
    const currentPoint = pointsWithLabels[i]
    const { label, anchor, pinned } = currentPoint

    // Ignore if user moved label
    if (pinned) { skip++; return }

    // Ignore if the label fits inside the anchor bubble
    if (!anchor.collidesWithOtherAnchors && anchor.labelFitsInsideBubble) {
      // console.log('mcrotate skipping a label that fits inside its bubble')
      skip++
      return
    }

    // Ignore if the label is optimal and has no nearby neighbors
    if (currentPoint.noInitialCollisionAndNoNearbyNeibhbors) {
      // console.log('mcrotate skipping a optimally placed label with no nearby neighbors')
      skip++
      return
    }

    // save old coordinates
    const x_old = label.x
    const y_old = label.y

    // old energy
    let old_energy = (user_energy) ? user_defined_energy(i, lab, anc) : energy(i, sweep)

    // random translation
    label.x += (random.real(0, 1) - 0.5) * max_move
    label.y += (random.real(0, 1) - 0.5) * max_move

    // hard wall boundaries
    if (label.x + label.width / 2 > w2) label.x = w2 - label.width / 2
    if (label.x - label.width / 2 < w1) label.x = w1 + label.width / 2
    if (label.y > h2) label.y = h2
    if (label.y - label.height < h1) label.y = h1 + label.height

    // new energy
    let new_energy = (user_energy) ? user_defined_energy(i, lab, anc) : energy(i, sweep)

    // TODO: I think this duplicated code between mcmove and mcrotate should be done at higher callee level

    // the closer this is to 1 the more likely we are to accept (above 1 accept 100%, below 0 accept 0%)
    // the more that new energy is less than old energy, the higher this gets
    // the hotter the temperature (at beginning of sim), higher this value
    const oddsOfAcceptingWorseLayout = Math.exp((old_energy - new_energy) / currTemperature)

    if (LOG_LEVEL >= OUTER_LOOP_LOGGING) {
      if (new_energy < old_energy) { console.log(`accepting improvement`) }
      else { console.log(`worse: old: ${old_energy}, new: ${new_energy}, temp: ${currTemperature}, odds of accepting: ${oddsOfAcceptingWorseLayout.toFixed(5)}`) }
    }
    const acceptChange = (new_energy < old_energy) || random.real(0, 1) < oddsOfAcceptingWorseLayout

    if (acceptChange) {
      acc += 1
      if (new_energy >= old_energy) { acc_worse += 1}
    } else {
      // move back to old coordinates
      lab[i].x = x_old
      lab[i].y = y_old
      rej += 1
    }
  }

  function mcrotate (currTemperature, sweep = 'N/A') {
    // Monte Carlo rotation move

    // select a random label
    const i = Math.floor(random.real(0, 1) * pointsWithLabels.length)
    const currentPoint = pointsWithLabels[i]
    const { label, anchor, pinned } = currentPoint

    // Ignore if user moved label
    if (pinned) { skip++; return }

    // Ignore if the label fits inside the anchor bubble
    if (isBubble && !anchor.collidesWithOtherAnchors && anchor.labelFitsInsideBubble) {
      // console.log('mcrotate skipping a label that fits inside its bubble')
      skip++
      return
    }

    // Ignore if the label is optimal and has no nearby neighbors
    if (currentPoint.noInitialCollisionAndNoNearbyNeibhbors) {
      // console.log('mcrotate skipping a optimally placed label with no nearby neighbors')
      skip++
      return
    }

    // save old coordinates
    const x_old = label.x
    const y_old = label.y

    // old energy
    let old_energy = (user_energy) ? user_defined_energy(i, lab, anc) : energy(i, sweep)

    // random angle
    const angle = (random.real(0, 1) - 0.5) * max_angle

    const s = Math.sin(angle)
    const c = Math.cos(angle)

    // translate label (relative to anchor at origin):
    label.x -= anchor.x + minLabWidth / 2
    label.y -= anchor.y

    // rotate label
    let x_new = label.x * c - label.y * s,
      y_new = label.x * s + label.y * c

    // translate label back
    label.x = x_new + anchor.x - label.width / 2
    label.y = y_new + anchor.y

    // hard wall boundaries
    if (label.x + label.width / 2 > w2) label.x = w2 - label.width / 2
    if (label.x - label.width / 2 < w1) label.x = w1 + label.width / 2
    if (label.y > h2) label.y = h2
    if (label.y - label.height < h1) label.y = h1 + label.height

    // new energy
    let new_energy = (user_energy) ? user_defined_energy(i, lab, anc) : energy(i, sweep)

    // TODO: I think this duplicated code between mcmove and mcrotate should be done at higher callee level

    // the closer this is to 1 the more likely we are to accept (above 1 accept 100%, below 0 accept 0%)
    // the more that new energy is less than old energy, the higher this gets
    // the hotter the temperature (at beginning of sim), higher this value
    const oddsOfAcceptingWorseLayout = Math.exp((old_energy - new_energy) / currTemperature)

    if (LOG_LEVEL >= OUTER_LOOP_LOGGING) { console.log(`old: ${old_energy}, new: ${new_energy}, temp: ${currTemperature}, oddsOfAcceptingWorseLayout: ${oddsOfAcceptingWorseLayout}`) }
    const acceptChange = (new_energy < old_energy) || random.real(0, 1) < oddsOfAcceptingWorseLayout

    if (acceptChange) {
      acc += 1
      if (new_energy >= old_energy) { acc_worse += 1}
    } else {
      // move back to old coordinates
      label.x = x_old
      label.y = y_old
      rej += 1
    }
  }

  function cooling_schedule ({ currTemperature, initialTemperature, finalTemperature, currentSweep, maxSweeps }) {
    const newTemperature = initialTemperature - (initialTemperature - finalTemperature) * (currentSweep / maxSweeps)

    if (TEMPERATURE_LOGGING) { console.log(`currTemperature: ${currTemperature}. newTemperature: ${newTemperature}`) }
    return newTemperature
  }
  
  function initLabBoundaries (lab) {
    _.forEach(lab, l => {
      if (l.x + l.width / 2 > w2) l.x = w2 - l.width / 2
      if (l.x - l.width / 2 < w1) l.x = w1 + l.width / 2
      if (l.y > h2) l.y = h2
      if (l.y - l.height < h1) l.y = h1 + l.height
    })
  }
  
  labeler.start = function (maxSweeps) {
    const startTime = Date.now()

    initLabBoundaries(lab)
    this.buildDataStructures()
    this.makeInitialObservations()

    // TODO extract out arbitrary 5 px shift ...
    _.forEach(lab, (l, i) => {
      if (!_.includes(pinned, l.id)) {
        if (!isBubble) l.y -= 5
        // determine min labs width for mcrotate
        if (l.width < minLabWidth) minLabWidth = l.width
      }
    })

    // main simulated annealing function
    let finalTemperature = 1.0
    let initialTemperature = 100.0
    let currTemperature = initialTemperature

    // TODO: this is no longer accurate as we still do _some_ stuff before this point
    if (!is_placement_algo_on) {
      // Turn off label placement algo if way too many labels given
      console.log("rhtmlLabeledScatter: Label placement turned off! (too many)")
      resolveFunc()
      
    } else {
      // Blocking implementation - faster for smaller numbers of labels
      let currentSweep = 0
      for (currentSweep = 0; currentSweep < maxSweeps; currentSweep++) {
        for (let j = 0; j < lab.length; j++) {
          (random.real(0, 1) < 0.8) ? mcmove(currTemperature, currentSweep) : mcrotate(currTemperature, currentSweep)
        }
        currTemperature = cooling_schedule({ currTemperature, initialTemperature, finalTemperature, currentSweep, maxSweeps })
        //console.log(`sweep ${sweep} complete`)
      }
      if (LOG_LEVEL >= MINIMAL_LOGGING) {
        console.log(`rhtmlLabeledScatter: Label placement complete after ${currentSweep} sweeps. accept/reject/skip: ${acc}/${rej}/${skip}! (accept_worse: ${acc_worse})`)
        console.log(JSON.stringify({
          duration: Date.now() - startTime,
          sweep: currentSweep,
          monte_carlo_rounds: acc + rej,
          pass_rate: Math.round((acc / (acc + rej)) * 1000) / 1000,
          accept_worse_rate: Math.round((acc_worse / (acc_worse + rej)) * 1000) / 1000,
          skip,
          acc,
          rej,
          acc_worse
        }))
      }
      resolveFunc()
    }
  }

  labeler.buildDataStructures = function () {
    _(anc).each(addMinMaxToCircle)
    _(anc).each(a => addTypeToObject(a, 'anchor'))
    _(lab).each(addMinMaxToRectangle)
    _(lab).each(l => addTypeToObject(l, 'label'))
    const nestUnderField = (array, type) => array.map(item => ({ id: item.id, [type]: item }))

    // XXX can merge pinned here too and simplify
    const mergedStructure = _.merge(
      _.keyBy(nestUnderField(lab, 'label'), 'id'),
      _.keyBy(nestUnderField(anc, 'anchor'), 'id')
    )
    points = _(mergedStructure)
      .map(({ label, anchor, id }) => {
        if (id !== anchor.id && id !== label.id) {
          const errorMessage = 'unexpected id mismatch'
          console.error(errorMessage)
          throw new Error(errorMessage)
        }
        return {
          id,
          label,
          anchor,
          pinned: (_.includes(pinned, id))
        }
      })
      .values()
      .value()

    collisionTree = new RBush()
    collisionTree.load(anc)
    collisionTree.load(lab)
  }

  labeler.makeInitialObservations = function () {
    // note this is a broad sweep collision detection (it is using a rectangle to detect sphere overlap)
    // TODO: test each collision more precisely
    points.forEach(point => {
      const {label, anchor} = point
      const search = collisionTree.search(anchor)
        .filter(isAnchor)
        .filter(notSameId(anchor.id))
      if (INITIALISATION_LOGGING) { console.log(`anchor ${anchor.id} collision count:` , search.length) }
      anchor.collidesWithOtherAnchors = (search.length > 0)
      // if (label) { console.log(`label:${label.text} anchor collidesWithOtherAnchors: ${anchor.collidesWithOtherAnchors}`)}

      // TODO the "if it fits" is an approximation
      // TODO the "move it down by 1/4 of height is a hack (and doesn't belong here.
      //  * shouldn't be done here
      //  * don't understand why its not 1/2 of height, not 1/4
      //  * visually it works so leaving it now
      anchor.labelFitsInsideBubble = false
      if (label && isBubble) {
        if (label.width < 2 * anchor.r) {
          //TODO:  this observation should be on the point not on the anchor
          anchor.labelFitsInsideBubble = true
          label.y = anchor.y + label.height / 4
        } else {
          label.y = anchor.minY - 0 // TODO: make padding variable
        }
      }
      // if (label) { console.log(`label:${label.text} anchor labelFitsInsideBubble: ${anchor.labelFitsInsideBubble}`)}

      if (label) {
        const labelAndAnchorBoundingBox = combinedBoundingBox(label, anchor)
        // TODO: make this a percentage of layout, maybe considering layout density ?
        const expandedLabelAndAnchorBoundingBox = expandBox({
          box: labelAndAnchorBoundingBox,
          up: 20,
          down: 20,
          left: 20,
          right: 20
        })

        const nearbyThings = collisionTree.search(expandedLabelAndAnchorBoundingBox)
          .filter(notSameId(anchor.id))
        point.noInitialCollisionAndNoNearbyNeibhbors = (nearbyThings.length === 0)
      } else {
        point.noInitialCollisionAndNoNearbyNeibhbors = false
      }
      // if (label) { console.log(`label:${label.text} anchor noInitialCollisionAndNoNearbyNeibhbors: ${point.noInitialCollisionAndNoNearbyNeibhbors}`)}

    })

    pointsWithLabels = points.filter(({label}) => label)
  }

  labeler.promise = function (resolve) {
    resolveFunc = resolve
    return labeler
  }

  labeler.svg = function (x) {
    svg = x
    return labeler
  }

  labeler.w1 = function (x) {
    if (!arguments.length) return w
    w1 = x
    return labeler
  }
  labeler.w2 = function (x) {
    if (!arguments.length) return w
    w2 = x
    return labeler
  }

  labeler.h1 = function (x) {
    if (!arguments.length) return h
    h1 = x
    return labeler
  }

  labeler.h2 = function (x) {
    if (!arguments.length) return h
    h2 = x
    return labeler
  }

  labeler.label = function (x) {
    // users insert label positions
    if (!arguments.length) return lab
    lab = x

    return labeler
  }

  labeler.anchor = function (x) {
    // users insert anchor positions
    if (!arguments.length) return anc
    anc = x

    return labeler
  }
  
  labeler.anchorType = function (x) {
    if (!arguments.length) return isBubble
    isBubble = x
    return labeler
  }

  labeler.pinned = function (x) {
    // user positioned labels
    if (!arguments.length) return pinned
    pinned = x
    return labeler
  }
  
  labeler.weights = function (x, y, z) {
    // Weights used in the label placement algorithm
    weightLineLength = x
    weightLabelToLabelOverlap = y
    weightLabelToAnchorOverlap = z
    return labeler
  }
  
  labeler.settings = function (seed, maxMove, maxAngle, isLabelSorterOn, isNonBlockingOn, isPlacementAlgoOn) {
    // Additional exposed settings
    random = new Random(Random.engines.mt19937().seed(seed))
    max_move = maxMove
    max_angle = maxAngle
    is_non_blocking_on = isNonBlockingOn
    is_placement_algo_on = isPlacementAlgoOn
    return labeler
  }

  labeler.alt_energy = function (x) {
    // user defined energy
    if (!arguments.length) return energy
    user_defined_energy = x
    user_energy = true
    return labeler
  }

  labeler.alt_schedule = function (x) {
    // user defined cooling_schedule
    if (!arguments.length) return cooling_schedule
    user_defined_schedule = x
    user_schedule = true
    return labeler
  }

  return labeler
}

module.exports = labeler
/* eslint-enable */

const addMinMaxToCircle = (circle) => {
  circle.minX = circle.x - circle.r
  circle.maxX = circle.x + circle.r
  circle.minY = circle.y - circle.r
  circle.maxY = circle.y + circle.r
  return circle
}

const addMinMaxToRectangle = (rect) => {
  rect.minX = rect.x - rect.width / 2
  rect.maxX = rect.x + rect.width / 2
  rect.minY = rect.y - rect.height
  rect.maxY = rect.y
  return rect
}

const addTypeToObject = (obj, type) => {
  obj.type = type
  return obj
}

const isAnchor = ({ type } = {}) => type === 'anchor'
// const isLabel = ({type} = {}) => type === 'label'
const notSameId = (id) => (obj) => obj.id !== id

const expandBox = ({ box, up = 0, down = 0, left = 0, right = 0 }) => {
  return {
    minX: box.minX - left,
    maxX: box.minX + right,
    minY: box.minY - up,
    maxY: box.maxY + down
  }
}

const combinedBoundingBox = (...boxes) => {
  return _(boxes)
    .filter(x => !_.isNull(x) && !_.isUndefined(x))
    .reduce((minMaxes, box) => ({
      minX: Math.min(minMaxes.minX, box.minX),
      maxX: Math.max(minMaxes.maxX, box.maxX),
      minY: Math.min(minMaxes.minY, box.minY),
      maxY: Math.max(minMaxes.maxY, box.maxY)
  }), {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  })
}
