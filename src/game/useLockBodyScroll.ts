import { useEffect } from 'react'

export const SCROLL_LOCK_CLASS = 'scroll-locked'

export function useLockBodyScroll(enabled = true): void {
  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    html.classList.add(SCROLL_LOCK_CLASS)
    body.classList.add(SCROLL_LOCK_CLASS)
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.classList.remove(SCROLL_LOCK_CLASS)
      body.classList.remove(SCROLL_LOCK_CLASS)
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }
  }, [enabled])
}
