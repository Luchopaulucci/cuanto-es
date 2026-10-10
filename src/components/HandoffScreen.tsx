import { contrastText } from '../game/colors'
import type { Player } from '../game/types'

type Props = {
  player: Player
  onReady: () => void
}

export function HandoffScreen({ player, onReady }: Props) {
  const ink = contrastText(player.color)
  return (
    <main
      data-testid="handoff-screen"
      className="flex min-h-dvh flex-col items-center justify-between px-6 py-10 text-center"
      style={{ background: player.color, color: ink }}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
        Sin mirar
      </p>
      <div className="space-y-4">
        <p className="text-2xl font-medium">Pasá el celu a</p>
        <h1 className="font-display text-6xl leading-none font-semibold tracking-tight wrap-anywhere">
          {player.name}
        </h1>
        <p className="mx-auto max-w-xs text-lg opacity-80">
          Cuando lo tengas en la mano, tocá. Nadie más mira.
        </p>
      </div>
      <button
        type="button"
        data-testid="handoff-continue"
        onClick={onReady}
        className="min-h-14 w-full max-w-sm rounded-full bg-white px-6 text-lg font-bold text-ink shadow-lg"
      >
        Soy {player.name}
      </button>
    </main>
  )
}
