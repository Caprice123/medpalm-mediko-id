import { ClassicScoring } from './classicScoring.js'
import { BlitzScoring }   from './blitzScoring.js'

const strategies = {
  classic: ClassicScoring,
  blitz:   BlitzScoring,
}

export function getScoringStrategy(scoringType) {
  const strategy = strategies[scoringType]
  if (!strategy) throw new Error(`Unknown scoring type: ${scoringType}`)
  return strategy
}
