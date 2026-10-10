import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
  })
})
