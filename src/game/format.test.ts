import { describe, expect, it } from 'vitest'
import { formatNameList, formatPremiseValue, winnerHeadline } from './format'
import type { Premise } from './types'

const year: Premise = {
  id: 'y',
  category: 'historia',
  question: '¿En qué año?',
  value: 2000,
  unit: 'año',
  unitLabel: 'año',
  min: 1000,
  max: 2020,
  step: 1,
  scale: 'linear',
  kind: 'year',
  source: { name: 'n', url: 'https://example.com' },
}

const kilos: Premise = {
  id: 'k',
  category: 'animales',
  question: '¿Cuánto pesa?',
  value: 2000,
  unit: 'kg',
  unitLabel: 'kilogramos',
  min: 1,
  max: 8000,
  step: 1,
  scale: 'linear',
  source: { name: 'n', url: 'https://example.com' },
}

describe('lista de nombres en español', () => {
  it('arma la enumeración natural', () => {
    expect(formatNameList(['Beto'])).toBe('Beto')
    expect(formatNameList(['Beto', 'Caro'])).toBe('Beto y Caro')
    expect(formatNameList(['Beto', 'Caro', 'Dani'])).toBe('Beto, Caro y Dani')
    expect(formatNameList(['Beto', 'Caro', 'Dani', 'Hugo'])).toBe(
      'Beto, Caro, Dani y Hugo',
    )
  })

  it('titula el empate o el ganador', () => {
    expect(winnerHeadline(['Luna'])).toBe('¡Luna se quedó más cerca!')
    expect(winnerHeadline(['Beto', 'Caro', 'Dani', 'Hugo'])).toBe(
      '¡Empate entre Beto, Caro, Dani y Hugo!',
    )
  })
})

describe('formato de años', () => {
  it('los años van sin separador de miles', () => {
    expect(formatPremiseValue(year, 2000)).toBe('2000')
    expect(formatPremiseValue(year, 1829)).toBe('1829')
    expect(formatPremiseValue({ ...year, kind: undefined }, 1492)).toBe('1492')
  })

  it('las demás magnitudes siguen con separador', () => {
    expect(formatPremiseValue(kilos, 2000)).toBe('2.000')
    expect(formatPremiseValue(kilos, 20000)).toBe('20.000')
  })
})
