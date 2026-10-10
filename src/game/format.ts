import { decimalsFromStep } from './slider'
import type { Premise } from './types'

const numberFmtCache = new Map<number, Intl.NumberFormat>()

function formatter(decimals: number): Intl.NumberFormat {
  const cached = numberFmtCache.get(decimals)
  if (cached) return cached
  const fmt = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  })
  numberFmtCache.set(decimals, fmt)
  return fmt
}

export function formatValue(value: number, step: number): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs >= 1e12 || (abs > 0 && abs < 1e-3 && step < 1e-3)) {
    return value.toExponential(2).replace('.', ',')
  }
  return formatter(decimalsFromStep(step)).format(value)
}

export function formatPremiseValue(premise: Premise, value: number): string {
  return formatValue(value, premise.step)
}

export function formatErrorPct(error: number, scale: Premise['scale']): string {
  if (!Number.isFinite(error)) return '—'
  if (scale === 'log') {
    const factor = Math.exp(error)
    if (factor < 1.08) return `${formatValue((factor - 1) * 100, 0.1)}%`
    return `×${formatValue(factor, 0.01)}`
  }
  return `${formatValue(error * 100, 0.1)}%`
}

export function hapticTick(ms = 8): void {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // Algunos navegadores exponen vibrate pero lo rechazan.
  }
}
