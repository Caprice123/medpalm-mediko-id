import { useSelector } from 'react-redux'
import Loading from '@components/common/Loading'
import { Panel, PanelHead, Numeric } from '../../../../styles/surface.styles'
import { SCORE_BANDS, scoreColor } from '../../../../utils/sessionState'
import { usePerformancePanel } from './hooks/usePerformancePanel'
import {
  Plot,
  Row,
  Name,
  Bar,
  Score,
  Cases,
  Scale,
  TargetRule,
  Legend,
  LegendItem,
  LegendDot,
  Hint,
  EmptyRows,
  Count,
} from './PerformancePanel.styles'

const SCALE_TICKS = [0, 25, 50, 75, 100]
const TARGET = 75

// Every topic the student has been marked on, at rest on the page.
//
// This was two things before: five bar-mini rows in the rail, and the whole ranking as a
// recharts column chart behind a `Grafik` button. Two readings of the same three numbers, one
// of them behind a modal a student had to know was there — and the columns scrolled sideways
// past about seven topics, with each clinical topic name clamped to two lines inside 72px.
//
// One chart now, horizontal, holding every topic: the names read at full length, nothing
// scrolls sideways, and there is no top five to truncate.
function PerformancePanel() {
  const { selectTopic } = usePerformancePanel()
  const { performanceTopics, loading } = useSelector((state) => state.oscePractice)

  // The service sorts strongest first. On a page whose job is "what should I open next", the
  // weakest topic is the one worth reading first — and every row is a door into that topic's
  // stations, so the top row should be the most useful door on the page. Reversed here rather
  // than in the service, which other readers may order their own way.
  const rows = [...performanceTopics].reverse()

  return (
    <Panel>
      <PanelHead>
        <h2>Performa per topik</h2>
        {performanceTopics.length > 0 && (
          <Count><Numeric>{performanceTopics.length}</Numeric> topik dinilai</Count>
        )}
      </PanelHead>

      {loading.isLoadingPerformance ? (
        <Loading type="oval" size="small" text="Memuat performa..." height="180px" />
      ) : rows.length === 0 ? (
        <EmptyRows>
          Belum ada kasus yang dinilai. Satu topik muncul di sini begitu sesinya selesai
          dinilai, dan baris itu langsung membuka daftar kasus yang tersaring ke topik itu.
        </EmptyRows>
      ) : (
        <>
          <Plot>
            <TargetRule aria-hidden="true"><span>target {TARGET}</span></TargetRule>

            {rows.map((topic) => {
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
                  <Cases><Numeric>{topic.sessionCount}</Numeric> kasus</Cases>
                </Row>
              )
            })}

            <Scale aria-hidden="true">
              <span>
                {SCALE_TICKS.map((tick) => <Numeric key={tick}>{tick}</Numeric>)}
              </span>
            </Scale>
          </Plot>

          <Legend>
            {SCORE_BANDS.map(({ min, label, color }) => (
              <LegendItem key={min}><LegendDot $color={color} />{label}</LegendItem>
            ))}
            <Hint>Klik satu baris — daftar kasus langsung tersaring ke topik itu.</Hint>
          </Legend>
        </>
      )}
    </Panel>
  )
}

export default PerformancePanel
