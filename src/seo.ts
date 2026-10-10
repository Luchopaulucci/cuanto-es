export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? 'https://cuanto-es.vercel.app'
).replace(/\/$/, '')

export const OG_IMAGE_URL = `${SITE_URL}/og.png`

export const SEO = {
  title: '¿Cuánto es? El juego de adivinar con amigos en un solo celular',
  description:
    'Adiviná cuánto pesa, cuánto mide o en qué año pasó, deslizando tu número. Preguntas raras, argentinas y picantes. De 2 a 8 jugadores en un solo celu: el que queda más cerca suma.',
  ogTitle: '¿Cuánto es? 🎯 Adiviná y ganá con tus amigos',
  locale: 'es_AR',
  themeColor: '#1e1446',
  imageWidth: 1200,
  imageHeight: 630,
} as const

export function applySeoTags(doc: Document = document): void {
  const set = (selector: string, attr: string, value: string) => {
    const el = doc.head.querySelector(selector)
    if (el) el.setAttribute(attr, value)
  }

  doc.title = SEO.title
  set('meta[name="description"]', 'content', SEO.description)
  set('meta[property="og:title"]', 'content', SEO.ogTitle)
  set('meta[property="og:description"]', 'content', SEO.description)
  set('meta[property="og:image"]', 'content', OG_IMAGE_URL)
  set('meta[property="og:image:width"]', 'content', String(SEO.imageWidth))
  set('meta[property="og:image:height"]', 'content', String(SEO.imageHeight))
  set('meta[property="og:locale"]', 'content', SEO.locale)
  set('meta[property="og:url"]', 'content', SITE_URL)
  set('meta[name="twitter:card"]', 'content', 'summary_large_image')
  set('meta[name="twitter:title"]', 'content', SEO.ogTitle)
  set('meta[name="twitter:description"]', 'content', SEO.description)
  set('meta[name="twitter:image"]', 'content', OG_IMAGE_URL)
  set('meta[name="theme-color"]', 'content', SEO.themeColor)
}
