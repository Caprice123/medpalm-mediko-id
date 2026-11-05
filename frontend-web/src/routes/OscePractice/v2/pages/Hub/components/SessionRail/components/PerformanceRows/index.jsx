import { useSelector } from 'react-redux'
import Loading from '@components/common/Loading'
import { MicroLabel, Numeric } from '../../../../Hub.styles'
import { scoreColor, formatDuration } from '../../../../../../utils/sessionState'
import { usePerformanceRows } from './hooks/usePerformanceRows'
import {
  Section,
  ClearFilter,
  Row,
  Name,
  Bar,
  Score,
  EmptyRows,
  Footnotes,
} from './PerformanceRows.styles'

// Weakest topic first, and every row is the filter for the station panel beside it.
function PerformanceRows() {
  const { selectTopic } = usePerformanceRows()
  const { performanceTopics, loading } = useSelector((state) => state.oscePractice)
  const activeTopicTag = useSelector((state) => state.oscePracticeV2.filter.topicTag)
  const completedCount = useSelector((state) => state.oscePracticeV2.hub?.counts?.completed) ?? 0
  const totalPracticeSeconds = useSelector((state) => state.oscePracticeV2.hub?.totalPracticeSeconds) ?? 0

  return (
    <>
      <Section>
        <h2>Performa per topik</h2>
        {activeTopicTag ? (
          <ClearFilter type="button" onClick={() => selectTopic('')}>
            Tampilkan semua
          </ClearFilter>
        ) : (
          <MicroLabel>Terlemah dulu</MicroLabel>
        )}
      </Section>

      {loading.isLoadingPerformance ? (
        <Loading type="oval" size="small" text="Memuat performa..." height="120px" />
      ) : performanceTopics.length === 0 ? (
        <EmptyRows>
          Belum ada stasiun yang dinilai. Satu topik muncul di sini begitu sesinya selesai
          dinilai, dan baris itu langsung bisa dipakai menyaring papan stasiun.
        </EmptyRows>
      ) : (
        performanceTopics.map((topic) => {
          const isActive = String(activeTopicTag) === String(topic.tagId)
          const color = scoreColor(topic.averageScore)

          return (
            <Row
              key={topic.tagId}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => selectTopic(isActive ? '' : topic.tagId)}
              title={`${topic.title} — rata-rata ${topic.averageScore} dari ${topic.sessionCount} stasiun dinilai`}
            >
              <Name $active={isActive}>{topic.title}</Name>
              <Bar $value={topic.averageScore} $color={color}><i /></Bar>
              <Score $color={color}>{Math.round(topic.averageScore)}</Score>
            </Row>
          )
        })
      )}

      <Footnotes>
        <div>
          <MicroLabel as="dt">Stasiun dinilai</MicroLabel>
          <dd><Numeric>{completedCount}</Numeric></dd>
        </div>
        <div>
          <MicroLabel as="dt">Total waktu latihan</MicroLabel>
          <dd><Numeric>{formatDuration(totalPracticeSeconds)}</Numeric></dd>
        </div>
      </Footnotes>
    </>
  )
}

export default PerformanceRows
