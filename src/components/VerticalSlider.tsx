import { useCallback, useEffect, useRef } from 'react'
import { hapticTick } from '../game/format'
import { attachNonPassiveSliderListeners } from '../game/slider-gestures'
import {
  fillHeightCss,
  pointerYToT,
  snapToStep,
  thumbBottomCss,
  tToValue,
  valueToT,
} from '../game/slider'
import type { Scale } from '../game/types'

type Props = {
  min: number
  max: number
  step: number
  scale: Scale
  value: number
  onChange: (next: number) => void
  color: string
  label: string
}

export function VerticalSlider({
  min,
  max,
  step,
  scale,
  value,
  onChange,
  color,
  label,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const lastTick = useRef(value)
  const dragging = useRef(false)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const applyClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const t = pointerYToT(clientY, rect)
      const raw = tToValue(t, min, max, scale)
      const next = snapToStep(raw, min, max, step)
      if (next !== lastTick.current) {
        hapticTick(8)
        lastTick.current = next
      }
      onChangeRef.current(next)
    },
    [max, min, scale, step],
  )

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    return attachNonPassiveSliderListeners(el, { dragging, applyClientY })
  }, [applyClientY])

  const t = valueToT(value, min, max, scale)

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-orientation="vertical"
      tabIndex={0}
      data-testid="vertical-slider"
      className="vertical-slider relative mx-auto h-full min-h-0 w-20 cursor-ns-resize touch-none select-none"
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
          event.preventDefault()
          const next = tToValue(Math.min(1, t + 0.02), min, max, scale)
          onChange(snapToStep(next, min, max, step))
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
          event.preventDefault()
          const next = tToValue(Math.max(0, t - 0.02), min, max, scale)
          onChange(snapToStep(next, min, max, step))
        }
      }}
    >
      <div
        data-testid="vertical-slider-track"
        className="vertical-slider-track absolute inset-x-1/2 top-2 bottom-2 w-2 -translate-x-1/2 rounded-full bg-white/20"
      />
      <div
        className="absolute inset-x-1/2 bottom-0 w-2 -translate-x-1/2 rounded-full"
        style={{
          height: fillHeightCss(t),
          background: color,
        }}
      />
      <div
        data-testid="vertical-slider-thumb"
        className="vertical-slider-thumb absolute left-1/2 size-16 -translate-x-1/2 rounded-full border-4 border-white shadow-lg"
        style={{
          bottom: thumbBottomCss(t),
          background: color,
        }}
      />
    </div>
  )
}
