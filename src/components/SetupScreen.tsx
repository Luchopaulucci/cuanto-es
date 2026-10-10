import { useState } from 'react'
import {
  CATEGORY_LABELS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Category,
  type Player,
} from '../game/types'
import { PLAYER_COLORS } from '../game/colors'

const CLASSIC: Category[] = [
  'animales',
  'cuerpo',
  'geografia',
  'argentina',
  'espacio',
  'historia',
  'comida',
  'tecnologia',
]
const FIESTA: Category[] = [
  'cuerpo-asco',
  'cosas-raras',
  'argentinidad',
  'animales-bizarros',
  'en-que-anio',
]

type Props = {
  players: Player[]
  roundsTotal: number
  selectedCategories: Category[]
  picante: boolean
  error?: string
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
  onColor: (id: string, color: string) => void
  onRounds: (n: number) => void
  onToggleCategory: (c: Category) => void
  onTogglePicante: () => void
  onStart: () => void
}

export function SetupScreen({
  players,
  roundsTotal,
  selectedCategories,
  picante,
  error,
  onAdd,
  onRemove,
  onRename,
  onColor,
  onRounds,
  onToggleCategory,
  onTogglePicante,
  onStart,
}: Props) {
  const [draft, setDraft] = useState('')

  const submit = () => {
    onAdd(draft)
    setDraft('')
  }

  return (
    <main
      data-testid="setup-screen"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-8 pb-8"
    >
      <p className="text-sm font-semibold tracking-[0.18em] text-gold uppercase">
        Un celu. Toda la mesa.
      </p>
      <h1 className="font-display mt-2 text-5xl leading-none font-semibold">
        ¿Cuánto es?
      </h1>
      <p className="mt-3 text-lg text-mist">
        Adiviná pesos, años y pavadas raras. El que queda más cerca se lleva los
        puntos. Pasá el celu: nadie mira el número del otro.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-bold tracking-wide text-gold uppercase">
          Jugadores ({players.length}/{MAX_PLAYERS})
        </h2>
        <ul className="mt-3 space-y-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2"
            >
              <label className="sr-only" htmlFor={`color-${p.id}`}>
                Color de {p.name}
              </label>
              <input
                id={`color-${p.id}`}
                type="color"
                value={p.color}
                onChange={(e) => onColor(p.id, e.target.value)}
                className="size-10 cursor-pointer rounded-full border-0 bg-transparent"
              />
              <div className="flex flex-wrap gap-1">
                {PLAYER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Color ${c}`}
                    onClick={() => onColor(p.id, c)}
                    className="size-4 rounded-full"
                    style={{
                      background: c,
                      outline: p.color === c ? '2px solid #fff8f0' : undefined,
                    }}
                  />
                ))}
              </div>
              <input
                value={p.name}
                onChange={(e) => onRename(p.id, e.target.value)}
                className="min-w-0 flex-1 rounded-xl bg-transparent px-2 py-1 text-lg font-semibold outline-none"
              />
              <button
                type="button"
                aria-label={`Sacar a ${p.name}`}
                onClick={() => onRemove(p.id)}
                className="text-pink"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {players.length < MAX_PLAYERS && (
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <input
              data-testid="player-name-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nombre"
              maxLength={18}
              className="min-h-12 min-w-0 flex-1 rounded-2xl bg-white/10 px-4 text-lg outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              data-testid="add-player"
              className="min-h-12 rounded-2xl bg-gold px-4 font-bold text-ink"
            >
              Agregar
            </button>
          </form>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold tracking-wide text-gold uppercase">
          Rondas
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            aria-label="Menos rondas"
            onClick={() => onRounds(roundsTotal - 1)}
            className="size-12 rounded-2xl bg-white/10 text-2xl"
          >
            −
          </button>
          <p data-testid="rounds-count" className="tabular min-w-10 text-center text-3xl font-bold">
            {roundsTotal}
          </p>
          <button
            type="button"
            aria-label="Más rondas"
            onClick={() => onRounds(roundsTotal + 1)}
            className="size-12 rounded-2xl bg-white/10 text-2xl"
          >
            +
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold tracking-wide text-gold uppercase">
          Categorías clásicas
        </h2>
        <ChipRow
          cats={CLASSIC}
          selected={selectedCategories}
          onToggle={onToggleCategory}
        />
        <h2 className="mt-5 text-sm font-bold tracking-wide text-gold uppercase">
          Fiesta
        </h2>
        <ChipRow
          cats={FIESTA}
          selected={selectedCategories}
          onToggle={onToggleCategory}
        />
        <label className="mt-5 flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
          <span>
            <span className="block font-bold">Modo picante</span>
            <span className="text-sm text-mist">
              Humor más sucio. Sin insultos a nadie ni nada con pibes.
            </span>
          </span>
          <input
            data-testid="picante-toggle"
            type="checkbox"
            checked={picante}
            onChange={onTogglePicante}
            className="size-6 accent-pink"
          />
        </label>
      </section>

      {error && (
        <p role="alert" className="mt-4 text-pink">
          {error}
        </p>
      )}

      <button
        type="button"
        data-testid="start-game"
        onClick={onStart}
        disabled={players.length < MIN_PLAYERS}
        className="mt-8 min-h-14 w-full rounded-full bg-pink text-lg font-bold text-ink disabled:opacity-40"
      >
        ¡A jugar!
      </button>
    </main>
  )
}

function ChipRow({
  cats,
  selected,
  onToggle,
}: {
  cats: Category[]
  selected: Category[]
  onToggle: (c: Category) => void
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {cats.map((c) => {
        const on = selected.includes(c)
        return (
          <button
            key={c}
            type="button"
            onClick={() => onToggle(c)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              on ? 'bg-gold text-ink' : 'bg-white/10 text-cream'
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        )
      })}
    </div>
  )
}
