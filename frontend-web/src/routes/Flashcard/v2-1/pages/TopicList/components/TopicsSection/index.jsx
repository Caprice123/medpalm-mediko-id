import QuickStartInline from '../QuickStartInline'
import { useTopicsSection } from './hooks/useTopicsSection'
import {
  EmptyWrap,
  TopikSection, TopikSectionHeader, TopikSectionTitle,
  TopikSearchWrap, TopikSearchIcon, TopikSearchInput,
  TopikList, TopikRowWrap, TopikRowHeader, TopikName, TopikStats,
  TopikStatChip, TopikStatNum, TopikPct, TopikStartBtn, TopikChevron,
  SkeletonBlock, SkeletonCircle, SkeletonTopikRow,
} from './TopicsSection.styles'

export default function TopicsSection({
  openTopicId, loadingTopicId, toggle,
  onStartCustomSession, isStartingSession, deepLinkSubtopicId,
}) {
  const {
    topics, filteredTopics, subtopicsByTopic, statsMap, isLoading,
    searchQuery, setSearchQuery,
  } = useTopicsSection()

  return (
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

      {isLoading ? (
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
            const isOpen = openTopicId === topic.id
            const isLoadingSubtopic = loadingTopicId === topic.id
            const subtopics = subtopicsByTopic[topic.id] || []

            return (
              <TopikRowWrap id={`topic-row-${topic.id}`} key={topic.id} $open={isOpen} $delay={`${Math.min(i * 0.05, 0.4)}s`}>
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
                    onStart={onStartCustomSession}
                    isStarting={isStartingSession}
                    initialSelectedSubtopicId={deepLinkSubtopicId}
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
