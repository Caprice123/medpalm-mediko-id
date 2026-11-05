import { useSelector } from 'react-redux'
import { PiCheckCircle, PiCircleDashed, PiWarningCircle } from 'react-icons/pi'
import Button from '@components/common/Button'
import { formatClock, clockUrgency, worksheetSections, topicTags, batchTags } from '../../../../../../utils/sessionState'
import { useLiveBlock } from './hooks/useLiveBlock'
import {
  LiveBlock as Block,
  BlockHead,
  Clock,
  ClockUnit,
  StationName,
  StationMeta,
  Marks,
  Mark,
  MarkDetail,
  Action,
  EmptyLead,
  ExpiredNote,
} from './LiveBlock.styles'

// The lead of the board: the station the student is in the middle of, its clock, and what it
// still owes the rubric. With nothing running it stays white and says what the board offers.
function LiveBlock({ onRequestStart }) {
  // Read here rather than threaded down from the page: nothing between the page and this block
  // branches on the resumable session, so forwarding it would only add a hop.
  const session = useSelector((state) => state.oscePracticeV2.hub?.resumable) ?? null
  const expiredCount = useSelector((state) => state.oscePracticeV2.hub?.expiredCount) ?? 0
  const { remaining, open } = useLiveBlock(session, { onRequestStart })

  if (!session) {
    return (
      <Block $live={false}>
        <BlockHead $live={false}>
          <h2>Tidak ada sesi berjalan</h2>
        </BlockHead>
        <EmptyLead>
          Pilih stasiun di papan sebelah untuk mulai. Baris performa di bawah bisa diklik untuk
          menyaring papan itu ke satu topik — itu cara tercepat menemukan stasiun yang paling
          layak kamu kerjakan berikutnya.
        </EmptyLead>
        {expiredCount > 0 && (
          <ExpiredNote>
            <PiWarningCircle size={16} />
            <span>
              {expiredCount} sesi kehabisan waktu dan belum dinilai. Buka dari riwayat untuk
              menyelesaikan penilaiannya.
            </span>
          </ExpiredNote>
        )}
      </Block>
    )
  }

  const urgency = clockUrgency(remaining)
  const isStarted = session.status === 'started'
  const rang = isStarted && remaining <= 0
  const meta = [
    ...topicTags(session.tags).map((tag) => tag.name),
    ...batchTags(session.tags).map((tag) => tag.name),
  ].join(' · ')

  return (
    <Block $live>
      <BlockHead $live>
        <h2>{isStarted ? 'Sesi berjalan' : 'Sesi siap dimulai'}</h2>
        <span>
          <Clock $urgency={urgency}>{formatClock(remaining)}</Clock>
          <ClockUnit>{isStarted ? 'sisa waktu' : `alokasi ${session.durationMinutes} menit`}</ClockUnit>
        </span>
      </BlockHead>

      <StationName $live>{session.topicTitle}</StationName>
      {meta && <StationMeta $live>{meta}</StationMeta>}

      {isStarted && (
        <Marks>
          {worksheetSections(session.progress).map((section) => (
            <Mark key={section.key} $filled={section.filled}>
              {section.filled ? <PiCheckCircle size={16} /> : <PiCircleDashed size={16} />}
              <strong>{section.label}</strong>
              <MarkDetail $filled={section.filled}>{section.detail}</MarkDetail>
            </Mark>
          ))}
        </Marks>
      )}

      <Action>
        <Button variant="secondary" fullWidth onClick={open}>
          {rang ? 'Buka & nilai sesi' : isStarted ? 'Lanjutkan sesi' : 'Mulai sesi'}
        </Button>
      </Action>
    </Block>
  )
}

export default LiveBlock
