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

const TOPIC_ROUTE = '/topik'

const SKELETON_WIDTHS = ['8rem', '11rem', '7rem', '13rem', '9rem', '10rem', '7.5rem', '11.5rem', '9.5rem', '8.5rem']

function TopicGroupSection({ tag, title, description, topics, isLoading, onTopicClick }) {
  return (
    <TopicSection>
      <TopicSectionTag>{tag}</TopicSectionTag>
      <TopicSectionTitle>{title}</TopicSectionTitle>
      <TopicSectionDesc>{description}</TopicSectionDesc>
      <TopicGrid>
        {isLoading
          ? SKELETON_WIDTHS.map((w, i) => <SkeletonPill key={i} $w={w} />)
          : topics.map(topic => (
            <TopicPill key={topic.id} onClick={() => onTopicClick(topic)}>
              <TopicPillIcon>{topic.icon || '📚'}</TopicPillIcon>
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
    navigate(`${TOPIC_ROUTE}/${topic.slug}`)
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
          <LastSessionCard onClick={() => navigate(`${TOPIC_ROUTE}/${lastTopic.slug}`)}>
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
      />
    </Container>
  )
}
