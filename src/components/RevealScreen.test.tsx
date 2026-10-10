import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DISPUTED_NOTE } from '../game/types'
import type { Premise } from '../game/types'
import { RevealScreen } from './RevealScreen'

const disputed: Premise = {
  id: 'argf-dulce',
  category: 'argentinidad',
  question: '¿Dulce de leche?',
  value: 1829,
  unit: 'año',
  unitLabel: 'año',
  min: 1600,
  max: 1950,
  step: 1,
  scale: 'linear',
  kind: 'year',
  disputed: true,
  source: { name: 'Cultura', url: 'https://www.cultura.gob.ar/' },
}

afterEach(() => cleanup())

describe('RevealScreen disputed', () => {
  it('muestra la nota en cada premisa en disputa', () => {
    render(
      <RevealScreen
        premise={disputed}
        players={[{ id: 'a', name: 'Luna', color: '#C42B54' }]}
        guesses={{ a: 1800 }}
        awards={[{ playerId: 'a', points: 3, error: 0.1, rank: 1 }]}
        scores={{ a: 3 }}
        onNext={() => {}}
        nextLabel="Siguiente"
      />,
    )
    expect(screen.getByTestId('disputed-note')).toHaveTextContent(DISPUTED_NOTE)
    expect(screen.getByTestId('reveal-value')).toHaveTextContent('1829')
    expect(screen.getByTestId('reveal-value')).not.toHaveTextContent('1.829')
  })

  it('lista el empate en español natural', () => {
    render(
      <RevealScreen
        premise={disputed}
        players={[
          { id: 'a', name: 'Beto', color: '#C42B54' },
          { id: 'b', name: 'Caro', color: '#1D4ED8' },
          { id: 'c', name: 'Dani', color: '#15803D' },
          { id: 'd', name: 'Hugo', color: '#6D28D9' },
        ]}
        guesses={{ a: 1829, b: 1829, c: 1829, d: 1829 }}
        awards={[
          { playerId: 'a', points: 3, error: 0, rank: 1 },
          { playerId: 'b', points: 3, error: 0, rank: 1 },
          { playerId: 'c', points: 3, error: 0, rank: 1 },
          { playerId: 'd', points: 3, error: 0, rank: 1 },
        ]}
        scores={{ a: 3, b: 3, c: 3, d: 3 }}
        onNext={() => {}}
        nextLabel="Siguiente"
      />,
    )
    expect(screen.getByTestId('winner-headline')).toHaveTextContent(
      '¡Empate entre Beto, Caro, Dani y Hugo!',
    )
  })
})
