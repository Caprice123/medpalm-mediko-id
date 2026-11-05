import { PiBell, PiBellSlash } from 'react-icons/pi'
import { MicroLabel } from '../../../../Station.styles'
import { formatClock, clockUrgency } from '../../../../../../utils/sessionState'
import { useStationClock } from './hooks/useStationClock'
import { ClockBlock, Head, MuteButton, Time, Note } from './StationClock.styles'

const NOTES = {
  expired: 'bel sudah berbunyi',
  critical: 'kurang dari satu menit',
  warning: 'rapikan jawabanmu',
  normal: 'bel berbunyi otomatis',
}

function StationClock({ sessionDetail, onTimeUp }) {
  const { remaining, muted, toggleMuted } = useStationClock(sessionDetail, onTimeUp)
  const urgency = clockUrgency(remaining)

  return (
    <ClockBlock $urgency={urgency}>
      <Head $urgency={urgency}>
        <MicroLabel as="span" style={{ color: 'inherit' }}>Sisa waktu</MicroLabel>
        <MuteButton
          type="button"
          onClick={toggleMuted}
          $urgency={urgency}
          aria-pressed={muted}
          title={muted ? 'Nyalakan bel' : 'Bisukan bel'}
        >
          {muted ? <PiBellSlash size={17} /> : <PiBell size={17} />}
        </MuteButton>
      </Head>
      <Time $urgency={urgency}>{formatClock(remaining)}</Time>
      <Note $urgency={urgency}>
        {muted && urgency !== 'expired' ? 'bel dibisukan' : NOTES[urgency]}
      </Note>
    </ClockBlock>
  )
}

export default StationClock
