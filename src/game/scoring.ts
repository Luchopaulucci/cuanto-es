import {
  DISPUTED_NOTE,
  PLACE_POINTS,
  type Award,
  type Premise,
  type Scale,
} from './types'

export function isYearPremise(premise: Pick<Premise, 'kind' | 'unit'>): boolean {
  return premise.kind === 'year' || premise.unit === 'año'
}

export function disputedNote(
  premise: Pick<Premise, 'disputed'>,
): string | null {
  return premise.disputed ? DISPUTED_NOTE : null
}

export function relativeError(
  guess: number,
  trueValue: number,
  scale: Scale,
): number {
  if (!Number.isFinite(guess) || !Number.isFinite(trueValue)) {
    return Number.POSITIVE_INFINITY
  }
  if (trueValue === 0) {
    return Math.abs(guess)
  }
  if (scale === 'log') {
    if (guess <= 0 || trueValue <= 0) return Number.POSITIVE_INFINITY
    return Math.abs(Math.log(guess / trueValue))
  }
  return Math.abs(guess - trueValue) / Math.abs(trueValue)
}

export function rangeError(
  guess: number,
  trueValue: number,
  min: number,
  max: number,
): number {
  if (!Number.isFinite(guess) || !Number.isFinite(trueValue)) {
    return Number.POSITIVE_INFINITY
  }
  const span = Math.abs(max - min)
  if (span === 0) return Math.abs(guess - trueValue)
  return Math.abs(guess - trueValue) / span
}

export function premiseError(guess: number, premise: Premise): number {
  if (isYearPremise(premise)) {
    return rangeError(guess, premise.value, premise.min, premise.max)
  }
  return relativeError(guess, premise.value, premise.scale)
}

type ErrorRow = {
  playerId: string
  error: number
}

export function awardPoints(rows: ErrorRow[]): Award[] {
  const sorted = [...rows].sort((a, b) => a.error - b.error)
  const awards: Award[] = []
  let i = 0
  let place = 0

  while (i < sorted.length) {
    let j = i + 1
    while (j < sorted.length && almostEqual(sorted[j].error, sorted[i].error)) {
      j += 1
    }
    const groupSize = j - i
    const shared = sharePlacePoints(place, groupSize)
    for (let k = i; k < j; k += 1) {
      awards.push({
        playerId: sorted[k].playerId,
        points: shared,
        error: sorted[k].error,
        rank: place + 1,
      })
    }
    place += groupSize
    i = j
  }

  return awards
}

export function sharePlacePoints(startPlace: number, groupSize: number): number {
  let sum = 0
  for (let n = 0; n < groupSize; n += 1) {
    sum += PLACE_POINTS[startPlace + n] ?? 0
  }
  return sum / groupSize
}

function almostEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-12
}
