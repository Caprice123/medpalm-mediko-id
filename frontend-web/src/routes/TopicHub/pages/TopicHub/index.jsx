import { useNavigate, generatePath } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import { useTopicHub, saveLastTopic } from './hooks/useTopicHub'
import PageGreeting from './components/PageGreeting'
import LastSession from './components/LastSession'
import TopicGroupSection from './components/TopicGroupSection'
import { Container } from './TopicHub.styles'
import { TopicHubRoute } from '../../routes'

export default function TopicHubPage() {
  const navigate = useNavigate()
  const user = getUserData()
  const { primaryTopics, specialTopics, lastTopic, isLoading } = useTopicHub()

  const goToTopic = (topic) => navigate(generatePath(TopicHubRoute.detailRoute, { topicSlug: topic.slug }))

  const handleTopicClick = (topic) => {
    saveLastTopic(topic)
    goToTopic(topic)
  }

  return (
    <Container>
      <PageGreeting name={user?.name?.split(' ')[0] || 'Dokter Muda'} />

      <LastSession topic={lastTopic} onClick={() => goToTopic(lastTopic)} />

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
