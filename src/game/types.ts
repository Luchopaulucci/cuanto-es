export const CATEGORIES = [
  'animales',
  'cuerpo',
  'geografia',
  'argentina',
  'espacio',
  'historia',
  'comida',
  'tecnologia',
  'cuerpo-asco',
  'cosas-raras',
  'argentinidad',
  'animales-bizarros',
  'en-que-anio',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Scale = 'linear' | 'log'

export type PremiseKind = 'measure' | 'year'

export type Source = {
  name: string
  url: string
}

export type Premise = {
  id: string
  category: Category
  question: string
  value: number
  unit: string
  unitLabel: string
  min: number
  max: number
  step: number
  scale: Scale
  source: Source
  kind?: PremiseKind
  disputed?: boolean
  picante?: boolean
}

export const PHASES = [
  'setup',
  'handoff',
  'guess',
  'reveal',
  'podium',
] as const

export type Phase = (typeof PHASES)[number]

export type Player = {
  id: string
  name: string
  color: string
}

export type Award = {
  playerId: string
  points: number
  error: number
  rank: number
}

export type GameState = {
  phase: Phase
  players: Player[]
  scores: Record<string, number>
  roundsTotal: number
  roundIndex: number
  selectedCategories: Category[]
  picante: boolean
  usedPremiseIds: string[]
  currentPremiseId: string | null
  currentPlayerIndex: number
  guesses: Record<string, number>
  lastResult: Award[] | null
}

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string; color?: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'RENAME_PLAYER'; id: string; name: string }
  | { type: 'SET_COLOR'; id: string; color: string }
  | { type: 'SET_ROUNDS'; rounds: number }
  | { type: 'TOGGLE_CATEGORY'; category: Category }
  | { type: 'TOGGLE_PICANTE' }
  | { type: 'START' }
  | { type: 'CONFIRM_HANDOFF' }
  | { type: 'SUBMIT_GUESS'; value: number }
  | { type: 'LOCK_HANDOFF' }
  | { type: 'NEXT_AFTER_REVEAL' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; state: GameState }

export type ReducerDeps = {
  random: () => number
  premises: Premise[]
  now: () => number
}

export const CATEGORY_LABELS: Record<Category, string> = {
  animales: 'Animales',
  cuerpo: 'Cuerpo humano',
  geografia: 'Geografía',
  argentina: 'Argentina',
  espacio: 'Espacio',
  historia: 'Historia',
  comida: 'Comida',
  tecnologia: 'Tecnología',
  'cuerpo-asco': 'Cuerpo y asquerosidades',
  'cosas-raras': 'Cosas raras',
  argentinidad: 'Argentinidad',
  'animales-bizarros': 'Animales bizarros',
  'en-que-anio': '¿En qué año?',
}

export const DISPUTED_NOTE = 'según la versión más citada'

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 8
export const DEFAULT_ROUNDS = 10
export const PLACE_POINTS = [3, 2, 1] as const
