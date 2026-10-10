import { useEffect, useState } from 'react'
import { formatErrorPct, formatPremiseValue, winnerHeadline } from '../game/format'
import { disputedNote, isYearPremise } from '../game/scoring'
import type { Award, Player, Premise } from '../game/types'
import { NumberLine } from './NumberLine'
import { Scoreboard } from './Scoreboard'

type Props = {
  premise: Premise
  players: Player[]
  guesses: Record<string, number>
  awards: Award[]
  scores: Record<string, number>
  onNext: () => void
  nextLabel: string
}

export function RevealScreen({
  premise,
  players,
  guesses,
  awards,
  scores,
  onNext,
  nextLabel,
}: Props) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(premise.value)

  useEffect(() => {
    if (reduce) return
    const start = performance.now()
    const from = premise.min
    const to = premise.value
    let frame = requestAnimationFrame((now) => {
      const step = (stamp: number) => {
        const t = Math.min(1, (stamp - start) / 900)
        const eased = 1 - (1 - t) ** 3
        setShown(from + (to - from) * eased)
        if (t < 1) frame = requestAnimationFrame(step)
        else setShown(to)
      }
      step(now)
    })
    return () => cancelAnimationFrame(frame)
  }, [premise.min, premise.value, reduce])

  const winners = awards.filter((a) => a.rank === 1)
  const winnerNames = players
    .filter((p) => winners.some((w) => w.playerId === p.id))
    .map((p) => p.name)
  const note = disputedNote(premise)

  return (
    <main
      data-testid="reveal-screen"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-8 pb-8"
    >
      <p className="text-sm font-semibold tracking-widest text-gold uppercase">
        El valor real
      </p>
      <h1 className="font-display mt-3 text-2xl leading-tight font-medium">
        {premise.question}
      </h1>
      <p
        data-testid="reveal-value"
        className="tabular font-display mt-6 text-6xl leading-none font-semibold"
      >
        {formatPremiseValue(premise, shown)}
      </p>
      <p className="mt-1 text-xl text-mist">{premise.unitLabel}</p>
      {note && (
        <p data-testid="disputed-note" className="mt-3 text-gold italic">
          {note}
        </p>
      )}
      <a
        href={premise.source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 text-sm text-mist underline"
      >
        Fuente: {premise.source.name}
      </a>

      <p data-testid="winner-headline" className="mt-6 text-xl font-bold">
        {winnerHeadline(winnerNames)}
      </p>
      <ul className="mt-2 text-sm text-mist">
        {awards.map((a) => {
          const name = players.find((p) => p.id === a.playerId)?.name
          return (
            <li key={a.playerId}>
              {name}: {a.points} pts ·{' '}
              {isYearPremise(premise)
                ? `${Math.abs((guesses[a.playerId] ?? 0) - premise.value)} años`
                : `error ${formatErrorPct(a.error, premise.scale)}`}
            </li>
          )
        })}
      </ul>

      <NumberLine
        premise={premise}
        players={players}
        guesses={guesses}
        winnerIds={winners.map((w) => w.playerId)}
      />

      <h2 className="mt-8 mb-2 text-sm font-bold tracking-wide text-gold uppercase">
        Tabla
      </h2>
      <Scoreboard players={players} scores={scores} />

      <button
        type="button"
        data-testid="reveal-next"
        onClick={onNext}
        className="mt-8 min-h-14 w-full rounded-full bg-pink text-lg font-bold text-ink"
      >
        {nextLabel}
      </button>
    </main>
  )
}
