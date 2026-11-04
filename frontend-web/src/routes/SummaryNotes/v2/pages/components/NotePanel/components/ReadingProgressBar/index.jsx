import { useReadingProgress } from './hooks/useReadingProgress'
import { ProgressTrack, ProgressFill } from './ReadingProgressBar.styles'

export default function ReadingProgressBar({ scrollElement }) {
  const { fillRef } = useReadingProgress(scrollElement)

  return (
    <ProgressTrack
      role="progressbar"
      aria-label="Progres bacaan"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <ProgressFill ref={fillRef} />
    </ProgressTrack>
  )
}
