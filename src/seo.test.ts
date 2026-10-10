import { describe, expect, it } from 'vitest'
import { OG_IMAGE_URL, SEO, SITE_URL, applySeoTags } from './seo'

describe('SEO', () => {
  it('arma la URL absoluta del og:image desde SITE_URL', () => {
    expect(SITE_URL).toBe('https://cuanto-es.vercel.app')
    expect(OG_IMAGE_URL).toBe('https://cuanto-es.vercel.app/og.png')
    expect(SEO.imageWidth).toBe(1200)
    expect(SEO.imageHeight).toBe(630)
    expect(SEO.locale).toBe('es_AR')
    expect(SEO.themeColor).toBe('#1e1446')
    expect(SEO.title).toBe(
      '¿Cuánto es? El juego de adivinar con amigos en un solo celular',
    )
    expect(SEO.ogTitle).toBe('¿Cuánto es? 🎯 Adiviná y ganá con tus amigos')
    expect(SEO.description).toBe(
      'Adiviná cuánto pesa, cuánto mide o en qué año pasó, deslizando tu número. Preguntas raras, argentinas y picantes. De 2 a 8 jugadores en un solo celu: el que queda más cerca suma.',
    )
  })

  it('escribe las etiquetas en el documento', () => {
    document.head.innerHTML = `
      <meta name="description" content="">
      <meta property="og:title" content="">
      <meta property="og:description" content="">
      <meta property="og:image" content="">
      <meta property="og:image:width" content="">
      <meta property="og:image:height" content="">
      <meta property="og:locale" content="">
      <meta property="og:url" content="">
      <meta name="twitter:card" content="">
      <meta name="twitter:title" content="">
      <meta name="twitter:description" content="">
      <meta name="twitter:image" content="">
      <meta name="theme-color" content="">
    `
    applySeoTags(document)
    expect(document.title).toBe(SEO.title)
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      OG_IMAGE_URL,
    )
    expect(document.head.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    )
    expect(document.head.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      '#1e1446',
    )
  })
})
