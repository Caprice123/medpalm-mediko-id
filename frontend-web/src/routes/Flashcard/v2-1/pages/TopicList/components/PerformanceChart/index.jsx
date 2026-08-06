import { useState, useEffect, memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts'
import { EmptyChart, Legend, LegendDot, LegendItem } from './PerformanceChart.styles'

const BAR_SIZE = 75
const BAR_GAP = 24
const Y_AXIS_OFFSET = 27

const RATING_CONFIG = [
  { key: 'again', label: 'Ulangi', color: '#ef4444' },
  { key: 'hard',  label: 'Sulit',  color: '#f97316' },
  { key: 'good',  label: 'Baik',   color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah',  color: '#22c55e' },
]

function toChartRow(item) {
  const { again, hard, good, easy } = item.counts
  return { name: item.nodeName, again, hard, good, easy, total: again + hard + good + easy }
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '0.6rem 0.875rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem' }}>{row.name}</div>
      {RATING_CONFIG.map(({ key, label, color }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#374151' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
          {label}: <strong>{row[key]}</strong>
        </div>
      ))}
      <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>Total: {row.total}</div>
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
  const attempted = topics.filter(t => t.counts.again + t.counts.hard + t.counts.good + t.counts.easy > 0)
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
    return <EmptyChart>Belum ada kartu yang dipelajari. Mulai belajar untuk melihat performa.</EmptyChart>
  }

  const selectedTopic = selectedTopicId ? attempted.find(t => t.nodeId === selectedTopicId) : null
  const subtopics = selectedTopicId ? (subtopicsCache[selectedTopicId] || []) : []
  const subtopicsAttempted = subtopics.filter(s => s.counts.again + s.counts.hard + s.counts.good + s.counts.easy > 0)

  const displayData = (selectedTopicId ? subtopicsAttempted : attempted).map(toChartRow)

  const minChartWidth = displayData.length * (BAR_SIZE + BAR_GAP) + Y_AXIS_OFFSET
  const showDrillDownEmpty = selectedTopicId && !loadingSubtopics && subtopicsAttempted.length === 0

  return (
    <>
      {loadingSubtopics ? (
        <EmptyChart>Memuat subtopik...</EmptyChart>
      ) : showDrillDownEmpty ? (
        <EmptyChart>Belum ada subtopik {selectedTopic?.nodeName} yang dipelajari.</EmptyChart>
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
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#9ca3af' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 6 }} />
                {RATING_CONFIG.map(({ key, color }, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={color}
                    radius={i === RATING_CONFIG.length - 1 ? [6, 6, 0, 0] : 0}
                    // Without this, a 0-value segment for a given topic doesn't render at all —
                    // including its LabelList child — even when other segments in that stack do.
                    minPointSize={2}
                  >
                    {i === RATING_CONFIG.length - 1 && (
                      <LabelList
                        dataKey="total"
                        position="top"
                        style={{ fontSize: 13, fontWeight: 700, fill: '#374151' }}
                      />
                    )}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Legend>
        {RATING_CONFIG.map(({ key, label, color }) => (
          <LegendItem key={key}><LegendDot $color={color} />{label}</LegendItem>
        ))}
      </Legend>
    </>
  )
}

export default memo(PerformanceChart)
