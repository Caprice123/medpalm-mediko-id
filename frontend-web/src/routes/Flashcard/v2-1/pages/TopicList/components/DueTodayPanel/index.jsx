import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PanelCard } from '../../TopicList.styles'
import {
  HeaderRow, PanelTitle, CountBlock, CountNumber, CountLabel, SubtitleText,
  DueList, DueItem, ItemNumber, ItemContent, ItemTitle, ItemSub,
  ItemRight, ItemCount,
  StartAllBtn,
  PaginationRow, PaginationBtn, PaginationInfo,
  SkeletonBlock, SkeletonCircle, SkeletonDueItem,
} from './DueTodayPanel.styles'

const PAGE_SIZE = 10

function DueTodaySkeleton() {
  return (
    <PanelCard>
      <HeaderRow>
        <SkeletonBlock $w="110px" $h="1.1rem" />
        <SkeletonBlock $w="60px" $h="1.1rem" style={{ marginLeft: 'auto' }} />
      </HeaderRow>
      <SkeletonBlock $w="80%" $h="0.85rem" />
      {[75, 60, 85].map((w, i) => (
        <SkeletonDueItem key={i}>
          <SkeletonCircle />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <SkeletonBlock $w={`${w}%`} $h="0.95rem" />
            <SkeletonBlock $w="40%" $h="0.75rem" />
          </div>
          <SkeletonBlock $w="2rem" $h="0.95rem" />
        </SkeletonDueItem>
      ))}
    </PanelCard>
  )
}

export default function DueTodayPanel({ onStartAll, onStartNode, isStarting, batchSize }) {
  const [page, setPage] = useState(0)
  const { dueToday, loading } = useSelector(s => s.flashcardNodes)

  if (loading.isFetchingDueToday) return <DueTodaySkeleton />

  const subtopics = dueToday?.subtopics ?? []
  if (subtopics.length === 0) return null

  const startCount = Math.min(dueToday?.total ?? 0, batchSize)
  const totalPages = Math.ceil(subtopics.length / PAGE_SIZE)
  const pageItems = subtopics.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const pageOffset = page * PAGE_SIZE

  return (
    <PanelCard>
      <HeaderRow>
        <PanelTitle>Due Today</PanelTitle>
        {dueToday && (
          <CountBlock>
            <CountNumber>{dueToday.total}</CountNumber>
            <CountLabel>kartu</CountLabel>
          </CountBlock>
        )}
        <StartAllBtn onClick={onStartAll} disabled={isStarting}>
          {isStarting ? 'Memulai...' : `Mulai ${startCount} Kartu`}
        </StartAllBtn>
      </HeaderRow>

      <SubtitleText>
        Kartu dikelompokkan per sub-topik. Selesaikan satu sub-topik sebelum lanjut — tanpa diacak.
      </SubtitleText>
      <DueList>
        {pageItems.map((s, i) => (
          <DueItem key={s.nodeId} $delay={`${i * 0.07}s`} onClick={() => !isStarting && onStartNode(s.nodeId)}>
            <ItemNumber>{pageOffset + i + 1}</ItemNumber>
            <ItemContent>
              <ItemTitle>{s.nodeName}</ItemTitle>
              <ItemSub>{s.topicName}</ItemSub>
            </ItemContent>
            <ItemRight>
              <ItemCount>{s.dueCount}</ItemCount>
            </ItemRight>
          </DueItem>
        ))}
      </DueList>
      {totalPages > 1 && (
        <PaginationRow>
          <PaginationBtn onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹ Prev</PaginationBtn>
          <PaginationInfo>{page + 1} / {totalPages}</PaginationInfo>
          <PaginationBtn onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next ›</PaginationBtn>
        </PaginationRow>
      )}
    </PanelCard>
  )
}
