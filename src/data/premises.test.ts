import { describe, expect, it } from 'vitest'
import { CATEGORIES, DISPUTED_NOTE } from '../game/types'
import { disputedNote } from '../game/scoring'
import { PREMISES } from './catalog'
import { PREMISES_FIESTA } from './premises-fiesta'

const FIESTA_CATS = new Set([
  'cuerpo-asco',
  'cosas-raras',
  'argentinidad',
  'animales-bizarros',
  'en-que-anio',
])

describe('validación de premisas', () => {
  it('tiene al menos 80 premisas y todas las categorías', () => {
    expect(PREMISES.length).toBeGreaterThanOrEqual(80)
    for (const cat of CATEGORIES) {
      expect(PREMISES.some((p) => p.category === cat), cat).toBe(true)
    }
  })

  it('cada premisa tiene valor en rango, unidad y fuente', () => {
    const ids = new Set<string>()
    for (const p of PREMISES) {
      expect(p.id, 'id').toBeTruthy()
      expect(ids.has(p.id), `id duplicado ${p.id}`).toBe(false)
      ids.add(p.id)
      expect(p.question.endsWith('?') || p.question.includes('¿')).toBe(true)
      expect(p.unit.length).toBeGreaterThan(0)
      expect(p.source.name.length).toBeGreaterThan(0)
      expect(p.source.url.startsWith('http')).toBe(true)
      expect(p.max).toBeGreaterThan(p.min)
      expect(p.step).toBeGreaterThan(0)
      expect(p.value).toBeGreaterThanOrEqual(p.min)
      expect(p.value).toBeLessThanOrEqual(p.max)
      if (p.scale === 'log') {
        expect(p.min).toBeGreaterThan(0)
        expect(p.max).toBeGreaterThan(0)
        expect(p.value).toBeGreaterThan(0)
      }
    }
  })

  it('hay 60+ premisas de fiesta con tono partido', () => {
    const fiesta = PREMISES_FIESTA.filter((p) => FIESTA_CATS.has(p.category))
    expect(fiesta.length).toBeGreaterThanOrEqual(60)
  })

  it('toda premisa en disputa tiene la nota visible y una fuente', () => {
    const disputed = PREMISES.filter((p) => p.disputed)
    expect(disputed.length).toBeGreaterThan(0)
    for (const p of disputed) {
      expect(disputedNote(p)).toBe(DISPUTED_NOTE)
      expect(p.source.name.length).toBeGreaterThan(0)
      expect(p.source.url.startsWith('http')).toBe(true)
    }
    expect(disputedNote(PREMISES.find((p) => !p.disputed)!)).toBeNull()
  })
})
