import { describe, expect, it } from 'vitest'
import { formatNameList, winnerHeadline } from './format'

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
