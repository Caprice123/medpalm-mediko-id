import { useSelector } from 'react-redux'
import { PiArrowRight } from 'react-icons/pi'
import {
  TopicSection, TopicSectionTag, TopicSectionDesc,
  TopicGrid, TopicCard, TopicCardName, TopicCardArrow, SkeletonCard,
} from './TopicGroupSection.styles'

// Matches the larger real group, so the grid does not visibly reflow when
// placeholders resolve to topics — a shift that used to land after the page's
// own entrance animation had finished.
const SKELETON_COUNT = 11

export default function TopicGroupSection({ classification, tag, description, onTopicClick }) {
  const { userTopics, loading } = useSelector(s => s.featureNodes)
  const topics = classification === 'primary' ? userTopics.primary : userTopics.special
  const isLoading = loading.isFetchingUserTopics

  if (!isLoading && topics.length === 0) return null

  return (
    <TopicSection>
      <TopicSectionTag>{tag}</TopicSectionTag>
      <TopicSectionDesc>{description}</TopicSectionDesc>
      <TopicGrid>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)
          : topics.map((topic) => (
            <TopicCard key={topic.id} onClick={() => onTopicClick(topic)}>
              <TopicCardName>{topic.name}</TopicCardName>
              <TopicCardArrow><PiArrowRight size={16} /></TopicCardArrow>
            </TopicCard>
          ))
        }
      </TopicGrid>
    </TopicSection>
  )
}
