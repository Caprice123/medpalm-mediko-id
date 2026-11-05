import { memo } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts'
import { colors } from '@config/colors'
import {
  ChartScroll,
  ChartWidth,
  EmptyChart,
  Legend,
  LegendDot,
  LegendItem,
  TooltipBox,
  TooltipRow,
  TooltipTitle,
} from './PerformanceChart.styles'

// The rail's rows, read as a ranking instead of a list. The rows answer "mana yang mau aku
// buka"; this answers "di mana aku sekarang" — so it lives behind a button rather than in the
// rail, where it would be a second reading of the same three numbers.
//
// One column per topic, so the chart scrolls rather than compressing once a student has
// practised more topics than fit. Letting recharts divide the width turns a dozen topics into
// hairlines with colliding labels.
const BAR_SIZE = 72
const BAR_GAP = 24
const Y_AXIS_WIDTH = 34

// Score bands, strongest first. The cut-offs match how a result is read everywhere else in OSCE
// practice: 75 is the mark a station is expected to clear, below 60 is a retry.
const BANDS = [
  { min: 75, color: colors.success.darker, label: '75+ aman' },
  { min: 60, color: colors.warning.dark, label: '60–74 cukup' },
  { min: 0, color: colors.error.main, label: '< 60 perlu latihan' },
]

const bandColor = (value) => BANDS.find((band) => value >= band.min).color

const toChartRow = (topic) => ({
  key: topic.tagId,
  name: topic.title,
  // Kept unrounded for the bar height and the tooltip; the label above the bar rounds.
  score: Number(topic.averageScore) || 0,
  sessionCount: topic.sessionCount,
})

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload

  return (
    <TooltipBox>
      <TooltipTitle>{row.name}</TooltipTitle>
      <TooltipRow>Rata-rata: <strong>{row.score.toFixed(1)}</strong></TooltipRow>
      <TooltipRow>Kasus dinilai: <strong>{row.sessionCount}</strong></TooltipRow>
    </TooltipBox>
  )
}

// foreignObject embeds a real HTML node inside the SVG, so the browser's own CSS text layout
// does the wrapping/clamping — no manual char-count guessing, which matters because clinical
// topic names run long.
function CustomTick({ x, y, payload }) {
  return (
    <foreignObject x={x - BAR_SIZE / 2} y={y + 2} width={BAR_SIZE} height={36}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        title={payload.value}
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: colors.neutral.gray500,
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

// `topics` arrives already sorted strongest first by the performance service, so the chart
// renders the ranking it was given rather than imposing a second order of its own.
function PerformanceChart({ topics }) {
  if (!topics?.length) {
    return (
      <EmptyChart>
        Belum ada kasus yang dinilai. Satu topik muncul di sini setelah sesinya selesai dinilai.
      </EmptyChart>
    )
  }

  const rows = topics.map(toChartRow)
  const minChartWidth = rows.length * (BAR_SIZE + BAR_GAP) + Y_AXIS_WIDTH

  return (
    <>
      <ChartScroll>
        <ChartWidth $minWidth={minChartWidth}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={rows}
              barSize={BAR_SIZE}
              barCategoryGap={BAR_GAP}
              margin={{ top: 22, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid vertical={false} stroke={colors.neutral.gray100} />
              <XAxis
                dataKey="name"
                tick={<CustomTick />}
                axisLine={false}
                tickLine={false}
                interval={0}
                height={42}
              />
              <YAxis
                // Pinned to the full scale instead of the data range, so a bar's height means
                // the same thing on every student's chart.
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                width={Y_AXIS_WIDTH}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: colors.neutral.gray400 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: colors.neutral.gray50, radius: 6 }} />
              <Bar
                dataKey="score"
                radius={[6, 6, 0, 0]}
                // Without this a topic averaging 0 renders as a gap in the chart rather than as
                // a bar, and its label disappears with it.
                minPointSize={2}
              >
                {rows.map((row) => (
                  <Cell key={row.key} fill={bandColor(row.score)} />
                ))}
                <LabelList
                  dataKey="score"
                  position="top"
                  formatter={(value) => Math.round(value)}
                  style={{ fontSize: 12, fontWeight: 700, fill: colors.neutral.gray700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWidth>
      </ChartScroll>

      <Legend>
        {BANDS.map(({ min, label, color }) => (
          <LegendItem key={min}><LegendDot $color={color} />{label}</LegendItem>
        ))}
      </Legend>
    </>
  )
}

export default memo(PerformanceChart)
