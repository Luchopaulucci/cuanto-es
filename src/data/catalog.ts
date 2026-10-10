import { PREMISES as CLASICAS } from './premises'
import { PREMISES_FIESTA } from './premises-fiesta'
import type { Premise } from '../game/types'

export const PREMISES: Premise[] = [...CLASICAS, ...PREMISES_FIESTA]

export const PREMISES_BY_ID: Record<string, Premise> = Object.fromEntries(
  PREMISES.map((p) => [p.id, p]),
)

export function getPremise(id: string): Premise | undefined {
  return PREMISES_BY_ID[id]
}
