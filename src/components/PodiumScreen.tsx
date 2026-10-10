import type { Player } from '../game/types'
import { Scoreboard } from './Scoreboard'

type Props = {
  players: Player[]
  scores: Record<string, number>
  onAgain: () => void
}

export function PodiumScreen({ players, scores, onAgain }: Props) {
  const ranked = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
  const first = ranked[0]
  const second = ranked[1]
  const third = ranked[2]

  return (
    <main
      data-testid="podium-screen"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-10 pb-8"
    >
      <p className="text-sm font-semibold tracking-widest text-gold uppercase">
        Se terminó
      </p>
      <h1 className="font-display mt-2 text-4xl font-semibold">El podio</h1>

      <div className="mt-10 flex items-end justify-center gap-3">
        {second && (
          <PodiumBlock place={2} player={second} score={scores[second.id] ?? 0} h="h-28" />
        )}
        {first && (
          <PodiumBlock place={1} player={first} score={scores[first.id] ?? 0} h="h-40" />
        )}
        {third && (
          <PodiumBlock place={3} player={third} score={scores[third.id] ?? 0} h="h-20" />
        )}
      </div>

      <h2 className="mt-10 mb-2 text-sm font-bold tracking-wide text-gold uppercase">
        Todos
      </h2>
      <Scoreboard players={players} scores={scores} />

      <button
        type="button"
        data-testid="play-again"
        onClick={onAgain}
        className="mt-8 min-h-14 w-full rounded-full bg-gold text-lg font-bold text-ink"
      >
        Otra partida
      </button>
    </main>
  )
}

function PodiumBlock({
  place,
  player,
  score,
  h,
}: {
  place: number
  player: Player
  score: number
  h: string
}) {
  return (
    <div className="flex w-24 flex-col items-center">
      <p className="mb-2 text-center font-bold wrap-anywhere">{player.name}</p>
      <div
        className={`flex ${h} w-full items-end justify-center rounded-t-2xl pb-3 font-display text-3xl font-semibold`}
        style={{ background: player.color }}
      >
        {place}
      </div>
      <p className="tabular mt-1 text-sm text-mist">{score} pts</p>
    </div>
  )
}
