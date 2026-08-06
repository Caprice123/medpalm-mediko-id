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

// foreignObject embeds a real HTML node inside the SVG, so the browser's own CSS
// text layout does the wrapping/clamping — no manual char-count guessing needed.
function CustomTick({ x, y, payload }) {
  return (
    <foreignObject x={x - BAR_SIZE / 2} y={y} width={BAR_SIZE} height={36}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '15px',
          wordBreak: 'break-word',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {payload.value}
      </div>
    </foreignObject>
  )
}

function PerformanceChart({ modules, submodulesCache = {}, onRequestSubmodules, selectedModuleId, onSelectModule }) {
  const attempted = modules.filter(m => m.counts.again + m.counts.hard + m.counts.good + m.counts.easy > 0)
  const [loadingSubmodules, setLoadingSubmodules] = useState(false)

  // Reset drill-down when module list changes
  useEffect(() => { onSelectModule(null) }, [attempted.length])

  // Fetch fresh submodule progress whenever the selected module changes
  useEffect(() => {
    if (!selectedModuleId) return
    setLoadingSubmodules(true)
    onRequestSubmodules?.(selectedModuleId).finally(() => setLoadingSubmodules(false))
  }, [selectedModuleId])

  if (attempted.length === 0) {
    return <EmptyChart>Belum ada soal yang dikerjakan. Mulai belajar untuk melihat performa.</EmptyChart>
  }

  const selectedModule = selectedModuleId ? attempted.find(m => m.nodeId === selectedModuleId) : null
  const submodules = selectedModuleId ? (submodulesCache[selectedModuleId] || []) : []
  const submodulesAttempted = submodules.filter(s => s.counts.again + s.counts.hard + s.counts.good + s.counts.easy > 0)

  const displayData = (selectedModuleId ? submodulesAttempted : attempted).map(toChartRow)

  const minChartWidth = displayData.length * (BAR_SIZE + BAR_GAP) + Y_AXIS_OFFSET
  const showDrillDownEmpty = selectedModuleId && !loadingSubmodules && submodulesAttempted.length === 0

  return (
    <>
      {loadingSubmodules ? (
        <EmptyChart>Memuat submodul...</EmptyChart>
      ) : showDrillDownEmpty ? (
        <EmptyChart>Belum ada submodul {selectedModule?.nodeName} yang dikerjakan.</EmptyChart>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: minChartWidth }}>
            <ResponsiveContainer width="100%" height={232}>
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
                  height={40}
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
                    // Without this, a 0-value segment for a given module doesn't render at all —
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
