import { useCallback, useRef } from 'react'
import { hapticTick } from '../game/format'
import { snapToStep, tToValue, valueToT } from '../game/slider'
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

  const applyClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const t = (rect.bottom - clientY) / rect.height
      const raw = tToValue(t, min, max, scale)
      const next = snapToStep(raw, min, max, step)
      if (next !== lastTick.current) {
        hapticTick(8)
        lastTick.current = next
      }
      onChange(next)
    },
    [max, min, onChange, scale, step],
  )

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    applyClientY(event.clientY)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons === 0) return
    applyClientY(event.clientY)
  }

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
      className="relative mx-auto h-full min-h-44 w-20 cursor-ns-resize touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
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
      <div className="absolute inset-x-1/2 top-2 bottom-2 w-2 -translate-x-1/2 rounded-full bg-white/20" />
      <div
        className="absolute inset-x-1/2 bottom-2 w-2 -translate-x-1/2 rounded-full"
        style={{
          height: `calc(${t * 100}% - 8px)`,
          background: color,
        }}
      />
      <div
        className="absolute left-1/2 size-16 -translate-x-1/2 rounded-full border-4 border-white shadow-lg"
        style={{
          bottom: `calc(${t * 100}% - 2.1rem)`,
          background: color,
        }}
      />
    </div>
  )
}
