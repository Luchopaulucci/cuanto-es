import { describe, expect, it } from 'vitest'
import {
  GUESS_READY_GAP_PX,
  SLIDER_THUMB_SIZE_PX,
  defaultSliderValue,
  fillHeightCss,
  nudgeValue,
  pointerYToT,
  snapToStep,
  tToValue,
  thumbBottomCss,
  thumbEdgesInSlider,
  valueToT,
} from './slider'

describe('slider mapping', () => {
  it('el medio lineal cae a mitad de rango', () => {
    expect(tToValue(0.5, 0, 100, 'linear')).toBeCloseTo(50)
    expect(valueToT(50, 0, 100, 'linear')).toBeCloseTo(0.5)
  })

  it('el medio log es la media geométrica', () => {
    expect(tToValue(0.5, 1, 100, 'log')).toBeCloseTo(10)
    expect(valueToT(10, 1, 100, 'log')).toBeCloseTo(0.5)
    expect(tToValue(0, 1, 100, 'log')).toBeCloseTo(1)
    expect(tToValue(1, 1, 100, 'log')).toBeCloseTo(100)
  })

  it('valueToT y tToValue se invierten', () => {
    const v = tToValue(0.37, 2, 8000, 'log')
    expect(valueToT(v, 2, 8000, 'log')).toBeCloseTo(0.37)
  })

  it('el valor neutral es siempre el medio del rango', () => {
    expect(defaultSliderValue(10, 20, 'linear')).toBeCloseTo(15)
    expect(defaultSliderValue(1, 100, 'log')).toBeCloseTo(10)
  })

  it('snap y nudge respetan min/max/step', () => {
    expect(snapToStep(13.2, 0, 20, 1)).toBe(13)
    expect(nudgeValue(10, 1, 0, 20, 1, 'linear')).toBe(11)
    expect(nudgeValue(0, -1, 0, 20, 1, 'linear')).toBe(0)
  })
})

describe('recorrido del thumb', () => {
  const sliderHeight = 200

  it('descuenta la mitad del thumb arriba y abajo y no se sale', () => {
    const min = thumbEdgesInSlider(0, sliderHeight)
    expect(min.bottom).toBe(0)
    expect(min.top).toBe(SLIDER_THUMB_SIZE_PX)
    expect(min.top).toBeLessThanOrEqual(sliderHeight)

    const max = thumbEdgesInSlider(1, sliderHeight)
    expect(max.bottom).toBe(sliderHeight - SLIDER_THUMB_SIZE_PX)
    expect(max.top).toBe(sliderHeight)
    expect(max.bottom).toBeGreaterThanOrEqual(0)

    const mid = thumbEdgesInSlider(0.5, sliderHeight)
    expect(mid.bottom).toBe((sliderHeight - SLIDER_THUMB_SIZE_PX) / 2)
    expect(mid.top).toBeLessThanOrEqual(sliderHeight)
  })

  it('el pointer mapea el centro del thumb, no el borde de la pista', () => {
    const rect = { top: 0, bottom: sliderHeight, height: sliderHeight }
    expect(pointerYToT(sliderHeight - SLIDER_THUMB_SIZE_PX / 2, rect)).toBeCloseTo(0)
    expect(pointerYToT(SLIDER_THUMB_SIZE_PX / 2, rect)).toBeCloseTo(1)
    expect(pointerYToT(sliderHeight, rect)).toBe(0)
    expect(pointerYToT(0, rect)).toBe(1)
  })

  it('el CSS del thumb y el fill usan el inset', () => {
    expect(thumbBottomCss(0)).toBe(`calc(0 * (100% - ${SLIDER_THUMB_SIZE_PX}px))`)
    expect(thumbBottomCss(1)).toBe(`calc(1 * (100% - ${SLIDER_THUMB_SIZE_PX}px))`)
    expect(fillHeightCss(0)).toBe(
      `calc(0 * (100% - ${SLIDER_THUMB_SIZE_PX}px) + ${SLIDER_THUMB_SIZE_PX / 2}px)`,
    )
    expect(GUESS_READY_GAP_PX).toBeGreaterThanOrEqual(32)
  })

  it('en 360x640 el thumb mínimo queda 32px arriba de Listo', () => {
    const viewportH = 640
    const safeTop = 24
    const safeBottom = 16
    const chrome =
      safeTop +
      safeBottom +
      20 +
      24 +
      40 +
      72 +
      110 +
      16 +
      GUESS_READY_GAP_PX +
      56
    const sliderHeight = viewportH - chrome
    expect(sliderHeight).toBeGreaterThanOrEqual(SLIDER_THUMB_SIZE_PX)
    const min = thumbEdgesInSlider(0, sliderHeight)
    expect(min.bottom).toBe(0)
    expect(min.top).toBeLessThanOrEqual(sliderHeight)
    expect(GUESS_READY_GAP_PX).toBeGreaterThanOrEqual(32)
  })
})
