import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { actions } from '@store/flashcard/reducer'
import { fetchV2UserDecks } from '@store/flashcard/v2/userAction'
import { fetchReviewStats, startReviewSession } from '@store/review/userAction'
import { fetchPublicConstants } from '@store/constant/userAction'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import FilterComponent from '@components/common/Filter'
import EmptyState from '@components/common/EmptyState'
import DeckCard from './components/DeckCard'
import ReviewCustomModal from './components/ReviewCustomModal'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import { FlashcardRoute } from '../../../routes'
import {
  Container, PageHeader, Title, Grid, LoadMoreRow,
  StatsPanel,
  HeroCard, HeroLeft, HeroEyebrow, HeroNumber, HeroSub,
  HeroRight, HeroStatBox, HeroStatNum, HeroStatLabel,
  SectionRow, SectionLabel, SectionLine,
  TopicSplitLayout, TopicScrollList, TopicResizeHandle, TopicItem, TopicName, DuePill,
  TopicDetailPanel, TopicDetailTitle, TopicStatRow, TopicStat, TopicStatNum, TopicStatLabel,
  LoadMoreTopicBtn,
  ReviewAllBanner, ReviewAllLeft, ReviewAllEyebrow, ReviewAllCount, ReviewAllSub,
  ReviewAllStats, ReviewAllStatBox, ReviewAllStatNum, ReviewAllStatLabel,
  ReviewAllDesc, ReviewAllEmptyBox,
} from './List.styles'

const DIST = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

const PAGE_SIZE = 6

function ReviewStats({ stats }) {
  const [selectedId, setSelectedId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [listWidth, setListWidth] = useState(220)
  const [isResizing, setIsResizing] = useState(false)
  const listWidthRef = useRef(220)
  const startXRef = useRef(0)

  const handleResizeStart = (e) => {
    e.preventDefault()
    startXRef.current = e.clientX
    listWidthRef.current = listWidth
    setIsResizing(true)
    const onMove = (e) => {
      const delta = e.clientX - startXRef.current
      setListWidth(Math.max(140, Math.min(360, listWidthRef.current + delta)))
    }
    const onUp = () => {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  useEffect(() => {
    if (stats?.topics?.length > 0) {
      setSelectedId(stats.topics[0].nodeId)
    }
  }, [stats])

  if (!stats) return null

  const totalCards   = stats.topics.reduce((s, t) => s + t.totalCards, 0)
  const totalNew     = stats.topics.reduce((s, t) => s + (t.counts.new || 0), 0)
  const totalStudied = totalCards - totalNew

  const visibleTopics = stats.topics.slice(0, visibleCount)
  const hasMore = visibleCount < stats.topics.length
  const selectedTopic = stats.topics.find(t => t.nodeId === selectedId)

  return (
    <StatsPanel>
      {stats.dueCount > 0 && (
        <HeroCard>
          <HeroLeft>
            <HeroEyebrow>Siap Diulang Hari Ini</HeroEyebrow>
            <HeroNumber>{stats.dueCount}</HeroNumber>
            <HeroSub>kartu menunggu reviewmu</HeroSub>
          </HeroLeft>
          {totalNew > 0 && (
            <HeroRight>
              <HeroStatBox>
                <HeroStatNum>{totalNew}</HeroStatNum>
                <HeroStatLabel>Baru</HeroStatLabel>
              </HeroStatBox>
            </HeroRight>
          )}
        </HeroCard>
      )}

      {stats.topics.length > 0 && (
        <>
          <SectionRow>
            <SectionLabel>Distribusi per Topik</SectionLabel>
            <SectionLine />
          </SectionRow>

          <TopicSplitLayout $resizing={isResizing}>
            <TopicScrollList $width={listWidth}>
              {visibleTopics.map((topic, i) => {
                const isLast = i === visibleTopics.length - 1 && !hasMore
                return (
                  <TopicItem
                    key={topic.nodeId}
                    $selected={selectedId === topic.nodeId}
                    $last={isLast}
                    onClick={() => setSelectedId(topic.nodeId)}
                  >
                    <TopicName $selected={selectedId === topic.nodeId}>{topic.nodeName}</TopicName>
                  </TopicItem>
                )
              })}
              {hasMore && (
                <LoadMoreTopicBtn onClick={() => setVisibleCount(v => v + PAGE_SIZE)}>
                  + {Math.min(PAGE_SIZE, stats.topics.length - visibleCount)} topik lagi
                </LoadMoreTopicBtn>
              )}
            </TopicScrollList>

            <TopicResizeHandle
              onMouseDown={handleResizeStart}
              data-dragging={isResizing ? 'true' : undefined}
            />

            {selectedTopic && (
              <TopicDetailPanel>
                <TopicDetailTitle>{selectedTopic.nodeName}</TopicDetailTitle>
                <TopicStatRow>
                  {DIST.map(d => (
                    <TopicStat key={d.key}>
                      <TopicStatNum $color={d.color}>{selectedTopic.counts[d.key] || 0}</TopicStatNum>
                      <TopicStatLabel>{d.label}</TopicStatLabel>
                    </TopicStat>
                  ))}
                  <TopicStat>
                    <TopicStatNum>{selectedTopic.totalCards}</TopicStatNum>
                    <TopicStatLabel>Total</TopicStatLabel>
                  </TopicStat>
                </TopicStatRow>
              </TopicDetailPanel>
            )}
          </TopicSplitLayout>
        </>
      )}
    </StatsPanel>
  )
}

function FlashcardV2ListPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [departments, setDepartments] = useState([])
  const [topics, setTopics] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [reviewAllOpen, setReviewAllOpen] = useState(false)
  const [reviewCustomOpen, setReviewCustomOpen] = useState(false)
  const { decks, pagination, loading, filters } = useSelector(state => state.flashcard)
  const { stats, loading: reviewLoading } = useSelector(state => state.review)
  const constants = useSelector(state => state.constant.constants)
  const isLoading = loading?.isGetListDecksLoading

  const [allTopics, setAllTopics] = useState([])

  useEffect(() => {
    dispatch(actions.setPage(1))
    dispatch(fetchV2UserDecks())
    dispatch(fetchReviewStats())
    dispatch(fetchPublicConstants(['flashcard_feature_title', 'flashcard_feature_description']))
    getWithToken(Endpoints.api.featureNodes, { nodeType: 'department' }).then(res => {
      setDepartments((res.data.data || []).map(n => ({ value: String(n.id), label: n.name })))
    })
    getWithToken(Endpoints.api.featureNodes, { nodeType: 'topic' }).then(res => {
      setAllTopics((res.data.data || []).map(n => ({ value: String(n.id), label: n.name, parentId: String(n.parentId) })))
    })
    return () => { dispatch(actions.setDecks([])) }
  }, [dispatch])

  useEffect(() => {
    if (!selectedDept) {
      setTopics(allTopics)
    } else {
      setTopics(allTopics.filter(t => t.parentId === selectedDept.value))
    }
  }, [selectedDept, allTopics])

  const handleSearch = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchV2UserDecks())
  }

  const handleLoadMore = () => {
    dispatch(actions.setPage(pagination.page + 1))
    dispatch(fetchV2UserDecks())
  }

  const autoFilter = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchV2UserDecks())
  }

  return (
    <Container>
      <PageHeader>
        <div>
          <Title>{constants?.flashcard_feature_title || 'Flashcard'}</Title>
          {constants?.flashcard_feature_description && (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
              {constants.flashcard_feature_description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => setReviewAllOpen(true)}>
            Review Semua
          </Button>
          <Button variant="primary" onClick={() => setReviewCustomOpen(true)}>
            Review Kustom
          </Button>
        </div>
      </PageHeader>

      {!reviewLoading.isFetchingStats && <ReviewStats stats={stats} />}

      {isLoading && decks.length === 0 ? (
        <EmptyState icon="🎴" title="Memuat deck..." />
      ) : (
        <>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <form onSubmit={e => { e.preventDefault(); handleSearch() }}>
              <FilterComponent>
                <FilterComponent.Group>
                  <FilterComponent.Label>Nama Deck</FilterComponent.Label>
                  <TextInput
                    placeholder="Cari nama deck..."
                    value={filters.search}
                    onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
                  />
                </FilterComponent.Group>
                <FilterComponent.Group>
                  <FilterComponent.Label>Departemen</FilterComponent.Label>
                  <Dropdown
                    placeholder="Semua departemen..."
                    options={departments}
                    value={selectedDept}
                    onChange={opt => {
                      setSelectedDept(opt)
                      dispatch(actions.updateFilter({ key: 'department', value: opt?.value || '' }))
                      dispatch(actions.updateFilter({ key: 'topic', value: '' }))
                      autoFilter()
                    }}
                    isClearable
                  />
                </FilterComponent.Group>
                <FilterComponent.Group>
                  <FilterComponent.Label>Topik</FilterComponent.Label>
                  <Dropdown
                    placeholder="Semua topik..."
                    options={topics}
                    value={topics.find(t => t.value === filters.topic) || null}
                    onChange={opt => {
                      dispatch(actions.updateFilter({ key: 'topic', value: opt?.value || '' }))
                      autoFilter()
                    }}
                    isClearable
                  />
                </FilterComponent.Group>
              </FilterComponent>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button variant="primary" type="submit">🔍 Cari</Button>
              </div>
            </form>
          </div>

          {decks.length === 0 ? (
            <EmptyState icon="🎴" title="Belum ada deck tersedia" />
          ) : (
          <Grid>
            {decks.map(deck => <DeckCard key={deck.uniqueId} deck={deck} />)}
          </Grid>
          )}

          {!pagination.isLastPage && (
            <LoadMoreRow>
              <Button variant="secondary" onClick={handleLoadMore} disabled={isLoading}>
                {isLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
              </Button>
            </LoadMoreRow>
          )}
        </>
      )}
      <ReviewCustomModal isOpen={reviewCustomOpen} onClose={() => setReviewCustomOpen(false)} />

      <Modal
        isOpen={reviewAllOpen}
        onClose={() => setReviewAllOpen(false)}
        title="Review Semua"
        footer={
          <Button
            variant="primary"
            onClick={() => dispatch(startReviewSession(
              { type: 'all', recordType: 'flashcard_card', mode: 'due_today' },
              (uniqueId) => { setReviewAllOpen(false); navigate(FlashcardRoute.sessionRoute(uniqueId)) }
            ))}
            disabled={reviewLoading.isFetchingSession}
          >
            {reviewLoading.isFetchingSession ? 'Memuat...' : 'Mulai Sesi'}
          </Button>
        }
      >
        {stats?.dueCount > 0 ? (() => {
          const totalNew = (stats.topics || []).reduce((s, t) => s + (t.counts?.new || 0), 0)
          const totalReview = stats.dueCount - totalNew
          return (
            <ReviewAllBanner>
              <ReviewAllLeft>
                <ReviewAllEyebrow>Jatuh Tempo Hari Ini</ReviewAllEyebrow>
                <ReviewAllCount>{stats.dueCount}</ReviewAllCount>
                <ReviewAllSub>kartu menunggu reviewmu</ReviewAllSub>
              </ReviewAllLeft>
              <ReviewAllStats>
                {totalNew > 0 && (
                  <ReviewAllStatBox>
                    <ReviewAllStatNum>{totalNew}</ReviewAllStatNum>
                    <ReviewAllStatLabel>Baru</ReviewAllStatLabel>
                  </ReviewAllStatBox>
                )}
                {totalReview > 0 && (
                  <ReviewAllStatBox>
                    <ReviewAllStatNum>{totalReview}</ReviewAllStatNum>
                    <ReviewAllStatLabel>Ulang</ReviewAllStatLabel>
                  </ReviewAllStatBox>
                )}
              </ReviewAllStats>
            </ReviewAllBanner>
          )
        })() : (
          <ReviewAllEmptyBox>
            Tidak ada kartu yang jatuh tempo hari ini. Kembali lagi besok! 🎉
          </ReviewAllEmptyBox>
        )}
        <ReviewAllDesc>
          Kartu diprioritaskan berdasarkan yang paling lama jatuh tempo, lalu diacak urutannya. Sesi dibatasi hingga 100 kartu.
        </ReviewAllDesc>
      </Modal>
    </Container>
  )
}

export default FlashcardV2ListPage
