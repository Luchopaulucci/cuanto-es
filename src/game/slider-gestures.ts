export const SLIDER_MOVE_LISTENER_OPTIONS = { passive: false } as const

export type SliderDragApi = {
  dragging: { current: boolean }
  applyClientY: (clientY: number) => void
}

function capturePointer(el: HTMLElement, pointerId: number): void {
  try {
    el.setPointerCapture(pointerId)
  } catch {
    // jsdom and some browsers throw if the pointer is not active
  }
}

function releasePointer(el: HTMLElement, pointerId: number): void {
  try {
    if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId)
  } catch {
    // ignore
  }
}

export function preventIfDragging(event: Event, dragging: boolean): void {
  if (!dragging) return
  if (event.cancelable) event.preventDefault()
}

export function attachNonPassiveSliderListeners(
  el: HTMLElement,
  api: SliderDragApi,
): () => void {
  const onPointerDown = (event: PointerEvent) => {
    api.dragging.current = true
    capturePointer(el, event.pointerId)
    api.applyClientY(event.clientY)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!api.dragging.current) return
    preventIfDragging(event, true)
    api.applyClientY(event.clientY)
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!api.dragging.current) return
    preventIfDragging(event, true)
    const touch = event.touches[0]
    if (touch) api.applyClientY(touch.clientY)
  }

  const endDrag = (event: PointerEvent) => {
    api.dragging.current = false
    releasePointer(el, event.pointerId)
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove, SLIDER_MOVE_LISTENER_OPTIONS)
  el.addEventListener('touchmove', onTouchMove, SLIDER_MOVE_LISTENER_OPTIONS)
  el.addEventListener('pointerup', endDrag)
  el.addEventListener('pointercancel', endDrag)
  el.addEventListener('lostpointercapture', endDrag)

  return () => {
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('pointerup', endDrag)
    el.removeEventListener('pointercancel', endDrag)
    el.removeEventListener('lostpointercapture', endDrag)
  }
}
