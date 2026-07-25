import { useRef, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { EmptyChart, Legend, LegendDot, LegendItem } from './PerformanceChart.styles'

const BAR_SIZE = 40
const BAR_GAP = 12
const Y_AXIS_OFFSET = 27 // right margin + left margin correction

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
      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginBottom: '0.2rem' }}>{name}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: scoreColor(avgScore) }}>{avgScore}%</div>
    </div>
  )
}

function CustomTick({ x, y, payload }) {
  const label = payload.value
  const maxLen = 12
  const display = label.length > maxLen ? label.slice(0, maxLen) + '…' : label
  return (
    <text x={x} y={y + 10} textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight={500}>
      {display}
    </text>
  )
}

export default function PerformanceChart({ topics }) {
  const attempted = topics.filter(t => t.avgScore != null)
  const wrapperRef = useRef(null)
  const [wrapperWidth, setWrapperWidth] = useState(0)

  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(entries => setWrapperWidth(entries[0].contentRect.width))
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  if (attempted.length === 0) {
    return <EmptyChart>Belum ada sesi yang diselesaikan. Mulai latihan untuk melihat performa.</EmptyChart>
  }

  const data = attempted.map(t => ({ name: t.name, avgScore: t.avgScore }))
  const barsNeededWidth = attempted.length * (BAR_SIZE + BAR_GAP)
  const chartWidth = Math.max(barsNeededWidth + Y_AXIS_OFFSET, wrapperWidth)
  const xPadRight = Math.max(0, chartWidth - Y_AXIS_OFFSET - barsNeededWidth)

  return (
    <>
      <div ref={wrapperRef} style={{ width: '100%', overflowX: 'auto' }}>
        {wrapperWidth > 0 && (
          <BarChart
            width={chartWidth}
            height={200}
            data={data}
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
              padding={{ right: xPadRight }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 6 }} />
            <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={scoreColor(entry.avgScore)} />
              ))}
            </Bar>
          </BarChart>
        )}
      </div>
      <Legend>
        <LegendItem><LegendDot $color="#10b981" />≥75%</LegendItem>
        <LegendItem><LegendDot $color="#3b82f6" />60–74%</LegendItem>
        <LegendItem><LegendDot $color="#f59e0b" />45–59%</LegendItem>
        <LegendItem><LegendDot $color="#ef4444" />&lt;45%</LegendItem>
      </Legend>
    </>
  )
}
