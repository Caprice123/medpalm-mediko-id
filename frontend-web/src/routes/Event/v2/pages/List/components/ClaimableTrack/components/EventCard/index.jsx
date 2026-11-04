import { PiHourglass, PiClock, PiInfinity } from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import {
  getClaimCountdown, getClaimAction, describeReward, isEvergreen, deadlineLabel,
} from '../../../../utils/claimState'
import RewardLine from '../../../RewardLine'
import {
  CardFrame, WindowTrack, WindowFill, CardBody, CardTitle,
  Description, WindowNote, CardFooter,
} from './EventCard.styles'

function EventCard({ event, featureLabels, onDetail, onClaim }) {
  const countdown = getClaimCountdown(event)
  const action = getClaimAction(event)
  const reward = describeReward(event, featureLabels)
  const evergreen = isEvergreen(event)

  return (
    <CardFrame>
      {countdown && !countdown.isClosed && (
        <WindowTrack
          role="progressbar"
          aria-label="Sisa waktu klaim"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(countdown.remainingRatio * 100)}
          aria-valuetext={deadlineLabel(countdown)}
        >
          <WindowFill $ratio={countdown.remainingRatio} $urgent={countdown.isUrgent} />
        </WindowTrack>
      )}

      <CardBody>
        <CardTitle>{event.title}</CardTitle>

        <RewardLine reward={reward} />

        {event.description && <Description>{event.description}</Description>}

        {evergreen ? (
          <WindowNote $tone="evergreen">
            <PiInfinity size={15} aria-hidden="true" />
            Selalu terbuka — tanpa batas waktu
          </WindowNote>
        ) : (
          <WindowNote $tone={countdown?.isUrgent ? 'urgent' : 'neutral'}>
            {countdown?.isUrgent
              ? <PiHourglass size={15} aria-hidden="true" />
              : <PiClock size={15} aria-hidden="true" />}
            {countdown
              ? `${deadlineLabel(countdown)} — ${formatJakartaDateTimeFull(event.registrationEndAt)}`
              : `Dibuka sampai ${formatJakartaDateTimeFull(event.registrationEndAt)}`}
          </WindowNote>
        )}

        <CardFooter>
          <Button variant="secondary" onClick={() => onDetail(event)}>Detail</Button>
          <Button
            variant="primary"
            disabled={action.disabled}
            onClick={() => onClaim(event)}
          >
            {action.label}
          </Button>
        </CardFooter>
      </CardBody>
    </CardFrame>
  )
}

export default EventCard
