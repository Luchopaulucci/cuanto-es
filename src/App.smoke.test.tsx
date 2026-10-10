import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { formatPremiseValue } from './game/format'
import { defaultSliderValue, snapToStep } from './game/slider'
import { STORAGE_KEY } from './game/persist'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe('ronda completa de 2 jugadores', () => {
  it('setup → pase → slider → pase sin filtrar → reveal', async () => {
    window.localStorage.clear()
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('setup-screen')).toBeInTheDocument()
    await user.type(screen.getByTestId('player-name-input'), 'Luna')
    await user.click(screen.getByTestId('add-player'))
    await user.type(screen.getByTestId('player-name-input'), 'Otto')
    await user.click(screen.getByTestId('add-player'))
    await user.click(screen.getByTestId('start-game'))

    const handoff = screen.getByTestId('handoff-screen')
    expect(handoff).toHaveTextContent('Pasá el celu a')
    expect(handoff).toHaveTextContent('Luna')
    expect(within(handoff).queryByTestId('vertical-slider')).toBeNull()
    await user.click(screen.getByTestId('handoff-continue'))

    const guess = screen.getByTestId('guess-screen')
    expect(guess).toHaveTextContent('Luna')
    const firstShown = screen.getByTestId('guess-value').textContent
    await user.click(screen.getByTestId('slider-plus'))
    await user.click(screen.getByTestId('slider-plus'))
    const lunaValue = screen.getByTestId('guess-value').textContent
    expect(lunaValue).not.toBe(firstShown)
    await user.click(screen.getByTestId('guess-ready'))

    const handoff2 = screen.getByTestId('handoff-screen')
    expect(handoff2).toHaveTextContent('Otto')
    expect(handoff2).not.toHaveTextContent(lunaValue ?? '___')
    expect(within(handoff2).queryByTestId('guess-value')).toBeNull()
    expect(within(handoff2).queryByTestId('vertical-slider')).toBeNull()
    expect(window.location.search).toBe('')

    await user.click(screen.getByTestId('handoff-continue'))
    const ottoGuess = screen.getByTestId('guess-value').textContent
    expect(ottoGuess).not.toBe(lunaValue)

    await user.click(screen.getByTestId('guess-ready'))
    expect(screen.getByTestId('reveal-screen')).toBeInTheDocument()
    expect(screen.getByTestId('reveal-value')).toBeInTheDocument()
    expect(screen.getByTestId('scoreboard')).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy()
  })

  it('el segundo slider nace en el medio del rango, no en la respuesta previa', () => {
    const mid = snapToStep(defaultSliderValue(1, 100, 'linear'), 1, 100, 1)
    expect(formatPremiseValue({
      id: 't',
      category: 'animales',
      question: 'x',
      value: 10,
      unit: 'u',
      unitLabel: 'u',
      min: 1,
      max: 100,
      step: 1,
      scale: 'linear',
      source: { name: 'n', url: 'https://example.com' },
    }, mid)).toBeTruthy()
  })
})
