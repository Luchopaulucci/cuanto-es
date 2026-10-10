import { describe, expect, it } from 'vitest'
import { createInitialState } from './reducer'
import { clearState, loadState, parseState, saveState, STORAGE_KEY } from './persist'

describe('persistencia', () => {
  it('guarda y recupera una partida', () => {
    const storage = window.localStorage
    storage.clear()
    const state = {
      ...createInitialState(),
      phase: 'handoff' as const,
      currentPremiseId: 'one',
      players: [{ id: 'p1', name: 'Luna', color: '#123456' }],
    }
    saveState(state, storage)
    expect(storage.getItem(STORAGE_KEY)).toBeTruthy()
    const loaded = loadState(storage)
    expect(loaded?.currentPremiseId).toBe('one')
    expect(loaded?.players[0].name).toBe('Luna')
    clearState(storage)
    expect(loadState(storage)).toBeNull()
  })

  it('si recargás en el slider, volvés al pase de celu sin mostrar valores', () => {
    const raw = JSON.stringify({
      ...createInitialState(),
      phase: 'guess',
      currentPremiseId: 'one',
      currentPlayerIndex: 1,
      players: [
        { id: 'a', name: 'Luna', color: '#111' },
        { id: 'b', name: 'Otto', color: '#222' },
      ],
      guesses: { a: 9999 },
    })
    const restored = parseState(raw)
    expect(restored?.phase).toBe('handoff')
    expect(restored?.currentPlayerIndex).toBe(1)
    expect(restored?.guesses.a).toBe(9999)
  })

  it('tira basura inválida', () => {
    expect(parseState('no-json')).toBeNull()
    expect(parseState('{"phase":"nope"}')).toBeNull()
  })
})
