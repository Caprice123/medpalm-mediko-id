import { useDispatch, useSelector } from 'react-redux'
import { startDiagnosticCustomSession, startDiagnosticNodeDueSession } from '@store/diagnosticNodes'
import Button from '@components/common/Button'
import QuizPlayer from '../../components/QuizPlayer'
import DueTodayPanel from './components/DueTodayPanel'
import ProgressPanel from './components/ProgressPanel'
import QuickStartInline from './components/QuickStartInline'
import CustomSessionPanel from './components/CustomSessionPanel'
import { useCategoryList } from './hooks/useCategoryList'
import {
  Container, PageHeader, HeaderLeft, Title, Subtitle, DashboardRow, EmptyWrap,
  TopikSection, TopikSectionHeader, TopikSectionTitle,
  TopikSearchWrap, TopikSearchIcon, TopikSearchInput,
  TopikList, TopikRowWrap, TopikRowHeader, TopikName, TopikStats,
  TopikStatChip, TopikStatNum, TopikStartBtn, TopikChevron,
  SkeletonBlock, SkeletonCircle, SkeletonTopikRow,
} from './CategoryList.styles'

function TopicSection({ title, topics, isLoading, searchValue, onSearchChange, openIds, loadingIds, subtopicsCache, statsMap, toggle, dispatch, isStartingSession, isSpecial }) {
  return (
    <TopikSection>
      <TopikSectionHeader>
        <TopikSectionTitle>{title}</TopikSectionTitle>
        <TopikSearchWrap>
          <TopikSearchIcon>🔍</TopikSearchIcon>
          <TopikSearchInput
            placeholder="Cari topik..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </TopikSearchWrap>
      </TopikSectionHeader>

      {isLoading ? (
        <TopikList>
          {[1, 2, 3].map(i => (
            <SkeletonTopikRow key={i}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <SkeletonBlock $w={`${45 + (i * 7) % 40}%`} $h="1rem" />
              </div>
              <SkeletonBlock $w="3.5rem" $h="0.875rem" />
              <SkeletonBlock $w="3rem" $h="0.875rem" />
              <SkeletonBlock $w="3.5rem" $h="1.75rem" $radius="8px" />
              <SkeletonCircle $size="20px" />
            </SkeletonTopikRow>
          ))}
        </TopikList>
      ) : topics.length === 0 ? (
        <EmptyWrap>Belum ada topik tersedia.</EmptyWrap>
      ) : (
        <TopikList>
          {topics.map((topic, i) => {
            const stats = statsMap.get(topic.id)
            const done = stats
              ? (stats.counts?.again || 0) + (stats.counts?.hard || 0) + (stats.counts?.good || 0) + (stats.counts?.easy || 0)
              : 0
            const totalQuestions = topic.questionCount
            const isOpen = openIds.has(topic.id)
            const isLoadingSubtopic = loadingIds.has(topic.id)
            const subtopics = subtopicsCache[topic.id] || []

            return (
              <TopikRowWrap key={topic.id} $open={isOpen} $delay={`${Math.min(i * 0.05, 0.4)}s`}>
                <TopikRowHeader $open={isOpen} onClick={() => toggle(topic.id)}>
                  <TopikName>{topic.name}</TopikName>
                  <TopikStats>
                    <TopikStatChip><TopikStatNum>{done}</TopikStatNum> selesai</TopikStatChip>
                    <TopikStatChip><TopikStatNum>{totalQuestions}</TopikStatNum> soal</TopikStatChip>
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
                    onStart={(nodeIds, count) => dispatch(startDiagnosticCustomSession(nodeIds, count))}
                    isStarting={isStartingSession}
                  />
                )}
              </TopikRowWrap>
            )
          })}
        </TopikList>
      )}
    </TopikSection>
  )
}

export default function CategoryListPage() {
  const dispatch = useDispatch()
  const { dueToday, sessionCards, loading, progress } = useSelector(s => s.diagnosticNodes)
  const diagnosticFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'diagnostic'))
  const {
    filteredPrimary, filteredSpecial, primaryTopics, specialTopics,
    openIds, subtopicsCache, loadingIds,
    customOpen, setCustomOpen,
    primarySearch, setPrimarySearch,
    specialSearch, setSpecialSearch,
    handleStartAllDue, handleCloseSession,
    toggle, statsMap, allTopics,
  } = useCategoryList()

  const isLoading = loading.isFetchingCategories

  return (
    <Container>
      <PageHeader>
        <HeaderLeft>
          <Title>{diagnosticFeature?.name || 'Bank Soal'}</Title>
          <Subtitle>{diagnosticFeature?.description || 'Latihan soal dengan sistem pengulangan adaptif'}</Subtitle>
        </HeaderLeft>
        <Button variant="secondary" onClick={() => setCustomOpen(true)}>
          Sesi Kustom
        </Button>
      </PageHeader>

      <DashboardRow>
        <DueTodayPanel
          dueToday={dueToday}
          onStartAll={handleStartAllDue}
          onStartNode={(nodeId) => dispatch(startDiagnosticNodeDueSession(nodeId))}
          isStarting={loading.isStartingSession}
          isLoading={loading.isFetchingDueToday}
        />
        <ProgressPanel progress={progress} isLoading={loading.isFetchingProgress} />
      </DashboardRow>

      <TopicSection
        title="Topik Primer"
        topics={filteredPrimary}
        isLoading={isLoading}
        searchValue={primarySearch}
        onSearchChange={setPrimarySearch}
        openIds={openIds}
        loadingIds={loadingIds}
        subtopicsCache={subtopicsCache}
        statsMap={statsMap}
        toggle={toggle}
        dispatch={dispatch}
        isStartingSession={loading.isStartingSession}
        isSpecial={false}
      />

      <TopicSection
        title="Topik Spesialis"
        topics={filteredSpecial}
        isLoading={isLoading}
        searchValue={specialSearch}
        onSearchChange={setSpecialSearch}
        openIds={openIds}
        loadingIds={loadingIds}
        subtopicsCache={subtopicsCache}
        statsMap={statsMap}
        toggle={toggle}
        dispatch={dispatch}
        isStartingSession={loading.isStartingSession}
        isSpecial
      />

      {!isLoading && primaryTopics.length === 0 && specialTopics.length === 0 && (
        <EmptyWrap>Belum ada soal tersedia.</EmptyWrap>
      )}

      {sessionCards.length > 0 && (
        <QuizPlayer cards={sessionCards} onBack={handleCloseSession} />
      )}

      {customOpen && (
        <CustomSessionPanel topics={allTopics} onClose={() => setCustomOpen(false)} />
      )}
    </Container>
  )
}
