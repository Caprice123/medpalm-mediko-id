import QuickStartInline from '../QuickStartInline'
import { useTopicListSection } from './hooks/useTopicListSection'
import {
  EmptyWrap,
  TopikSection, TopikSectionHeader, TopikSectionTitle,
  TopikSearchWrap, TopikSearchIcon, TopikSearchInput,
  TopikList, TopikRowWrap, TopikRowHeader, TopikName, TopikStats,
  TopikStatChip, TopikStatNum, TopikStartBtn, TopikChevron,
  SkeletonBlock, SkeletonCircle, SkeletonTopikRow,
} from './TopicListSection.styles'

export default function TopicListSection({
  openId, loadingIds, subtopicsCache, toggle,
  onStart, isStarting, deepLinkSubtopicId,
}) {
  const { topics, filteredTopics, isLoading, searchQuery, setSearchQuery } = useTopicListSection()

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
          {[1, 2, 3, 4, 5].map(i => (
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
        <EmptyWrap>{topics.length === 0 ? 'Belum ada topik tersedia.' : 'Topik tidak ditemukan.'}</EmptyWrap>
      ) : (
        <TopikList>
          {filteredTopics.map((topic, i) => {
            const isOpen = openId === topic.id
            const isLoadingSubtopic = loadingIds.has(topic.id)
            const subtopics = subtopicsCache[topic.id] || []
            return (
              <TopikRowWrap id={`topic-row-${topic.id}`} key={topic.id} $delay={`${Math.min(i * 0.05, 0.4)}s`}>
                <TopikRowHeader $open={isOpen} onClick={() => toggle(topic.id)}>
                  <TopikName>{topic.name}</TopikName>
                  <TopikStats>
                    <TopikStatChip>
                      <TopikStatNum>{topic.totalSessions}</TopikStatNum> selesai
                    </TopikStatChip>
                    <TopikStatChip>
                      <TopikStatNum>{topic.questionCount}</TopikStatNum> soal
                    </TopikStatChip>
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
                    onStart={onStart}
                    isStarting={isStarting}
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
