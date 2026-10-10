import { describe, expect, it } from 'vitest'
import { DISPUTED_NOTE } from './types'
import {
  awardPoints,
  disputedNote,
  isYearPremise,
  pointsForPlace,
  premiseError,
  rangeError,
  relativeError,
} from './scoring'
import type { Premise } from './types'

const year: Premise = {
  id: 'y',
  category: 'en-que-anio',
  question: '¿En qué año?',
  value: 1816,
  unit: 'año',
  unitLabel: 'año',
  min: 1400,
  max: 2020,
  step: 1,
  scale: 'linear',
  kind: 'year',
  source: { name: 'x', url: 'https://example.com' },
}

describe('relativeError', () => {
  it('trata igual un error relativo en hormiga y vaca', () => {
    const ant = relativeError(6, 3, 'linear')
    const cow = relativeError(1360, 680, 'linear')
    expect(ant).toBeCloseTo(cow)
    expect(ant).toBeCloseTo(1)
  })

  it('usa razón logarítmica en escala log', () => {
    expect(relativeError(100, 10, 'log')).toBeCloseTo(Math.log(10))
    expect(relativeError(10, 100, 'log')).toBeCloseTo(Math.log(10))
  })
})

describe('year scoring', () => {
  it('normaliza la diferencia absoluta al rango, no al año', () => {
    const byRange = rangeError(1800, 1816, 1400, 2020)
    const relative = relativeError(1800, 1816, 'linear')
    expect(byRange).toBeCloseTo(16 / 620)
    expect(byRange).not.toBeCloseTo(relative)
    expect(premiseError(1800, year)).toBeCloseTo(16 / 620)
    expect(isYearPremise(year)).toBe(true)
    expect(isYearPremise({ kind: 'measure', unit: 'kg' })).toBe(false)
    expect(isYearPremise({ unit: 'año' })).toBe(true)
  })
})

describe('awardPoints', () => {
  it('da 3, 2 y 1 a los tres más cerca', () => {
    const awards = awardPoints([
      { playerId: 'a', error: 0.4 },
      { playerId: 'b', error: 0.1 },
      { playerId: 'c', error: 0.2 },
    ])
    expect(awards.find((x) => x.playerId === 'b')?.points).toBe(3)
    expect(awards.find((x) => x.playerId === 'c')?.points).toBe(2)
    expect(awards.find((x) => x.playerId === 'a')?.points).toBe(1)
  })

  it('empate en 1°: los dos llevan 3 y el siguiente es 3° con 1', () => {
    expect(pointsForPlace(0)).toBe(3)
    const awards = awardPoints([
      { playerId: 'a', error: 0.1 },
      { playerId: 'b', error: 0.1 },
      { playerId: 'c', error: 0.4 },
    ])
    expect(awards.every((a) => Number.isInteger(a.points))).toBe(true)
    expect(awards.find((x) => x.playerId === 'a')).toMatchObject({ points: 3, rank: 1 })
    expect(awards.find((x) => x.playerId === 'b')).toMatchObject({ points: 3, rank: 1 })
    expect(awards.find((x) => x.playerId === 'c')).toMatchObject({ points: 1, rank: 3 })
  })

  it('empate en 2°: el 1° lleva 3 y los empatados llevan 2', () => {
    const awards = awardPoints([
      { playerId: 'a', error: 0.05 },
      { playerId: 'b', error: 0.2 },
      { playerId: 'c', error: 0.2 },
      { playerId: 'd', error: 0.9 },
    ])
    expect(awards.every((a) => Number.isInteger(a.points))).toBe(true)
    expect(awards.find((x) => x.playerId === 'a')).toMatchObject({ points: 3, rank: 1 })
    expect(awards.find((x) => x.playerId === 'b')).toMatchObject({ points: 2, rank: 2 })
    expect(awards.find((x) => x.playerId === 'c')).toMatchObject({ points: 2, rank: 2 })
    expect(awards.find((x) => x.playerId === 'd')).toMatchObject({ points: 0, rank: 4 })
  })

  it('empate en 3°: 3, 2 y los dos últimos llevan 1', () => {
    const awards = awardPoints([
      { playerId: 'a', error: 0.05 },
      { playerId: 'b', error: 0.1 },
      { playerId: 'c', error: 0.4 },
      { playerId: 'd', error: 0.4 },
    ])
    expect(awards.every((a) => Number.isInteger(a.points))).toBe(true)
    expect(awards.find((x) => x.playerId === 'a')).toMatchObject({ points: 3, rank: 1 })
    expect(awards.find((x) => x.playerId === 'b')).toMatchObject({ points: 2, rank: 2 })
    expect(awards.find((x) => x.playerId === 'c')).toMatchObject({ points: 1, rank: 3 })
    expect(awards.find((x) => x.playerId === 'd')).toMatchObject({ points: 1, rank: 3 })
  })

  it('ocho empatados: todos 1° y todos llevan 3, sin fracciones', () => {
    const awards = awardPoints(
      Array.from({ length: 8 }, (_, i) => ({ playerId: `p${i}`, error: 0.33 })),
    )
    expect(awards).toHaveLength(8)
    expect(awards.every((a) => a.points === 3 && a.rank === 1 && Number.isInteger(a.points))).toBe(
      true,
    )
  })
})

describe('disputedNote', () => {
  it('devuelve la nota fija si está en disputa', () => {
    expect(disputedNote({ disputed: true })).toBe(DISPUTED_NOTE)
    expect(disputedNote({ disputed: false })).toBeNull()
    expect(disputedNote({})).toBeNull()
  })
})
