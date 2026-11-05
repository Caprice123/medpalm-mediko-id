import { PiCheckCircle, PiArrowCounterClockwise } from 'react-icons/pi'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { formatDuration, topicTags, batchTags } from '../../../../utils/sessionState'
import { Band, Station, Facts, Tags, Score, Percentage, Raw, Verdict } from './DebriefHeader.styles'

// The verdict, the station, and when it happened. Everything else on the page explains this
// band; nothing else repeats its number.
function DebriefHeader({ session, rubric }) {
  const tags = [...topicTags(session.tags), ...batchTags(session.tags)]
  const passing = !!rubric?.isPassing

  return (
    <Band $passing={passing}>
      <Station>
        <h1>{session.topic?.title || session.topicTitle || 'Kasus'}</h1>

        {tags.length > 0 && (
          <Tags>
            {tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}
          </Tags>
        )}

        <Facts>
          <div>
            <dt>Dikerjakan</dt>
            <dd>{formatJakartaDateTimeFull(session.startedAt)}</dd>
          </div>
          <div>
            <dt>Waktu terpakai</dt>
            <dd>{formatDuration(session.result?.timeTaken || session.timeTaken)}</dd>
          </div>
        </Facts>
      </Station>

      <Score>
        <Percentage>
          {rubric?.percentage ?? 0}<small>%</small>
        </Percentage>
        <Raw>
          {rubric?.totalScore ?? 0} dari {rubric?.maxScore ?? 0} poin rubrik
        </Raw>
        <Verdict $passing={passing}>
          {passing ? <PiCheckCircle size={15} /> : <PiArrowCounterClockwise size={15} />}
          {passing
            ? `Lulus · batas ${rubric?.passThreshold ?? 60}%`
            : `Belum lulus · batas ${rubric?.passThreshold ?? 60}%`}
        </Verdict>
      </Score>
    </Band>
  )
}

export default DebriefHeader
