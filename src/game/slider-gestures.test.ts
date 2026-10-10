import { describe, expect, it, vi } from 'vitest'
import {
  SLIDER_MOVE_LISTENER_OPTIONS,
  attachNonPassiveSliderListeners,
  preventIfDragging,
} from './slider-gestures'

describe('slider gestures', () => {
  it('registra pointermove y touchmove como { passive: false }', () => {
    const el = document.createElement('div')
    const spy = vi.spyOn(el, 'addEventListener')
    const stop = attachNonPassiveSliderListeners(el, {
      dragging: { current: false },
      applyClientY: () => {},
    })

    const moveOpts = spy.mock.calls
      .filter(([type]) => type === 'pointermove' || type === 'touchmove')
      .map(([type, , options]) => ({ type, options }))

    expect(SLIDER_MOVE_LISTENER_OPTIONS).toEqual({ passive: false })
    expect(moveOpts).toEqual([
      { type: 'pointermove', options: { passive: false } },
      { type: 'touchmove', options: { passive: false } },
    ])
    stop()
    spy.mockRestore()
  })

  it('preventDefault solo mientras se arrastra', () => {
    const idle = new Event('pointermove', { cancelable: true })
    const idleSpy = vi.spyOn(idle, 'preventDefault')
    preventIfDragging(idle, false)
    expect(idleSpy).not.toHaveBeenCalled()

    const drag = new Event('pointermove', { cancelable: true })
    const dragSpy = vi.spyOn(drag, 'preventDefault')
    preventIfDragging(drag, true)
    expect(dragSpy).toHaveBeenCalled()
  })

  it('al mover con pointer capture llama preventDefault y applyClientY', () => {
    const el = document.createElement('div')
    const applyClientY = vi.fn()
    const dragging = { current: false }
    const stop = attachNonPassiveSliderListeners(el, { dragging, applyClientY })

    el.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        pointerId: 1,
        clientY: 120,
      }),
    )
    expect(dragging.current).toBe(true)
    expect(applyClientY).toHaveBeenCalledWith(120)

    const move = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      clientY: 80,
    })
    const moveSpy = vi.spyOn(move, 'preventDefault')
    el.dispatchEvent(move)
    expect(moveSpy).toHaveBeenCalled()
    expect(applyClientY).toHaveBeenCalledWith(80)

    const touch = new Event('touchmove', {
      bubbles: true,
      cancelable: true,
    }) as TouchEvent
    Object.defineProperty(touch, 'touches', {
      value: [{ clientX: 10, clientY: 40 }],
    })
    const touchSpy = vi.spyOn(touch, 'preventDefault')
    el.dispatchEvent(touch)
    expect(touchSpy).toHaveBeenCalled()
    expect(applyClientY).toHaveBeenCalledWith(40)

    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
    expect(dragging.current).toBe(false)
    stop()
  })
})
