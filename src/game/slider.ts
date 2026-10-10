import type { Scale } from './types'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function tToValue(
  t: number,
  min: number,
  max: number,
  scale: Scale,
): number {
  const u = clamp(t, 0, 1)
  if (scale === 'log') {
    if (min <= 0 || max <= 0) {
      throw new Error('La escala log necesita min y max mayores a 0')
    }
    return min * (max / min) ** u
  }
  return min + (max - min) * u
}

export function valueToT(
  value: number,
  min: number,
  max: number,
  scale: Scale,
): number {
  const v = clamp(value, min, max)
  if (scale === 'log') {
    if (min <= 0 || max <= 0) {
      throw new Error('La escala log necesita min y max mayores a 0')
    }
    return Math.log(v / min) / Math.log(max / min)
  }
  if (max === min) return 0
  return (v - min) / (max - min)
}

export function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  if (step <= 0) return clamp(value, min, max)
  const snapped = Math.round((value - min) / step) * step + min
  const rounded = Number(snapped.toFixed(decimalsFromStep(step)))
  return clamp(rounded, min, max)
}

export function decimalsFromStep(step: number): number {
  if (step >= 1) return 0
  const raw = Math.ceil(-Math.log10(step))
  return clamp(raw, 0, 6)
}

export function nudgeValue(
  value: number,
  direction: 1 | -1,
  min: number,
  max: number,
  step: number,
  scale: Scale,
): number {
  if (scale === 'log') {
    const t = valueToT(value, min, max, scale)
    const next = tToValue(t + direction * 0.012, min, max, scale)
    return snapToStep(next, min, max, step)
  }
  return snapToStep(value + direction * step, min, max, step)
}

export function defaultSliderValue(min: number, max: number, scale: Scale): number {
  return tToValue(0.5, min, max, scale)
}
