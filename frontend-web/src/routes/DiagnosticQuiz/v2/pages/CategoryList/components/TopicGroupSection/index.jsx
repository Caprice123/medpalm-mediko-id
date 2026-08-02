import QuickStartInline from '../QuickStartInline'
import { useTopicGroupSection } from './hooks/useTopicGroupSection'
import {
  EmptyWrap,
  TopikSection, TopikSectionHeader, TopikSectionTitle,
  TopikSearchWrap, TopikSearchIcon, TopikSearchInput,
  TopikList, TopikRowWrap, TopikRowHeader, TopikName, TopikStats,
  TopikStatChip, TopikStatNum, TopikStartBtn, TopikChevron,
  SkeletonBlock, SkeletonCircle, SkeletonTopikRow,
} from './TopicGroupSection.styles'

export default function TopicGroupSection({
  title, classification,
  openTopicId, loadingTopicId, toggle,
  onStartCustomSession, isStartingSession,
}) {
  const {
    filteredTopics, subtopicsByTopic, statsMap, isLoading,
    searchQuery, setSearchQuery,
  } = useTopicGroupSection(classification)

  return (
    <TopikSection>
      <TopikSectionHeader>
        <TopikSectionTitle>{title}</TopikSectionTitle>
        <TopikSearchWrap>
          <TopikSearchIcon>🔍</TopikSearchIcon>
          <TopikSearchInput
            placeholder="Cari modul..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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
      ) : filteredTopics.length === 0 ? (
        <EmptyWrap>Belum ada modul tersedia.</EmptyWrap>
      ) : (
        <TopikList>
          {filteredTopics.map((topic, i) => {
            const stats = statsMap.get(topic.id)
            const done = stats
              ? (stats.counts?.again || 0) + (stats.counts?.hard || 0) + (stats.counts?.good || 0) + (stats.counts?.easy || 0)
              : 0
            const totalQuestions = topic.questionCount
            const isOpen = openTopicId === topic.id
            const isLoadingSubtopic = loadingTopicId === topic.id
            const subtopics = subtopicsByTopic[topic.id] || []

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
                    onStart={onStartCustomSession}
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
