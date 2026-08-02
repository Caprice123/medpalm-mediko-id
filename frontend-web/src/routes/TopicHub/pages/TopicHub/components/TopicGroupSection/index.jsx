import { useSelector } from 'react-redux'
import {
  TopicSection, TopicSectionTag, TopicSectionTitle, TopicSectionDesc,
  TopicGrid, TopicPill, TopicPillIcon, TopicPillArrow,
  SkeletonPill,
} from './TopicGroupSection.styles'

const SKELETON_WIDTHS = ['8rem', '11rem', '7rem', '13rem', '9rem', '10rem', '7.5rem', '11.5rem', '9.5rem', '8.5rem']

const ICON_BG_PALETTE = [
  '#dbeafe', '#fce7f3', '#fee2e2', '#ccfbf1', '#ffedd5',
  '#ede9fe', '#d1fae5', '#e0e7ff', '#fef3c7', '#e0f2fe',
]

export default function TopicGroupSection({ classification, tag, title, description, onTopicClick, colorOffset = 0 }) {
  const { userTopics, loading } = useSelector(s => s.featureNodes)
  const topics = classification === 'primary' ? userTopics.primary : userTopics.special
  const isLoading = loading.isFetchingUserTopics

  if (!isLoading && topics.length === 0) return null

  return (
    <TopicSection>
      <TopicSectionTag>{tag}</TopicSectionTag>
      <TopicSectionTitle>{title}</TopicSectionTitle>
      <TopicSectionDesc>{description}</TopicSectionDesc>
      <TopicGrid>
        {isLoading
          ? SKELETON_WIDTHS.map((w, i) => <SkeletonPill key={i} $w={w} />)
          : topics.map((topic, i) => (
            <TopicPill key={topic.id} onClick={() => onTopicClick(topic)}>
              <TopicPillIcon $bg={ICON_BG_PALETTE[(i + colorOffset) % ICON_BG_PALETTE.length]}>
                {topic.icon || '📚'}
              </TopicPillIcon>
              {topic.name}
              <TopicPillArrow>→</TopicPillArrow>
            </TopicPill>
          ))
        }
      </TopicGrid>
    </TopicSection>
  )
}
