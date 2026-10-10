import { describe, expect, it } from 'vitest'
import type { Premise } from './types'
import { createGameReducer, createInitialState, eligiblePremises } from './reducer'

const premises: Premise[] = [
  {
    id: 'one',
    category: 'animales',
    question: '¿Uno?',
    value: 10,
    unit: 'kg',
    unitLabel: 'kg',
    min: 1,
    max: 100,
    step: 1,
    scale: 'linear',
    source: { name: 'x', url: 'https://example.com' },
  },
  {
    id: 'hot',
    category: 'cuerpo-asco',
    question: '¿Picante?',
    value: 2,
    unit: 'x',
    unitLabel: 'x',
    min: 1,
    max: 10,
    step: 1,
    scale: 'linear',
    picante: true,
    source: { name: 'x', url: 'https://example.com' },
  },
]

const reduce = createGameReducer({
  random: () => 0,
  premises,
  now: () => 1,
})

function withTwoPlayers() {
  let s = createInitialState()
  s = reduce(s, { type: 'ADD_PLAYER', name: 'Luna' })
  s = reduce(s, { type: 'ADD_PLAYER', name: 'Otto' })
  return s
}

describe('gameReducer', () => {
  it('no arranca con menos de 2', () => {
    let s = createInitialState()
    s = reduce(s, { type: 'ADD_PLAYER', name: 'Luna' })
    s = reduce(s, { type: 'START' })
    expect(s.phase).toBe('setup')
  })

  it('arranca en el pase de celu, no en el slider', () => {
    let s = withTwoPlayers()
    s = reduce(s, { type: 'START' })
    expect(s.phase).toBe('handoff')
    expect(s.currentPlayerIndex).toBe(0)
    expect(s.guesses).toEqual({})
    expect(s.currentPremiseId).toBe('one')
  })

  it('después de confirmar, el slider no hereda el número anterior', () => {
    let s = withTwoPlayers()
    s = reduce(s, { type: 'START' })
    s = reduce(s, { type: 'CONFIRM_HANDOFF' })
    expect(s.phase).toBe('guess')
    s = reduce(s, { type: 'SUBMIT_GUESS', value: 88 })
    expect(s.phase).toBe('handoff')
    expect(s.currentPlayerIndex).toBe(1)
    expect(s.guesses[s.players[0].id]).toBe(88)
    expect(s.guesses[s.players[1].id]).toBeUndefined()
    s = reduce(s, { type: 'CONFIRM_HANDOFF' })
    expect(s.phase).toBe('guess')
    expect(Object.keys(s.guesses)).toEqual([s.players[0].id])
  })

  it('recién revela cuando todos respondieron y asigna puntos', () => {
    let s = withTwoPlayers()
    s = reduce(s, { type: 'SET_ROUNDS', rounds: 3 })
    s = reduce(s, { type: 'START' })
    s = reduce(s, { type: 'CONFIRM_HANDOFF' })
    s = reduce(s, { type: 'SUBMIT_GUESS', value: 10 })
    expect(s.phase).toBe('handoff')
    s = reduce(s, { type: 'CONFIRM_HANDOFF' })
    s = reduce(s, { type: 'SUBMIT_GUESS', value: 40 })
    expect(s.phase).toBe('reveal')
    expect(s.lastResult?.[0].points).toBe(3)
    expect(s.scores[s.players[0].id]).toBe(3)
  })

  it('LOCK_HANDOFF tapa el slider si alguien aprieta atrás', () => {
    let s = withTwoPlayers()
    s = reduce(s, { type: 'START' })
    s = reduce(s, { type: 'CONFIRM_HANDOFF' })
    s = reduce(s, { type: 'LOCK_HANDOFF' })
    expect(s.phase).toBe('handoff')
  })

  it('va al podio al terminar las rondas y play again conserva nombres', () => {
    let s = withTwoPlayers()
    s = reduce(s, { type: 'SET_ROUNDS', rounds: 3 })
    s = reduce(s, { type: 'START' })
    for (let r = 0; r < 3; r += 1) {
      s = reduce(s, { type: 'CONFIRM_HANDOFF' })
      s = reduce(s, { type: 'SUBMIT_GUESS', value: 10 })
      s = reduce(s, { type: 'CONFIRM_HANDOFF' })
      s = reduce(s, { type: 'SUBMIT_GUESS', value: 11 })
      if (r < 2) s = reduce(s, { type: 'NEXT_AFTER_REVEAL' })
    }
    s = reduce(s, { type: 'NEXT_AFTER_REVEAL' })
    expect(s.phase).toBe('podium')
    s = reduce(s, { type: 'PLAY_AGAIN' })
    expect(s.phase).toBe('setup')
    expect(s.players.map((p) => p.name)).toEqual(['Luna', 'Otto'])
    expect(s.scores).toEqual({})
  })

  it('esconde premisas picantes si el modo está apagado', () => {
    expect(eligiblePremises(premises, ['animales', 'cuerpo-asco'], false).map((p) => p.id)).toEqual([
      'one',
    ])
    expect(eligiblePremises(premises, ['cuerpo-asco'], true).map((p) => p.id)).toEqual(['hot'])
  })
})
