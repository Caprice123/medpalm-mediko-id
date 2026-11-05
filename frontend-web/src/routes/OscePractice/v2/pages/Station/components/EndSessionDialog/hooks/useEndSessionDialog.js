import { useEffect, useState } from 'react'

// The server's actual order of work when a station is finalised. The durations only pace the
// readout; the dialog closes when the request resolves, not when this list ends.
export const EVALUATION_STEPS = [
  { key: 'save', label: 'Menyimpan jawaban', ms: 500 },
  { key: 'diagnosis', label: 'Menilai diagnosis', ms: 1000 },
  { key: 'therapy', label: 'Menilai terapi', ms: 1000 },
  { key: 'score', label: 'Menghitung skor rubrik', ms: 800 },
]

export const useEndSessionDialog = ({ isOpen, auto, isProcessing, onConfirm }) => {
  const [step, setStep] = useState(0)

  // The bell does not ask. When the clock runs out the station is over, so the dialog opens
  // straight into the evaluation readout rather than waiting for a confirmation nobody can give.
  useEffect(() => {
    if (isOpen && auto && !isProcessing) onConfirm()
  }, [isOpen, auto, isProcessing, onConfirm])

  useEffect(() => {
    if (!isProcessing) {
      setStep(0)
      return
    }

    const timers = []
    let elapsed = 0

    EVALUATION_STEPS.forEach((entry, index) => {
      elapsed += entry.ms
      timers.push(setTimeout(() => setStep(index + 1), elapsed))
    })

    return () => timers.forEach(clearTimeout)
  }, [isProcessing])

  return { step }
}
