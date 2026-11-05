import { PiSparkle, PiTrophy } from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { recordSummary, scoreColor, topicTags, batchTags } from '../../../../../../utils/sessionState'
import { Row, Title, Tags, Tag, Duration, Record, Action } from './StationRow.styles'

// One station as a data row. The record line is the reason this is a row and not a card: a
// student scanning forty of these is comparing their own history across them, which a grid of
// equal-weight cards makes harder, not easier.
//
// The scenario is deliberately not rendered here, even though the row has the width for it.
// Reading the brief is the first move of the station itself, and the brief rail holds it there
// with the clock running — so neither the catalogue nor the start gate shows it. What a student
// needs to pick a row is the title, the tags, and their own record on it.
function StationRow({ station, isStarting, onStart }) {
  const record = recordSummary(station.myRecord)
  const tags = [...topicTags(station.tags), ...batchTags(station.tags)]

  return (
    <Row>
      <div>
        <Title>{station.title}</Title>
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
