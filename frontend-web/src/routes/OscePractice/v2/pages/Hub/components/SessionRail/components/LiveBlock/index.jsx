import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '@components/common/Button'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import { formatClock, clockUrgency, topicTags, batchTags } from '../../../../../../utils/sessionState'
import { useLiveBlock } from './hooks/useLiveBlock'
import {
  LiveBlock as Block,
  BlockHead,
  Clock,
  ClockUnit,
  StationName,
  StationMeta,
  Action,
  EmptyLead,
} from './LiveBlock.styles'

// The lead of the page: which station the student is in the middle of, and its clock. With
// nothing running it stays white and points at the catalogue.
//
// It used to also list what the session still owed the rubric — filled/empty marks per
// worksheet section, with a message count. That is the worksheet's own job, inside the station,
// where it can still be acted on; out here it was a progress report on a room the student had
// already left, and it cost four per-session subquery counts to build.
function LiveBlock({ onRequestStart }) {
  // Read here rather than threaded down from the page: nothing between the page and this block
  // branches on the resumable session, so forwarding it would only add a hop.
  const session = useSelector((state) => state.oscePracticeV2.hub?.resumable) ?? null
  const { remaining, open } = useLiveBlock(session, { onRequestStart })

  if (!session) {
    return (
      <Block $live={false}>
        <BlockHead $live={false}>
          <h2>Tidak ada sesi berjalan</h2>
        </BlockHead>
        <EmptyLead>
          Belum ada yang berjalan. Buka <Link to={OscePracticeRoute.stationsRoute}>daftar kasus</Link>{' '}
          untuk memilih — atau klik satu baris performa di bawah, dan daftarnya langsung terbuka
          tersaring ke topik itu. Itu cara tercepat menemukan kasus yang paling layak kamu
          kerjakan berikutnya.
        </EmptyLead>
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
        {/* Three states, not two. A session whose bell has rung is still `started` in the
            database until the evaluation runs, so branching on `isStarted` alone labelled it
            "Sesi berjalan" beside a clock reading 00:00. */}
        <h2>{rang ? 'Waktu habis' : isStarted ? 'Sesi berjalan' : 'Sesi siap dimulai'}</h2>
        <span>
          <Clock $urgency={urgency}>{formatClock(remaining)}</Clock>
          <ClockUnit>
            {rang ? 'belum dinilai' : isStarted ? 'sisa waktu' : `alokasi ${session.durationMinutes} menit`}
          </ClockUnit>
        </span>
      </BlockHead>

      <StationName $live title={session.topicTitle}>{session.topicTitle}</StationName>
      {meta && <StationMeta $live>{meta}</StationMeta>}

      <Action>
        <Button variant="secondary" fullWidth onClick={open}>
          {rang ? 'Buka & nilai sesi' : isStarted ? 'Lanjutkan sesi' : 'Mulai sesi'}
        </Button>
      </Action>
    </Block>
  )
}

export default LiveBlock
