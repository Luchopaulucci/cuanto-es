import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { GuessScreen } from '../components/GuessScreen'
import { RevealScreen } from '../components/RevealScreen'
import { SetupScreen } from '../components/SetupScreen'
import { PodiumScreen } from '../components/PodiumScreen'
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

afterEach(() => {
  cleanup()
  document.body.classList.remove(SCROLL_LOCK_CLASS)
  document.documentElement.classList.remove(SCROLL_LOCK_CLASS)
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

describe('lock de scroll solo en la pantalla del slider', () => {
  it('GuessScreen pone la clase solo en body y la saca al desmontar', () => {
    const { unmount } = render(
      <GuessScreen
        player={{ id: 'a', name: 'Luna', color: '#C42B54' }}
        premise={premise}
        roundLabel="Ronda 1 de 10"
        onSubmit={() => {}}
      />,
    )
    expect(screen.getByTestId('guess-screen')).toHaveClass('guess-screen', 'safe-area-screen')
    expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(true)
    expect(document.documentElement.classList.contains(SCROLL_LOCK_CLASS)).toBe(false)
    expect(document.documentElement.style.overflow).not.toBe('hidden')

    unmount()
    expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(false)
  })

  it('setup, resultados y podio no bloquean el scroll del documento', () => {
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
    expect(screen.getByTestId('setup-screen')).toHaveClass('safe-area-screen', 'screen-min-h')
    expect(screen.getByTestId('setup-screen')).not.toHaveClass('guess-screen')
    expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(false)
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
    expect(screen.getByTestId('reveal-screen')).toHaveClass('safe-area-screen', 'screen-min-h')
    expect(screen.getByTestId('reveal-screen')).not.toHaveClass('overflow-hidden', 'guess-screen')
    expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(false)
    cleanup()

    render(
      <PodiumScreen
        players={[{ id: 'a', name: 'Luna', color: '#C42B54' }]}
        scores={{ a: 3 }}
        onAgain={() => {}}
      />,
    )
    expect(screen.getByTestId('podium-screen')).toHaveClass('safe-area-screen', 'screen-min-h')
    expect(document.body.classList.contains(SCROLL_LOCK_CLASS)).toBe(false)
  })
})
