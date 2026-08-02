import { useNavigate } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import { useTopicHub, saveLastTopic } from './hooks/useTopicHub'
import {
  Container, PageHeader, Greeting, GreetingSubtitle,
  LastSessionSection, SectionLabel, LastSessionCard, LastSessionIcon,
  LastSessionText, LastSessionName, LastSessionMeta, LastSessionArrow,
  TopicSection, TopicSectionTag, TopicSectionTitle, TopicSectionDesc,
  TopicGrid, TopicPill, TopicPillIcon, TopicPillArrow,
  SkeletonPill,
} from './TopicHub.styles'
import { TopicHubRoute } from '../../routes'

const SKELETON_WIDTHS = ['8rem', '11rem', '7rem', '13rem', '9rem', '10rem', '7.5rem', '11.5rem', '9.5rem', '8.5rem']

const ICON_BG_PALETTE = [
  '#dbeafe', '#fce7f3', '#fee2e2', '#ccfbf1', '#ffedd5',
  '#ede9fe', '#d1fae5', '#e0e7ff', '#fef3c7', '#e0f2fe',
]

function TopicGroupSection({ tag, title, description, topics, isLoading, onTopicClick, colorOffset = 0 }) {
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

export default function TopicHubPage() {
  const navigate = useNavigate()
  const user = getUserData()
  const { primaryTopics, specialTopics, lastTopic, isLoading } = useTopicHub()

  const handleTopicClick = (topic) => {
    saveLastTopic(topic)
    navigate(`${TopicHubRoute.moduleRoute}/${topic.slug}`)
  }

  return (
    <Container>
      <PageHeader>
        <Greeting>Hi, {user?.name?.split(' ')[0] || 'Dokter Muda'}.</Greeting>
        <GreetingSubtitle>
          Pilih topik dari Sistem Blok atau Ilmu Lintas Sistem untuk mulai belajar.
        </GreetingSubtitle>
      </PageHeader>

      {lastTopic && (
        <LastSessionSection>
          <SectionLabel>Sesi Terakhir</SectionLabel>
          <LastSessionCard onClick={() => navigate(`${TopicHubRoute.moduleRoute}/${lastTopic.slug}`)}>
            <LastSessionIcon>{lastTopic.icon || '🕐'}</LastSessionIcon>
            <LastSessionText>
              <LastSessionName>{lastTopic.name}</LastSessionName>
              <LastSessionMeta>Overview topik</LastSessionMeta>
            </LastSessionText>
            <LastSessionArrow>→</LastSessionArrow>
          </LastSessionCard>
        </LastSessionSection>
      )}

      <TopicGroupSection
        tag="Sistem Blok"
        title="Topik berbasis sistem organ"
        description="Setiap sistem dipecah menjadi subtopik terurut dari embriologi, anatomi, fisiologi, hingga aplikasi klinis."
        topics={primaryTopics}
        isLoading={isLoading}
        onTopicClick={handleTopicClick}
      />

      <TopicGroupSection
        tag="Ilmu Lintas Sistem"
        title="Topik lintas-sistem"
        description="Materi preklinik yang tidak terikat pada satu sistem organ."
        topics={specialTopics}
        isLoading={isLoading}
        onTopicClick={handleTopicClick}
        colorOffset={5}
      />
    </Container>
  )
}
