import { useState } from 'react'
import { contrastText } from '../game/colors'
import { formatPremiseValue, hapticTick } from '../game/format'
import { defaultSliderValue, nudgeValue, snapToStep } from '../game/slider'
import type { Player, Premise } from '../game/types'
import { useLockBodyScroll } from '../game/useLockBodyScroll'
import { VerticalSlider } from './VerticalSlider'

type Props = {
  player: Player
  premise: Premise
  roundLabel: string
  onSubmit: (value: number) => void
}

export function GuessScreen({ player, premise, roundLabel, onSubmit }: Props) {
  useLockBodyScroll(true)
  const ink = contrastText(player.color)
  const [value, setValue] = useState(() =>
    snapToStep(
      defaultSliderValue(premise.min, premise.max, premise.scale),
      premise.min,
      premise.max,
      premise.step,
    ),
  )

  const bump = (dir: 1 | -1) => {
    const next = nudgeValue(
      value,
      dir,
      premise.min,
      premise.max,
      premise.step,
      premise.scale,
    )
    if (next !== value) hapticTick(10)
    setValue(next)
  }

  return (
    <main
      data-testid="guess-screen"
      className="guess-screen flex h-dvh max-h-dvh flex-col overflow-hidden overscroll-none px-4 pt-5 pb-6"
      style={{ background: player.color, color: ink }}
    >
      <header className="flex items-start justify-between gap-3">
        <h1 className="font-display text-3xl leading-none font-semibold wrap-anywhere">
          {player.name}
        </h1>
        <p className="shrink-0 text-sm font-semibold uppercase tracking-wider opacity-75">
          {roundLabel}
        </p>
      </header>

      <p className="mt-5 font-display text-2xl leading-tight font-medium">
        {premise.question}
      </p>

      <div className="mt-6 text-center">
        <p data-testid="guess-value" className="tabular font-display text-6xl leading-none font-semibold">
          {formatPremiseValue(premise, value)}
        </p>
        <p className="mt-1 text-lg opacity-80">{premise.unit}</p>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 items-stretch gap-3">
        <button
          type="button"
          data-testid="slider-minus"
          aria-label="Bajar un toque"
          onClick={() => bump(-1)}
          className="min-h-14 min-w-14 self-center rounded-2xl bg-black/15 text-4xl font-bold"
        >
          −
        </button>
        <div className="min-h-52 flex-1">
          <VerticalSlider
            min={premise.min}
            max={premise.max}
            step={premise.step}
            scale={premise.scale}
            value={value}
            onChange={setValue}
            color={ink === '#fff8f0' ? '#fff8f0' : '#1a1233'}
            label="Tu número"
          />
        </div>
        <button
          type="button"
          data-testid="slider-plus"
          aria-label="Subir un toque"
          onClick={() => bump(1)}
          className="min-h-14 min-w-14 self-center rounded-2xl bg-black/15 text-4xl font-bold"
        >
          +
        </button>
      </div>

      <button
        type="button"
        data-testid="guess-ready"
        onClick={() => onSubmit(value)}
        className="mt-4 min-h-14 w-full rounded-full bg-white text-lg font-bold text-ink shadow-lg"
      >
        Listo
      </button>
    </main>
  )
}
