import { useState } from 'react'
import { FaChartBar } from 'react-icons/fa6'
import { PanelCard, PanelHeader, PanelTitle, EmptyText } from '../../TopicList.styles'
import {
  StackedBar, StackedSegment, ProgressLegend, LegendItem, LegendDot, LegendCount,
  PerTopicSection, PerTopicLabel, PerTopicRow, PerTopicName, MiniBar, TotalCount,
  PaginationRow, PaginationBtn, PaginationInfo,
  SkeletonBlock, SkeletonLegendGrid, SkeletonPerTopicRow,
} from './ProgressPanel.styles'

const PAGE_SIZE = 10

const RATING_CONFIG = [
  { key: 'again', label: 'Ulangi', color: '#ef4444' },
  { key: 'hard',  label: 'Sulit',  color: '#f97316' },
  { key: 'good',  label: 'Baik',   color: '#22c55e' },
  { key: 'easy',  label: 'Mudah',  color: '#3b82f6' },
]

function totalReviewed(counts) {
  return (counts.again || 0) + (counts.hard || 0) + (counts.good || 0) + (counts.easy || 0)
}

function StackedBarDisplay({ counts }) {
  const total = totalReviewed(counts)
  if (!total) return <StackedBar />
  return (
    <StackedBar>
      {RATING_CONFIG.map(({ key, color }) => {
        const pct = ((counts[key] || 0) / total) * 100
        return pct > 0 ? <StackedSegment key={key} $color={color} $pct={pct} /> : null
      })}
    </StackedBar>
  )
}

function ProgressSkeleton() {
  return (
    <PanelCard>
      <SkeletonBlock $w="140px" $h="1.1rem" />
      <SkeletonBlock $w="100%" $h="16px" $radius="999px" />
      <SkeletonLegendGrid>
        {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} $h="1rem" />)}
      </SkeletonLegendGrid>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingTop: '0.875rem', borderTop: '1px solid #f3f4f6' }}>
        <SkeletonBlock $w="60px" $h="0.75rem" />
        {[80, 65, 90, 55].map((w, i) => (
          <SkeletonPerTopicRow key={i}>
            <SkeletonBlock $w="140px" $h="0.9rem" $radius="4px" />
            <SkeletonBlock $h="8px" $radius="999px" style={{ flex: 1 }} />
            <SkeletonBlock $w="1.5rem" $h="0.9rem" />
          </SkeletonPerTopicRow>
        ))}
      </div>
    </PanelCard>
  )
}

export default function ProgressPanel({ progress, isLoading }) {
  const [page, setPage] = useState(0)

  if (isLoading || !progress) return <ProgressSkeleton />

  const { totalCounts, topics } = progress
  const reviewedTopics = topics.filter(t => totalReviewed(t.counts) > 0)
  const totalPages = Math.ceil(reviewedTopics.length / PAGE_SIZE)
  const pageItems = reviewedTopics.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <PanelCard>
      <PanelHeader>
        <PanelTitle><FaChartBar style={{ color: '#0d9488', fontSize: '1rem', flexShrink: 0 }} /> Progress Kamu</PanelTitle>
      </PanelHeader>

      <StackedBarDisplay counts={totalCounts} />

      <ProgressLegend>
        {RATING_CONFIG.map(({ key, label, color }) => (
          <LegendItem key={key}>
            <LegendDot $color={color} />
            {label}
            <LegendCount>{totalCounts[key] || 0}</LegendCount>
          </LegendItem>
        ))}
      </ProgressLegend>

      {reviewedTopics.length > 0 && (
        <PerTopicSection>
          <PerTopicLabel>Per Topik</PerTopicLabel>
          {pageItems.map((t, i) => {
            const total = totalReviewed(t.counts)
            const rowDelay = `${i * 0.07}s`
            const barDelay = `${i * 0.07 + 0.18}s`
            return (
              <PerTopicRow key={t.nodeId} $delay={rowDelay}>
                <PerTopicName title={t.nodeName}>{t.nodeName}</PerTopicName>
                <MiniBar $delay={barDelay}>
                  {RATING_CONFIG.map(({ key, color }) => {
                    const pct = total ? ((t.counts[key] || 0) / total) * 100 : 0
                    return pct > 0 ? <StackedSegment key={key} $color={color} $pct={pct} /> : null
                  })}
                </MiniBar>
                <TotalCount>{total}</TotalCount>
              </PerTopicRow>
            )
          })}
          {totalPages > 1 && (
            <PaginationRow>
              <PaginationBtn onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹ Prev</PaginationBtn>
              <PaginationInfo>{page + 1} / {totalPages}</PaginationInfo>
              <PaginationBtn onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next ›</PaginationBtn>
            </PaginationRow>
          )}
        </PerTopicSection>
      )}
    </PanelCard>
  )
}
