import { useDispatch, useSelector } from 'react-redux'
import { startFlashcardCustomSession, startFlashcardNodeDueSession } from '@store/flashcardNodes'
import Button from '@components/common/Button'
import AnkiPlayer from '../../components/AnkiPlayer'
import { useTopicList } from './hooks/useTopicList'
import DueTodayPanel from './components/DueTodayPanel'
import ProgressPanel from './components/ProgressPanel'
import QuickStartInline from './components/QuickStartInline'
import CustomSessionPanel from './components/CustomSessionPanel'
import {
  Container, PageHeader, HeaderLeft, Title, Subtitle,
  EmptyWrap, DashboardRow,
  TopikSection, TopikSectionHeader, TopikSectionTitle,
  TopikSearchWrap, TopikSearchIcon, TopikSearchInput,
  TopikList, TopikRowWrap, TopikRowHeader, TopikName, TopikStats,
  TopikStatChip, TopikStatNum, TopikPct, TopikStartBtn, TopikChevron,
  SkeletonBlock, SkeletonCircle, SkeletonTopikRow,
} from './TopicList.styles'

export default function TopicListPage() {
  const dispatch = useDispatch()
  const { dueToday, sessionCards, progress, loading } = useSelector(s => s.flashcardNodes)
  const flashcardFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'flashcard'))
  const {
    topics,
    openIds, subtopicsCache, loadingIds,
    customOpen, setCustomOpen,
    searchQuery, setSearchQuery,
    handleStartAllDue, handleCloseSession,
    toggle, statsMap, filteredTopics,
  } = useTopicList()

  return (
    <Container>
      <PageHeader>
        <HeaderLeft>
          <Title>{flashcardFeature?.name || 'Flashcard'}</Title>
          <Subtitle>{flashcardFeature?.description || 'Pilih topik untuk mulai belajar'}</Subtitle>
        </HeaderLeft>
        <Button variant="secondary" onClick={() => setCustomOpen(true)}>
          Sesi Kustom
        </Button>
      </PageHeader>

      <DashboardRow>
        <DueTodayPanel
          dueToday={dueToday}
          onStartAll={handleStartAllDue}
          onStartNode={(nodeId) => dispatch(startFlashcardNodeDueSession(nodeId))}
          isStarting={loading.isStartingSession}
          isLoading={loading.isFetchingDueToday}
        />
        <ProgressPanel progress={progress} isLoading={loading.isFetchingProgress} />
      </DashboardRow>

      <TopikSection>
        <TopikSectionHeader>
          <TopikSectionTitle>Topik</TopikSectionTitle>
          <TopikSearchWrap>
            <TopikSearchIcon>🔍</TopikSearchIcon>
            <TopikSearchInput
              placeholder="Cari topik..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </TopikSearchWrap>
        </TopikSectionHeader>

        {loading.isFetchingTopics ? (
          <TopikList>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonTopikRow key={i}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SkeletonBlock $w={`${45 + (i * 7) % 40}%`} $h="1rem" />
                </div>
                <SkeletonBlock $w="3.5rem" $h="0.875rem" />
                <SkeletonBlock $w="3rem" $h="0.875rem" />
                <SkeletonBlock $w="2rem" $h="0.875rem" />
                <SkeletonBlock $w="3.5rem" $h="1.75rem" $radius="8px" />
                <SkeletonCircle $size="20px" />
              </SkeletonTopikRow>
            ))}
          </TopikList>
        ) : filteredTopics.length === 0 ? (
          <EmptyWrap>{topics.length === 0 ? 'Belum ada topik tersedia.' : 'Topik tidak ditemukan.'}</EmptyWrap>
        ) : (
          <TopikList>
            {filteredTopics.map((topic, i) => {
              const stats = statsMap.get(topic.id)
              const selesai = stats
                ? stats.counts.again + stats.counts.hard + stats.counts.good + stats.counts.easy
                : 0
              const totalCards = topic.cardCount
              const pct = totalCards > 0 ? Math.round((selesai / totalCards) * 100) : 0
              const isOpen = openIds.has(topic.id)
              const isLoadingSubtopic = loadingIds.has(topic.id)
              const subtopics = subtopicsCache[topic.id] || []

              return (
                <TopikRowWrap key={topic.id} $open={isOpen} $delay={`${Math.min(i * 0.05, 0.4)}s`}>
                  <TopikRowHeader $open={isOpen} onClick={() => toggle(topic.id)}>
                    <TopikName>{topic.name}</TopikName>
                    <TopikStats>
                      <TopikStatChip><TopikStatNum>{selesai}</TopikStatNum> selesai</TopikStatChip>
                      <TopikStatChip><TopikStatNum>{totalCards}</TopikStatNum> kartu</TopikStatChip>
                      <TopikPct>{pct}%</TopikPct>
                      <TopikStartBtn onClick={e => { e.stopPropagation(); toggle(topic.id) }}>
                        Mulai
                      </TopikStartBtn>
                      <TopikChevron $open={isOpen}>›</TopikChevron>
                    </TopikStats>
                  </TopikRowHeader>
                  {isOpen && (
                    <QuickStartInline
                      topic={topic}
                      subtopics={subtopics}
                      isLoadingSubtopics={isLoadingSubtopic}
                      onStart={(nodeIds, count) => dispatch(startFlashcardCustomSession(nodeIds, count))}
                      isStarting={loading.isStartingSession}
                    />
                  )}
                </TopikRowWrap>
              )
            })}
          </TopikList>
        )}
      </TopikSection>

      {sessionCards.length > 0 && (
        <AnkiPlayer
          deck={{ title: 'Sesi Belajar', cards: sessionCards }}
          onBack={handleCloseSession}
        />
      )}

      {customOpen && (
        <CustomSessionPanel topics={topics} onClose={() => setCustomOpen(false)} />
      )}
    </Container>
  )
}
