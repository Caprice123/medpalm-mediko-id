import { PiSparkle, PiTrophy } from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { recordSummary, scoreColor, topicTags, batchTags } from '../../../../../../utils/sessionState'
import { Row, Title, Scenario, Tags, Tag, Duration, Record, Action } from './StationRow.styles'

// One station as a data row. The record line is the reason this is a row and not a card: a
// student scanning twelve of these is comparing their own history across them, which a grid of
// equal-weight cards makes harder, not easier.
function StationRow({ station, isStarting, onStart }) {
  const record = recordSummary(station.myRecord)
  const tags = [...topicTags(station.tags), ...batchTags(station.tags)]

  return (
    <Row>
      <div>
        <Title>{station.title}</Title>
        {(station.scenario || station.description) && (
          <Scenario>{station.scenario || station.description}</Scenario>
        )}
        <Record $tone={record.tone} $color={scoreColor(record.percentage)}>
          {record.tone === 'new' ? <PiSparkle size={14} /> : <PiTrophy size={14} />}
          {record.label}
          {station.myRecord?.lastAttemptAt && ` · terakhir ${formatJakartaDateLong(station.myRecord.lastAttemptAt)}`}
        </Record>
      </div>

      <Tags>
        {tags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>)}
      </Tags>

      <Duration>{station.durationMinutes || 15} menit</Duration>

      <Action>
        <Button
          variant={record.tone === 'new' ? 'primary' : 'outline'}
          size="small"
          disabled={isStarting}
          onClick={() => onStart(station)}
        >
          {isStarting ? 'Membuat...' : record.tone === 'new' ? 'Mulai sesi' : 'Coba lagi'}
        </Button>
      </Action>
    </Row>
  )
}

export default StationRow
