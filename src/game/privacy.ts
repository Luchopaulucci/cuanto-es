import type { GameState, Phase } from './types'

const PRE_REVEAL: Phase[] = ['setup', 'handoff', 'guess']

export function isPreReveal(phase: Phase): boolean {
  return PRE_REVEAL.includes(phase)
}

/** Recarga o back: si estaban adivinando, vuelven al pase de celu sin valores. */
export function coerceToHandoff(state: GameState): GameState {
  if (state.phase === 'guess') {
    return { ...state, phase: 'handoff' }
  }
  return state
}

export function publicStateView(state: GameState): GameState {
  const locked = coerceToHandoff(state)
  if (isPreReveal(locked.phase)) {
    return { ...locked, guesses: {}, lastResult: null }
  }
  return locked
}

export function stripLocationToPath(loc: Location = window.location): string {
  return loc.pathname || '/'
}

export function hardenHistory(historyObj: History = window.history): void {
  const path = stripLocationToPath()
  historyObj.replaceState({ cuantoes: 'safe' }, '', path)
}

export function consumeBackButton(historyObj: History = window.history): void {
  const path = stripLocationToPath()
  historyObj.pushState({ cuantoes: 'safe' }, '', path)
}

export function urlLooksClean(loc: Pick<Location, 'search' | 'hash'>): boolean {
  return loc.search === '' && (loc.hash === '' || loc.hash === '#')
}
