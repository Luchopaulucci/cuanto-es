import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(root, 'src/index.css'), 'utf8')
const html = readFileSync(join(root, 'index.html'), 'utf8')

describe('layout móvil: scroll y safe-area', () => {
  it('el viewport usa viewport-fit=cover', () => {
    expect(html).toMatch(
      /name="viewport"[^>]*content="[^"]*viewport-fit=cover/,
    )
  })

  it('reserva safe-area inset top y bottom', () => {
    expect(css).toMatch(/env\(safe-area-inset-top/)
    expect(css).toMatch(/env\(safe-area-inset-bottom/)
    expect(css).toMatch(/\.safe-area-screen/)
  })

  it('usa 100dvh con fallback 100vh', () => {
    expect(css).toMatch(/min-height:\s*100vh/)
    expect(css).toMatch(/min-height:\s*100dvh/)
    expect(css).toMatch(/height:\s*100vh/)
    expect(css).toMatch(/height:\s*100dvh/)
  })

  it('overscroll-behavior none queda en html/body', () => {
    expect(css).toMatch(/html,\s*body\s*\{[\s\S]*overscroll-behavior:\s*none/)
  })

  it('overflow hidden y touch-action none solo con body.scroll-locked o guess-screen', () => {
    const locked = css.match(/body\.scroll-locked\s*\{([^}]+)\}/)
    expect(locked?.[1]).toMatch(/overflow:\s*hidden/)
    expect(locked?.[1]).toMatch(/touch-action:\s*none/)
    expect(css).not.toMatch(/html\.scroll-locked/)

    const base = css.match(/html,\s*body,\s*#root\s*\{([^}]+)\}/)
    expect(base?.[1]).not.toMatch(/overflow:\s*hidden/)
    expect(base?.[1]).not.toMatch(/touch-action:\s*none/)
  })
})
