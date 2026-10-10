import { useContext, type Dispatch } from 'react'
import { GameDispatchContext, GameStateContext } from './game-context'
import type { GameAction, GameState } from './types'

export function useGameState(): GameState {
  const ctx = useContext(GameStateContext)
  if (!ctx) throw new Error('useGameState fuera del provider')
  return ctx
}

export function useGameDispatch(): Dispatch<GameAction> {
  const ctx = useContext(GameDispatchContext)
  if (!ctx) throw new Error('useGameDispatch fuera del provider')
  return ctx
}
