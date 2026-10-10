import { nextPlayerColor } from './colors'
import { coerceToHandoff } from './privacy'
import { awardPoints, premiseError } from './scoring'
import {
  CATEGORIES,
  DEFAULT_ROUNDS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Category,
  type GameAction,
  type GameState,
  type Premise,
  type ReducerDeps,
} from './types'

export function createInitialState(): GameState {
  return {
    phase: 'setup',
    players: [],
    scores: {},
    roundsTotal: DEFAULT_ROUNDS,
    roundIndex: 0,
    selectedCategories: [...CATEGORIES],
    picante: false,
    usedPremiseIds: [],
    currentPremiseId: null,
    currentPlayerIndex: 0,
    guesses: {},
    lastResult: null,
  }
}

export function createGameReducer(deps: ReducerDeps) {
  return function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case 'HYDRATE':
        return coerceToHandoff(action.state)
      case 'RESET':
        return createInitialState()
      case 'ADD_PLAYER':
        return addPlayer(state, action.name, action.color, deps)
      case 'REMOVE_PLAYER':
        return {
          ...state,
          players: state.players.filter((p) => p.id !== action.id),
        }
      case 'RENAME_PLAYER':
        return {
          ...state,
          players: state.players.map((p) =>
            p.id === action.id ? { ...p, name: action.name.slice(0, 18) } : p,
          ),
        }
      case 'SET_COLOR':
        return {
          ...state,
          players: state.players.map((p) =>
            p.id === action.id ? { ...p, color: action.color } : p,
          ),
        }
      case 'SET_ROUNDS':
        return {
          ...state,
          roundsTotal: clampRounds(action.rounds),
        }
      case 'TOGGLE_CATEGORY':
        return toggleCategory(state, action.category)
      case 'TOGGLE_PICANTE':
        return { ...state, picante: !state.picante }
      case 'START':
        return startGame(state, deps)
      case 'CONFIRM_HANDOFF':
        if (state.phase !== 'handoff') return state
        return { ...state, phase: 'guess' }
      case 'SUBMIT_GUESS':
        return submitGuess(state, action.value, deps)
      case 'LOCK_HANDOFF':
        return coerceToHandoff(state)
      case 'NEXT_AFTER_REVEAL':
        return nextAfterReveal(state, deps)
      case 'PLAY_AGAIN':
        return playAgain(state)
      default:
        return state
    }
  }
}

export function eligiblePremises(
  premises: Premise[],
  selected: Category[],
  picante: boolean,
): Premise[] {
  const cats = selected.length ? selected : [...CATEGORIES]
  return premises.filter((p) => {
    if (!cats.includes(p.category)) return false
    if (p.picante && !picante) return false
    return true
  })
}

function addPlayer(
  state: GameState,
  rawName: string,
  color: string | undefined,
  deps: ReducerDeps,
): GameState {
  if (state.phase !== 'setup') return state
  if (state.players.length >= MAX_PLAYERS) return state
  const name = rawName.trim().slice(0, 18)
  if (!name) return state
  const taken = state.players.some(
    (p) => p.name.toLocaleLowerCase('es-AR') === name.toLocaleLowerCase('es-AR'),
  )
  if (taken) return state
  const id = `p-${deps.now()}-${state.players.length}`
  const nextColor = color ?? nextPlayerColor(state.players.map((p) => p.color))
  return {
    ...state,
    players: [...state.players, { id, name, color: nextColor }],
  }
}

function toggleCategory(state: GameState, category: Category): GameState {
  const has = state.selectedCategories.includes(category)
  const selectedCategories = has
    ? state.selectedCategories.filter((c) => c !== category)
    : [...state.selectedCategories, category]
  return { ...state, selectedCategories }
}

function startGame(state: GameState, deps: ReducerDeps): GameState {
  if (state.players.length < MIN_PLAYERS || state.players.length > MAX_PLAYERS) {
    return state
  }
  const premiseId = pickPremise(state, deps, [])
  if (!premiseId) return state
  const scores = Object.fromEntries(state.players.map((p) => [p.id, 0]))
  return {
    ...state,
    phase: 'handoff',
    scores,
    roundIndex: 0,
    usedPremiseIds: [premiseId],
    currentPremiseId: premiseId,
    currentPlayerIndex: 0,
    guesses: {},
    lastResult: null,
  }
}

function submitGuess(state: GameState, value: number, deps: ReducerDeps): GameState {
  if (state.phase !== 'guess') return state
  const player = state.players[state.currentPlayerIndex]
  const premise = deps.premises.find((p) => p.id === state.currentPremiseId)
  if (!player || !premise) return state

  const guesses = { ...state.guesses, [player.id]: value }
  const last = state.currentPlayerIndex >= state.players.length - 1
  if (!last) {
    return {
      ...state,
      guesses,
      currentPlayerIndex: state.currentPlayerIndex + 1,
      phase: 'handoff',
    }
  }

  const awards = awardPoints(
    state.players.map((p) => ({
      playerId: p.id,
      error: premiseError(guesses[p.id], premise),
    })),
  )
  const scores = { ...state.scores }
  for (const a of awards) {
    scores[a.playerId] = (scores[a.playerId] ?? 0) + a.points
  }
  return {
    ...state,
    guesses,
    lastResult: awards,
    scores,
    phase: 'reveal',
  }
}

function nextAfterReveal(state: GameState, deps: ReducerDeps): GameState {
  if (state.phase !== 'reveal') return state
  const nextRound = state.roundIndex + 1
  if (nextRound >= state.roundsTotal) {
    return { ...state, phase: 'podium' }
  }
  const premiseId = pickPremise(state, deps, state.usedPremiseIds)
  if (!premiseId) return { ...state, phase: 'podium' }
  return {
    ...state,
    phase: 'handoff',
    roundIndex: nextRound,
    usedPremiseIds: [...state.usedPremiseIds, premiseId],
    currentPremiseId: premiseId,
    currentPlayerIndex: 0,
    guesses: {},
    lastResult: null,
  }
}

function playAgain(state: GameState): GameState {
  return {
    ...createInitialState(),
    players: state.players,
    roundsTotal: state.roundsTotal,
    selectedCategories: state.selectedCategories,
    picante: state.picante,
  }
}

function pickPremise(
  state: GameState,
  deps: ReducerDeps,
  used: string[],
): string | null {
  const pool = eligiblePremises(deps.premises, state.selectedCategories, state.picante)
  if (pool.length === 0) return null
  const fresh = pool.filter((p) => !used.includes(p.id))
  const list = fresh.length ? fresh : pool
  const idx = Math.floor(deps.random() * list.length)
  return list[idx]?.id ?? null
}

function clampRounds(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_ROUNDS
  return Math.min(20, Math.max(3, Math.round(n)))
}

export const gameReducer = createGameReducer({
  random: Math.random,
  premises: [],
  now: () => Date.now(),
})
