// The station bell, synthesised rather than shipped as an audio file.
//
// A real OSCE circuit runs on a bell: one strike to warn, two to end the station. Reproducing
// that is the point of the clock, so it is built here from oscillators — no asset to load, no
// request to fail, and it stays in tune at any volume.
//
// A bell is not a sine wave. Its partials are inharmonic — the hum, prime, tierce and quint of
// a cast bell sit at roughly these ratios — which is what separates a bell from a beep.
const PARTIALS = [
  { ratio: 1, gain: 1, decay: 1.9 },
  { ratio: 2.0, gain: 0.6, decay: 1.4 },
  { ratio: 2.76, gain: 0.42, decay: 1.0 },
  { ratio: 5.4, gain: 0.18, decay: 0.6 },
  { ratio: 8.9, gain: 0.08, decay: 0.35 },
]

const MUTE_STORAGE_KEY = 'osce_station_bell_muted'

let audioContext = null

export const isBellMuted = () => {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
  } catch {
    // Private windows and blocked site data both throw here. An unreadable preference is not a
    // reason to go silent — the bell is the feature.
    return false
  }
}

export const setBellMuted = (muted) => {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted))
  } catch {
    // Nothing to do: the setting simply does not survive this session.
  }
}

// Browsers only allow audio once the page has had a real user gesture. The station is always
// entered by clicking through the start gate, but the room is a fresh document, so the context
// is created lazily and resumed on the way in; a context that stays suspended just means the
// bell is silent, and the clock's colour is already carrying the same message.
const context = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null

  if (!audioContext) {
    try {
      audioContext = new AudioContextClass()
    } catch {
      return null
    }
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }

  return audioContext
}

// Call this from any real user gesture inside the station so the context is already running
// when the bell is due.
export const primeBell = () => { context() }

const strike = (ctx, startAt, { frequency, volume }) => {
  PARTIALS.forEach((partial) => {
    const oscillator = ctx.createOscillator()
    const amplitude = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency * partial.ratio

    // Struck, not faded in: a 4ms attack to full, then an exponential tail. A linear fade out
    // sounds like a synth pad; the exponential one sounds like metal.
    amplitude.gain.setValueAtTime(0, startAt)
    amplitude.gain.linearRampToValueAtTime(volume * partial.gain, startAt + 0.004)
    amplitude.gain.exponentialRampToValueAtTime(0.0001, startAt + partial.decay)

    oscillator.connect(amplitude).connect(ctx.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + partial.decay + 0.05)
  })
}

// One strike: the warning, at the last minute.
export const ringWarningBell = () => {
  if (isBellMuted()) return
  const ctx = context()
  if (!ctx) return

  strike(ctx, ctx.currentTime + 0.02, { frequency: 784, volume: 0.16 })
}

// Two strikes: time is up, the station is over.
export const ringEndBell = () => {
  if (isBellMuted()) return
  const ctx = context()
  if (!ctx) return

  const start = ctx.currentTime + 0.02
  strike(ctx, start, { frequency: 523, volume: 0.26 })
  strike(ctx, start + 0.46, { frequency: 523, volume: 0.26 })
}
