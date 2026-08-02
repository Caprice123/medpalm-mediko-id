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
  const { lastTopic } = useTopicHub()

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
        classification="primary"
        tag="Sistem Blok"
        title="Topik berbasis sistem organ"
        description="Setiap sistem dipecah menjadi subtopik terurut dari embriologi, anatomi, fisiologi, hingga aplikasi klinis."
        onTopicClick={handleTopicClick}
      />

      <TopicGroupSection
        classification="special"
        tag="Ilmu Lintas Sistem"
        title="Topik lintas-sistem"
        description="Materi preklinik yang tidak terikat pada satu sistem organ."
        onTopicClick={handleTopicClick}
        colorOffset={5}
      />
    </Container>
  )
}
