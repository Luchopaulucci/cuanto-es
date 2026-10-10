import { formatPremiseValue } from '../game/format'
import { valueToT } from '../game/slider'
import type { Player, Premise } from '../game/types'

type Props = {
  premise: Premise
  players: Player[]
  guesses: Record<string, number>
  winnerIds: string[]
}

export function NumberLine({ premise, players, guesses, winnerIds }: Props) {
  const marks = [
    ...players.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      value: guesses[p.id],
      kind: 'guess' as const,
    })),
    {
      id: 'true',
      name: 'Real',
      color: '#f5d56a',
      value: premise.value,
      kind: 'true' as const,
    },
  ]

  return (
    <div data-testid="number-line" className="mt-6">
      <div className="relative h-3 rounded-full bg-white/15">
        {marks.map((m) => {
          const t = valueToT(m.value, premise.min, premise.max, premise.scale)
          const winner = m.kind === 'guess' && winnerIds.includes(m.id)
          return (
            <span
              key={m.id}
              title={`${m.name}: ${formatPremiseValue(premise, m.value)}`}
              className={`absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink ${
                winner ? 'scale-125 ring-2 ring-gold' : ''
              }`}
              style={{ left: `${t * 100}%`, background: m.color }}
            />
          )
        })}
      </div>
      <ul className="mt-4 space-y-1 text-sm">
        {players.map((p) => (
          <li key={p.id} className="flex justify-between gap-3">
            <span className={winnerIds.includes(p.id) ? 'font-bold text-gold' : ''}>
              {p.name}
            </span>
            <span className="tabular">
              {formatPremiseValue(premise, guesses[p.id])} {premise.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
