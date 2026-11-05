import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import {
  SESSION_STATE_LABELS,
  SESSION_STATE_ACTIONS,
  scoreColor,
  formatDuration,
} from '../../../../../../utils/sessionState'
import { Row, Title, When, StateBadge, Score, NoScore, Action } from './HistoryRow.styles'

// One past attempt as a data row. Where it goes depends only on the state the server already
// resolved, so the row never has to work out what a `started` session with no clock left is.
const destinationFor = (session, onRequestStart) => {
  if (session.state === 'created') return () => onRequestStart(session)
  if (session.state === 'started') return (navigate) => navigate(OscePracticeRoute.practiceRoute(session.uniqueId))

  return (navigate) => navigate(OscePracticeRoute.resultRoute(session.uniqueId))
}

function HistoryRow({ session, onRequestStart }) {
  const navigate = useNavigate()
  const go = destinationFor(session, onRequestStart)

  return (
    <Row>
      <div>
        <Title>{session.topicTitle}</Title>
        <When>
          {formatJakartaDateTimeFull(session.startedAt || session.createdAt)}
          {session.timeTaken > 0 && ` · ${formatDuration(session.timeTaken)}`}
        </When>
      </div>

      <div>
        <StateBadge $state={session.state}>
          {SESSION_STATE_LABELS[session.state] || session.state}
        </StateBadge>
      </div>

      {session.percentage === null ? (
        <NoScore>Belum dinilai</NoScore>
      ) : (
        <Score $color={scoreColor(session.percentage)}>
          {Math.round(session.percentage)}
          <small>/ 100</small>
        </Score>
      )}

      <Action>
        <Button
          variant={session.state === 'started' ? 'primary' : 'outline'}
          size="small"
          onClick={() => go(navigate)}
        >
          {SESSION_STATE_ACTIONS[session.state] || 'Buka'}
        </Button>
      </Action>
    </Row>
  )
}

export default HistoryRow
