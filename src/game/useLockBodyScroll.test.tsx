import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { GuessScreen } from '../components/GuessScreen'
import { RevealScreen } from '../components/RevealScreen'
import { SetupScreen } from '../components/SetupScreen'
import { SCROLL_LOCK_CLASS } from './useLockBodyScroll'
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

describe('lock de scroll al responder', () => {
  it('GuessScreen bloquea overflow del documento', () => {
    render(
      <GuessScreen
        player={{ id: 'a', name: 'Luna', color: '#C42B54' }}
        premise={premise}
        roundLabel="Ronda 1 de 10"
        onSubmit={() => {}}
      />,
    )
    expect(screen.getByTestId('guess-screen')).toHaveClass('guess-screen', 'overflow-hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.classList.contains(SCROLL_LOCK_CLASS)).toBe(true)
    expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(true)
  })

  it('setup y resultados siguen pudiendo scrollear', () => {
    const { unmount } = render(
      <GuessScreen
        player={{ id: 'a', name: 'Luna', color: '#C42B54' }}
        premise={premise}
        roundLabel="Ronda 1 de 10"
        onSubmit={() => {}}
      />,
    )
    unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
    expect(document.documentElement.classList.contains(SCROLL_LOCK_CLASS)).toBe(false)

    render(
      <SetupScreen
        players={[]}
        roundsTotal={10}
        selectedCategories={['animales']}
        picante={false}
        onAdd={() => {}}
        onRemove={() => {}}
        onRename={() => {}}
        onColor={() => {}}
        onRounds={() => {}}
        onToggleCategory={() => {}}
        onTogglePicante={() => {}}
        onStart={() => {}}
      />,
    )
    expect(screen.getByTestId('setup-screen')).not.toHaveClass('guess-screen')
    expect(document.body.style.overflow).not.toBe('hidden')
    cleanup()

    render(
      <RevealScreen
        premise={premise}
        players={[{ id: 'a', name: 'Luna', color: '#C42B54' }]}
        guesses={{ a: 700 }}
        awards={[{ playerId: 'a', points: 3, error: 0.1, rank: 1 }]}
        scores={{ a: 3 }}
        onNext={() => {}}
        nextLabel="Siguiente"
      />,
    )
    expect(screen.getByTestId('reveal-screen')).not.toHaveClass('overflow-hidden')
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
