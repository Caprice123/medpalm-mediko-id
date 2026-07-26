import { useState, useEffect, memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts'
import { EmptyChart, Legend, LegendDot, LegendItem } from './PerformanceChart.styles'

const BAR_SIZE = 75
const BAR_GAP = 24
const Y_AXIS_OFFSET = 27

function scoreColor(score) {
  if (score == null) return '#e5e7eb'
  if (score >= 75) return '#10b981'
  if (score >= 60) return '#3b82f6'
  if (score >= 45) return '#f59e0b'
  return '#ef4444'
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, avgScore } = payload[0].payload
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '0.6rem 0.875rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.2rem' }}>{name}</div>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: scoreColor(avgScore) }}>{avgScore}%</div>
    </div>
  )
}

function CustomTick({ x, y, payload }) {
  const label = payload.value
  const maxLen = 12
  const display = label.length > maxLen ? label.slice(0, maxLen) + '…' : label
  return (
    <text x={x} y={y + 10} textAnchor="middle" fontSize={13} fill="#6b7280" fontWeight={500}>
      {display}
    </text>
  )
}

function PerformanceChart({ topics, subtopicsCache = {}, onRequestSubtopics, selectedTopicId, onSelectTopic }) {
  const attempted = topics.filter(t => t.avgScore != null)
  const [loadingSubtopics, setLoadingSubtopics] = useState(false)

  // Reset drill-down when topic list changes
  useEffect(() => { onSelectTopic(null) }, [attempted.length])

  // Fetch fresh subtopic progress whenever the selected topic changes
  useEffect(() => {
    if (!selectedTopicId) return
    setLoadingSubtopics(true)
    onRequestSubtopics?.(selectedTopicId).finally(() => setLoadingSubtopics(false))
  }, [selectedTopicId])

  if (attempted.length === 0) {
    return <EmptyChart>Belum ada sesi yang diselesaikan. Mulai latihan untuk melihat performa.</EmptyChart>
  }

  const selectedTopic = selectedTopicId ? attempted.find(t => t.id === selectedTopicId) : null
  const subtopics = selectedTopicId ? (subtopicsCache[selectedTopicId] || []) : []
  const subtopicsWithScore = subtopics.filter(s => s.avgScore != null)

  const displayData = selectedTopicId
    ? subtopicsWithScore.map(s => ({ name: s.name, avgScore: s.avgScore }))
    : attempted.map(t => ({ name: t.name, avgScore: t.avgScore }))

  const minChartWidth = displayData.length * (BAR_SIZE + BAR_GAP) + Y_AXIS_OFFSET
  const showDrillDownEmpty = selectedTopicId && !loadingSubtopics && subtopicsWithScore.length === 0

  return (
    <>
      {loadingSubtopics ? (
        <EmptyChart>Memuat subtopik...</EmptyChart>
      ) : showDrillDownEmpty ? (
        <EmptyChart>Belum ada subtopik {selectedTopic?.name} yang diselesaikan.</EmptyChart>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: minChartWidth }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={displayData}
                barSize={BAR_SIZE}
                barCategoryGap={BAR_GAP}
                margin={{ top: 16, right: 16, left: -24, bottom: 8 }}
              >
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  tick={<CustomTick />}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={v => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#9ca3af' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 6 }} />
                <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                  {displayData.map((entry, i) => (
                    <Cell key={i} fill={scoreColor(entry.avgScore)} />
                  ))}
                  <LabelList
                    dataKey="avgScore"
                    position="top"
                    formatter={v => `${v}%`}
                    style={{ fontSize: 13, fontWeight: 700, fill: '#374151' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Legend>
        <LegendItem><LegendDot $color="#10b981" />≥75%</LegendItem>
        <LegendItem><LegendDot $color="#3b82f6" />60–74%</LegendItem>
        <LegendItem><LegendDot $color="#f59e0b" />45–59%</LegendItem>
        <LegendItem><LegendDot $color="#ef4444" />&lt;45%</LegendItem>
      </Legend>
    </>
  )
}

export default memo(PerformanceChart)
