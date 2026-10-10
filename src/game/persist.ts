import { CATEGORIES, PHASES, type GameState, type Phase } from './types'
import { coerceToHandoff } from './privacy'

export const STORAGE_KEY = 'cuanto-es-v1'

const PHASE_SET = new Set<string>(PHASES)
const CATEGORY_SET = new Set<string>(CATEGORIES)

export function serializeState(state: GameState): string {
  return JSON.stringify({
    phase: state.phase,
    players: state.players,
    scores: state.scores,
    roundsTotal: state.roundsTotal,
    roundIndex: state.roundIndex,
    selectedCategories: state.selectedCategories,
    picante: state.picante,
    usedPremiseIds: state.usedPremiseIds,
    currentPremiseId: state.currentPremiseId,
    currentPlayerIndex: state.currentPlayerIndex,
    guesses: state.guesses,
    lastResult: state.lastResult,
  } satisfies GameState)
}

export function parseState(raw: string): GameState | null {
  try {
    const data: unknown = JSON.parse(raw)
    const state = asGameState(data)
    if (!state) return null
    return coerceToHandoff(state)
  } catch {
    return null
  }
}

export function saveState(
  state: GameState,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(STORAGE_KEY, serializeState(state))
}

export function loadState(
  storage: Pick<Storage, 'getItem'> = localStorage,
): GameState | null {
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return null
  return parseState(raw)
}

export function clearState(storage: Pick<Storage, 'removeItem'> = localStorage): void {
  storage.removeItem(STORAGE_KEY)
}

function asGameState(data: unknown): GameState | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  if (!PHASE_SET.has(o.phase as string)) return null
  if (!Array.isArray(o.players)) return null
  if (o.players.length > 8) return null
  for (const p of o.players) {
    if (!p || typeof p !== 'object') return null
    const pl = p as Record<string, unknown>
    if (typeof pl.id !== 'string' || typeof pl.name !== 'string' || typeof pl.color !== 'string') {
      return null
    }
  }
  if (typeof o.roundsTotal !== 'number' || typeof o.roundIndex !== 'number') return null
  if (typeof o.currentPlayerIndex !== 'number') return null
  if (!Array.isArray(o.selectedCategories)) return null
  if (!o.selectedCategories.every((c) => CATEGORY_SET.has(c as string))) return null
  if (!Array.isArray(o.usedPremiseIds)) return null
  if (o.currentPremiseId !== null && typeof o.currentPremiseId !== 'string') return null
  if (!o.scores || typeof o.scores !== 'object') return null
  if (!o.guesses || typeof o.guesses !== 'object') return null

  return {
    phase: o.phase as Phase,
    players: o.players as GameState['players'],
    scores: o.scores as GameState['scores'],
    roundsTotal: o.roundsTotal,
    roundIndex: o.roundIndex,
    selectedCategories: o.selectedCategories as GameState['selectedCategories'],
    picante: Boolean(o.picante),
    usedPremiseIds: o.usedPremiseIds as string[],
    currentPremiseId: o.currentPremiseId as string | null,
    currentPlayerIndex: o.currentPlayerIndex,
    guesses: o.guesses as GameState['guesses'],
    lastResult: Array.isArray(o.lastResult) ? (o.lastResult as GameState['lastResult']) : null,
  }
}
