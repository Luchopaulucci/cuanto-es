import { describe, expect, it } from 'vitest'
import {
  defaultSliderValue,
  nudgeValue,
  snapToStep,
  tToValue,
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
