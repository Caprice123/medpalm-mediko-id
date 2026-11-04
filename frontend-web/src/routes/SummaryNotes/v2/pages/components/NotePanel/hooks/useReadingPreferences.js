import { useCallback, useState } from 'react'

const FONT_SCALE_KEY = 'summaryNotesV2_fontScale'

// Three steps rather than a slider: a reader wants "bigger", not a precise value,
// and a fixed set keeps every heading in the note proportional at every step.
const FONT_SCALES = [1, 1.125, 1.25]
const DEFAULT_FONT_SCALE = 1

function readStored(key, allowed, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const value = typeof fallback === 'number' ? Number(raw) : raw
    return allowed.includes(value) ? value : fallback
  } catch {
    return fallback
  }
}

function writeStored(key, value) {
  // A reading preference that cannot be persisted (private window, blocked storage)
  // still applies for this session; losing it later is not worth failing on.
  try { localStorage.setItem(key, String(value)) } catch { /* preference is session-only */ }
}

export function useReadingPreferences() {
  const [fontScale, setFontScale] = useState(() => readStored(FONT_SCALE_KEY, FONT_SCALES, DEFAULT_FONT_SCALE))

  const stepFontScale = useCallback((direction) => {
    setFontScale(prev => {
      const nextIndex = FONT_SCALES.indexOf(prev) + direction
      if (nextIndex < 0 || nextIndex >= FONT_SCALES.length) return prev
      const next = FONT_SCALES[nextIndex]
      writeStored(FONT_SCALE_KEY, next)
      return next
    })
  }, [])

  const fontScaleIndex = FONT_SCALES.indexOf(fontScale)

  return {
    fontScale,
    canDecreaseFont: fontScaleIndex > 0,
    canIncreaseFont: fontScaleIndex < FONT_SCALES.length - 1,
    decreaseFont: () => stepFontScale(-1),
    increaseFont: () => stepFontScale(1),
  }
}
