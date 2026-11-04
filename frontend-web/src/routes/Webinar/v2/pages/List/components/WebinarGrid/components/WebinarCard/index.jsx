import { PiMicrophoneStage, PiClock } from 'react-icons/pi'
import Button from '@components/common/Button'
import {
  formatJakartaDateShort, formatJakartaTimeShort, formatJakartaDateTimeFull,
} from '@utils/dateUtils'
import { getWebinarAction } from '../../../../utils/registrationState'
import {
  CardFrame, Cover, DateTab, CardBody, CardTitle, CardMeta, CardFooter,
} from './WebinarCard.styles'

function WebinarCard({ webinar, onDetail, onRegister }) {
  const action = getWebinarAction(webinar)
  const speakerNames = (webinar.speakers || []).map(s => s.name).filter(Boolean)

  return (
    <CardFrame>
      <Cover>
        {webinar.thumbnail?.url && (
          <img src={webinar.thumbnail.url} alt="" loading="lazy" />
        )}
        <DateTab>
          <b>{formatJakartaDateShort(webinar.startAt)}</b>
          {formatJakartaTimeShort(webinar.startAt)} WIB
        </DateTab>
      </Cover>

      <CardBody>
        <CardTitle>{webinar.title}</CardTitle>

        {speakerNames.length > 0 && (
          <CardMeta $accent>
            <PiMicrophoneStage size={15} aria-hidden="true" />
            <span>{speakerNames.join(', ')}</span>
          </CardMeta>
        )}

        <CardMeta>
          <PiClock size={15} aria-hidden="true" />
          <span>{formatJakartaDateTimeFull(webinar.startAt)}</span>
        </CardMeta>

        <CardFooter>
          <Button variant="secondary" onClick={() => onDetail(webinar)}>Detail</Button>
          <Button
            variant="primary"
            disabled={action.disabled}
            onClick={() => onRegister(webinar)}
          >
            {action.shortLabel}
          </Button>
        </CardFooter>
      </CardBody>
    </CardFrame>
  )
}

export default WebinarCard
