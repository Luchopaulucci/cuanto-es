import type { Player } from '../game/types'

type Props = {
  players: Player[]
  scores: Record<string, number>
}

export function Scoreboard({ players, scores }: Props) {
  const ranked = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
  return (
    <ol data-testid="scoreboard" className="space-y-2">
      {ranked.map((p, i) => (
        <li
          key={p.id}
          className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-2"
        >
          <span className="flex items-center gap-2">
            <span className="tabular w-6 text-gold">{i + 1}.</span>
            <span
              className="size-3 rounded-full"
              style={{ background: p.color }}
            />
            <span className="font-semibold">{p.name}</span>
          </span>
          <span className="tabular font-bold">{scores[p.id] ?? 0}</span>
        </li>
      ))}
    </ol>
  )
}
