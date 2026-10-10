import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { PREMISES } from '../data/catalog'
import { GameDispatchContext, GameStateContext } from './game-context'
import { consumeBackButton, hardenHistory } from './privacy'
import { loadState, saveState } from './persist'
import { createGameReducer, createInitialState } from './reducer'
import type { GameState } from './types'

function now(): number {
  return Date.now()
}

function rng(): number {
  return Math.random()
}

export function GameProvider({
  children,
  premises = PREMISES,
  initialState,
}: {
  children: ReactNode
  premises?: typeof PREMISES
  initialState?: GameState
}) {
  const reducer = useMemo(
    () =>
      createGameReducer({
        random: rng,
        premises,
        now,
      }),
    [premises],
  )

  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => initialState ?? loadState() ?? createInitialState(),
  )

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    hardenHistory()
    const onPop = () => {
      consumeBackButton()
      dispatch({ type: 'LOCK_HANDOFF' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>{children}</GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
}
