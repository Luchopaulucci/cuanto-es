import { getPremise } from './data/catalog'
import { GuessScreen } from './components/GuessScreen'
import { HandoffScreen } from './components/HandoffScreen'
import { PodiumScreen } from './components/PodiumScreen'
import { RevealScreen } from './components/RevealScreen'
import { SetupScreen } from './components/SetupScreen'
import { GameProvider } from './game/GameProvider'
import { useGameDispatch, useGameState } from './game/useGame'
import { MIN_PLAYERS } from './game/types'

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  )
}

function GameApp() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const player = state.players[state.currentPlayerIndex]
  const premise = state.currentPremiseId
    ? getPremise(state.currentPremiseId)
    : undefined

  if (state.phase === 'setup') {
    return (
      <SetupScreen
        players={state.players}
        roundsTotal={state.roundsTotal}
        selectedCategories={state.selectedCategories}
        picante={state.picante}
        onAdd={(name) => dispatch({ type: 'ADD_PLAYER', name })}
        onRemove={(id) => dispatch({ type: 'REMOVE_PLAYER', id })}
        onRename={(id, name) => dispatch({ type: 'RENAME_PLAYER', id, name })}
        onColor={(id, color) => dispatch({ type: 'SET_COLOR', id, color })}
        onRounds={(rounds) => dispatch({ type: 'SET_ROUNDS', rounds })}
        onToggleCategory={(category) => dispatch({ type: 'TOGGLE_CATEGORY', category })}
        onTogglePicante={() => dispatch({ type: 'TOGGLE_PICANTE' })}
        onStart={() => dispatch({ type: 'START' })}
        error={
          state.players.length < MIN_PLAYERS
            ? `Hace falta ${MIN_PLAYERS} jugadores como mínimo.`
            : undefined
        }
      />
    )
  }

  if (state.phase === 'handoff' && player) {
    return (
      <HandoffScreen
        player={player}
        onReady={() => dispatch({ type: 'CONFIRM_HANDOFF' })}
      />
    )
  }

  if (state.phase === 'guess' && player && premise) {
    return (
      <GuessScreen
        key={`${state.roundIndex}-${player.id}`}
        player={player}
        premise={premise}
        roundLabel={`Ronda ${state.roundIndex + 1} de ${state.roundsTotal}`}
        onSubmit={(value) => dispatch({ type: 'SUBMIT_GUESS', value })}
      />
    )
  }

  if (state.phase === 'reveal' && premise && state.lastResult) {
    const lastRound = state.roundIndex + 1 >= state.roundsTotal
    return (
      <RevealScreen
        premise={premise}
        players={state.players}
        guesses={state.guesses}
        awards={state.lastResult}
        scores={state.scores}
        onNext={() => dispatch({ type: 'NEXT_AFTER_REVEAL' })}
        nextLabel={lastRound ? 'Ver el podio' : 'Siguiente ronda'}
      />
    )
  }

  if (state.phase === 'podium') {
    return (
      <PodiumScreen
        players={state.players}
        scores={state.scores}
        onAgain={() => dispatch({ type: 'PLAY_AGAIN' })}
      />
    )
  }

  return (
    <main className="safe-area-screen screen-min-h flex items-center justify-center px-6">
      <p>Algo se rompió. Recargá y empezá de nuevo.</p>
    </main>
  )
}
