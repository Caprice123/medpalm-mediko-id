import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import { useTopicList } from './hooks/useTopicList'
import PerformanceChart from './components/PerformanceChart'
import QuickStartInline from './components/QuickStartInline'
import CustomSessionPanel from './components/CustomSessionPanel'
import McqSession from './components/Session'
import {
  Container, PageHeader, HeaderLeft, Title, Subtitle, EmptyWrap,
  PanelCard, PanelHeader, PanelTitleRow, PanelTitle, PanelSubtitle, AverageScore, AverageLabel, AverageValue,
  TopikSection, TopikSectionHeader, TopikSectionTitle,
  TopikSearchWrap, TopikSearchIcon, TopikSearchInput,
  TopikList, TopikRowWrap, TopikRowHeader, TopikName, TopikStats,
  TopikStatChip, TopikStatNum, TopikPct, TopikStartBtn, TopikChevron,
  SkeletonBlock, SkeletonCircle, SkeletonTopikRow,
} from './TopicList.styles'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'

export default function BankSoalPage() {
  const { sessionQuestions, loading } = useSelector(s => s.mcqNodes)
  const mcqFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'mcq'))
  const {
    topics, filteredTopics,
    openIds, subtopicsCache, loadingIds,
    searchQuery, setSearchQuery,
    customOpen, setCustomOpen,
    overallAvg,
    handleCloseSession,
    toggle, handleStart,
  } = useTopicList()

  return (
    <Container>
      <PageHeader>
        <HeaderLeft>
          <Title>{mcqFeature?.name || 'Bank Soal'}</Title>
          <Subtitle>{formatJakartaDateTimeFull(new Date().toISOString())}</Subtitle>
        </HeaderLeft>
        <Button variant="secondary" onClick={() => setCustomOpen(true)}>
          Sesi Kustom
        </Button>
      </PageHeader>

      <PanelCard>
        <PanelHeader>
          <PanelTitleRow>
            <span>📊</span>
            <PanelTitle>Performa per Topik</PanelTitle>
          </PanelTitleRow>
          <PanelSubtitle>Rerata ketepatan jawaban. Klik topik untuk melihat subtopik.</PanelSubtitle>
          {overallAvg != null && (
            <AverageScore>
              <AverageLabel>RERATA</AverageLabel>
              <AverageValue $score={overallAvg}>{overallAvg}%</AverageValue>
            </AverageScore>
          )}
        </PanelHeader>
        <PerformanceChart topics={topics} />
      </PanelCard>

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
            {[1, 2, 3, 4, 5].map(i => (
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
              const isOpen = openIds.has(topic.id)
              const isLoadingSubtopic = loadingIds.has(topic.id)
              const subtopics = subtopicsCache[topic.id] || []
              return (
                <TopikRowWrap key={topic.id} $delay={`${Math.min(i * 0.05, 0.4)}s`}>
                  <TopikRowHeader $open={isOpen} onClick={() => toggle(topic.id)}>
                    <TopikName>{topic.name}</TopikName>
                    <TopikStats>
                      <TopikStatChip>
                        <TopikStatNum>{topic.totalSessions}</TopikStatNum> selesai
                      </TopikStatChip>
                      <TopikStatChip>
                        <TopikStatNum>{topic.questionCount}</TopikStatNum> soal
                      </TopikStatChip>
                      <TopikPct $score={topic.avgScore}>
                        {topic.avgScore != null ? `${topic.avgScore}%` : '—'}
                      </TopikPct>
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
                      onStart={handleStart}
                      isStarting={loading.isStartingSession}
                    />
                  )}
                </TopikRowWrap>
              )
            })}
          </TopikList>
        )}
      </TopikSection>

      {sessionQuestions.length > 0 && (
        <McqSession onClose={handleCloseSession} />
      )}

      {customOpen && (
        <CustomSessionPanel topics={topics} onClose={() => setCustomOpen(false)} />
      )}
    </Container>
  )
}
