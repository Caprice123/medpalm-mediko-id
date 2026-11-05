import { useSelector } from 'react-redux'
import { PiChartBar } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import Modal from '@components/common/Modal'
import { MicroLabel, Numeric } from '../../../../../../styles/surface.styles'
import PerformanceChart from '../../../../../../components/PerformanceChart'
import { scoreColor, formatDuration } from '../../../../../../utils/sessionState'
import { usePerformanceRows } from './hooks/usePerformanceRows'
import {
  Section,
  ChartButton,
  Row,
  Name,
  Bar,
  Score,
  EmptyRows,
  Footnotes,
} from './PerformanceRows.styles'

// The rail carries the top five only. It is 340px of a page about the session in front of the
// student, not a report: a dozen rows of bar-and-number turns the lead block into a scoreboard
// and pushes the footnotes off the fold. The chart holds every topic, and the button says so
// when there are more than the rail is showing.
const RAIL_ROWS = 5

// Strongest topic first, and every row is a way into the catalogue filtered to that topic.
function PerformanceRows() {
  const { selectTopic, isChartOpen, openChart, closeChart } = usePerformanceRows()
  const { performanceTopics, loading } = useSelector((state) => state.oscePractice)
  const completedCount = useSelector((state) => state.oscePracticeV2.hub?.completedCount) ?? 0
  const totalPracticeSeconds = useSelector((state) => state.oscePracticeV2.hub?.totalPracticeSeconds) ?? 0

  // Already sorted strongest first by the service, so the top five is a plain head of the list.
  const railTopics = performanceTopics.slice(0, RAIL_ROWS)
  const isTruncated = performanceTopics.length > RAIL_ROWS

  return (
    <>
      <Section>
        <h2>Performa per topik</h2>
        {performanceTopics.length > 0 && (
          <ChartButton type="button" onClick={openChart}>
            <PiChartBar size={15} />
            {isTruncated ? `Semua ${performanceTopics.length} topik` : 'Grafik'}
          </ChartButton>
        )}
      </Section>

      {loading.isLoadingPerformance ? (
        <Loading type="oval" size="small" text="Memuat performa..." height="120px" />
      ) : performanceTopics.length === 0 ? (
        <EmptyRows>
          Belum ada kasus yang dinilai. Satu topik muncul di sini begitu sesinya selesai
          dinilai, dan baris itu langsung membuka daftar kasus yang tersaring ke topik itu.
        </EmptyRows>
      ) : (
        railTopics.map((topic) => {
          const color = scoreColor(topic.averageScore)

          return (
            <Row
              key={topic.tagId}
              type="button"
              onClick={() => selectTopic(topic.tagId)}
              title={`${topic.title} — rata-rata ${topic.averageScore} dari ${topic.sessionCount} kasus dinilai. Buka daftar kasus topik ini.`}
            >
              <Name>{topic.title}</Name>
              <Bar $value={topic.averageScore} $color={color}><i /></Bar>
              <Score $color={color}>{Math.round(topic.averageScore)}</Score>
            </Row>
          )
        })
      )}

      <Footnotes>
        <div>
          <MicroLabel as="dt">Kasus dinilai</MicroLabel>
          <dd><Numeric>{completedCount}</Numeric></dd>
        </div>
        <div>
          <MicroLabel as="dt">Total waktu latihan</MicroLabel>
          <dd><Numeric>{formatDuration(totalPracticeSeconds)}</Numeric></dd>
        </div>
      </Footnotes>

      <Modal
        isOpen={isChartOpen}
        onClose={closeChart}
        title="Performa per topik"
        size="large"
      >
        {/* The whole ranking, not the rail's five. */}
        <PerformanceChart topics={performanceTopics} />
      </Modal>
    </>
  )
}

export default PerformanceRows
