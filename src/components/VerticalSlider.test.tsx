import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { VerticalSlider } from './VerticalSlider'

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../index.css'),
  'utf8',
)

afterEach(() => cleanup())

const props = {
  min: 0,
  max: 100,
  step: 1,
  scale: 'linear' as const,
  value: 50,
  color: '#fff',
  label: 'Tu número',
}

describe('VerticalSlider touch', () => {
  it('el CSS fija touch-action none en slider, track y thumb', () => {
    expect(css).toMatch(/\.vertical-slider[\s\S]*touch-action:\s*none/)
    expect(css).toMatch(/\.vertical-slider-track[\s\S]*touch-action:\s*none/)
    expect(css).toMatch(/\.vertical-slider-thumb[\s\S]*touch-action:\s*none/)
    expect(css).toMatch(/overscroll-behavior:\s*none/)

    render(<VerticalSlider {...props} onChange={() => {}} />)
    expect(screen.getByTestId('vertical-slider')).toHaveClass('vertical-slider', 'touch-none')
    expect(screen.getByTestId('vertical-slider-track')).toHaveClass('vertical-slider-track')
    expect(screen.getByTestId('vertical-slider-thumb')).toHaveClass('vertical-slider-thumb')
  })

  it('engancha pointermove/touchmove no pasivos y preventDefault al arrastrar', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'addEventListener')
    const onChange = vi.fn()
    render(<VerticalSlider {...props} onChange={onChange} />)

    const nonPassive = spy.mock.calls.filter(
      ([type, , options]) =>
        (type === 'pointermove' || type === 'touchmove') &&
        typeof options === 'object' &&
        options !== null &&
        options.passive === false,
    )
    expect(nonPassive.some(([type]) => type === 'pointermove')).toBe(true)
    expect(nonPassive.some(([type]) => type === 'touchmove')).toBe(true)
    spy.mockRestore()

    const slider = screen.getByTestId('vertical-slider')
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 200,
      height: 200,
      left: 0,
      right: 80,
      width: 80,
      x: 0,
      y: 0,
      toJSON: () => {},
    })

    slider.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        pointerId: 7,
        clientY: 100,
      }),
    )
    expect(onChange).toHaveBeenCalled()

    const move = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      pointerId: 7,
      clientY: 40,
    })
    const prevent = vi.spyOn(move, 'preventDefault')
    slider.dispatchEvent(move)
    expect(prevent).toHaveBeenCalled()
  })
})
