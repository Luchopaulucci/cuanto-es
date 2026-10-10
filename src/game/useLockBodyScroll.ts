import { useEffect } from 'react'

export const SCROLL_LOCK_CLASS = 'scroll-locked'

/** Bloquea el scroll del documento solo mientras la pantalla del slider está montada. */
export function useLockBodyScroll(enabled = true): void {
  useEffect(() => {
    if (!enabled) return
    const body = document.body
    body.classList.add(SCROLL_LOCK_CLASS)
    return () => {
      body.classList.remove(SCROLL_LOCK_CLASS)
    }
  }, [enabled])
}
