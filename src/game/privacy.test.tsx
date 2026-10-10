import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { GuessScreen } from '../components/GuessScreen'
import { HandoffScreen } from '../components/HandoffScreen'
import { formatPremiseValue } from './format'
import { coerceToHandoff, publicStateView, urlLooksClean } from './privacy'
import { createInitialState } from './reducer'
import { defaultSliderValue, snapToStep } from './slider'
import type { Premise } from './types'

const premise: Premise = {
  id: 'cow',
  category: 'animales',
  question: '¿Cuánto pesa una vaca?',
  value: 680,
  unit: 'kg',
  unitLabel: 'kilogramos',
  min: 20,
  max: 5000,
  step: 5,
  scale: 'log',
  source: { name: 'x', url: 'https://example.com' },
}

afterEach(() => cleanup())

describe('privacidad entre turnos', () => {
  it('el slider arranca siempre en el medio, nunca en el valor anterior', () => {
    const mid = snapToStep(
      defaultSliderValue(premise.min, premise.max, premise.scale),
      premise.min,
      premise.max,
      premise.step,
    )
    const previous = 420
    expect(mid).not.toBe(previous)

    const { rerender } = render(
      <GuessScreen
        key="luna"
        player={{ id: 'a', name: 'Luna', color: '#C42B54' }}
        premise={premise}
        roundLabel="Ronda 1 de 10"
        onSubmit={() => {}}
      />,
    )
    expect(screen.getByTestId('guess-value').textContent).toBe(
      formatPremiseValue(premise, mid),
    )

    rerender(
      <GuessScreen
        key="otto"
        player={{ id: 'b', name: 'Otto', color: '#1D4ED8' }}
        premise={premise}
        roundLabel="Ronda 1 de 10"
        onSubmit={() => {}}
      />,
    )
    expect(screen.getByTestId('guess-value').textContent).toBe(
      formatPremiseValue(premise, mid),
    )
    expect(screen.queryByText(formatPremiseValue(premise, previous))).toBeNull()
  })

  it('el pase de celu no muestra número, slider ni historial', () => {
    render(
      <HandoffScreen
        player={{ id: 'b', name: 'Otto', color: '#1D4ED8' }}
        onReady={() => {}}
      />,
    )
    expect(screen.getByTestId('handoff-screen').textContent).toMatch(/Pasá el celu a/)
    expect(screen.getByText('Otto')).toBeInTheDocument()
    expect(screen.queryByTestId('guess-value')).toBeNull()
    expect(screen.queryByTestId('vertical-slider')).toBeNull()
    expect(screen.queryByTestId('number-line')).toBeNull()
    expect(screen.queryByText(/kg/)).toBeNull()
    expect(screen.queryByText('680')).toBeNull()
    expect(screen.queryByText('9999')).toBeNull()
  })

  it('la vista pública pre-reveal borra guesses y el restore va a handoff', () => {
    const dirty = {
      ...createInitialState(),
      phase: 'guess' as const,
      guesses: { a: 12345 },
      lastResult: [{ playerId: 'a', points: 3, error: 0, rank: 1 }],
    }
    const locked = coerceToHandoff(dirty)
    expect(locked.phase).toBe('handoff')
    const pub = publicStateView(dirty)
    expect(pub.phase).toBe('handoff')
    expect(pub.guesses).toEqual({})
    expect(pub.lastResult).toBeNull()
  })

  it('no guarda respuestas en la URL', () => {
    expect(urlLooksClean({ search: '', hash: '' })).toBe(true)
    expect(urlLooksClean(window.location)).toBe(true)
  })
})

describe('handoff copy', () => {
  it('se puede seguir con el botón Soy', async () => {
    const user = userEvent.setup()
    let ready = false
    render(
      <HandoffScreen
        player={{ id: 'a', name: 'Luna', color: '#C42B54' }}
        onReady={() => {
          ready = true
        }}
      />,
    )
    await user.click(screen.getByTestId('handoff-continue'))
    expect(ready).toBe(true)
  })
})
