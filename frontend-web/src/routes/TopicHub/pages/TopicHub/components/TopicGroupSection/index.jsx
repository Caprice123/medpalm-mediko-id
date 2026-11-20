import { useSelector } from 'react-redux'
import { PiArrowRight } from 'react-icons/pi'
import {
  TopicSection, TopicSectionTag, TopicSectionDesc,
  TopicGrid, TopicCard, TopicCardIcon, TopicCardName, TopicCardArrow, SkeletonCard,
} from './TopicGroupSection.styles'
import { firstIcon } from '@utils/iconUtils'

// Matches the larger real group, so the grid does not visibly reflow when
// placeholders resolve to topics — a shift that used to land after the page's
// own entrance animation had finished.
const SKELETON_COUNT = 11

export default function TopicGroupSection({ classification, tag, description, onTopicClick }) {
  const { userTopics, loading } = useSelector(s => s.featureNodes)
  const topics = classification === 'primary' ? userTopics.primary : userTopics.special
  const isLoading = loading.isFetchingUserTopics
  // Placeholders stand in only while there is nothing to stand in for. Once a
  // search re-queries the API, the topics already on screen stay put until the
  // new ones land — swapping them for skeletons on every settled keystroke
  // made the page blink through a loading state the student never asked for.
  const showSkeletons = isLoading && topics.length === 0

  if (!isLoading && topics.length === 0) return null

  return (
    <TopicSection>
      <TopicSectionTag>{tag}</TopicSectionTag>
      <TopicSectionDesc>{description}</TopicSectionDesc>
      <TopicGrid>
        {showSkeletons
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)
          : topics.map((topic) => {
            const icon = firstIcon(topic.icon)
            return (
              <TopicCard key={topic.id} onClick={() => onTopicClick(topic)}>
                {/* Decorative: the name next to it already says which topic
                    this is, so the emoji is hidden from screen readers. */}
                {icon && <TopicCardIcon aria-hidden="true">{icon}</TopicCardIcon>}
                <TopicCardName>{topic.name}</TopicCardName>
                <TopicCardArrow><PiArrowRight size={16} /></TopicCardArrow>
              </TopicCard>
            )
          })
        }
      </TopicGrid>
    </TopicSection>
  )
}
