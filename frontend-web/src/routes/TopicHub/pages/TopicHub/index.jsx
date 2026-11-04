import { useNavigate, generatePath } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import { getFirstName } from '@utils/greeting'
import EmptyState from '@components/common/EmptyState'
import { useTopicHub, saveLastTopic } from './hooks/useTopicHub'
import PageGreeting from './components/PageGreeting'
import LastSession from './components/LastSession'
import TopicGroupSection from './components/TopicGroupSection'
import { Container } from './TopicHub.styles'
import { TopicHubRoute } from '../../routes'
import capybaraThinking from '@/assets/landing/faq-capybara-thinking.png'

export default function TopicHubPage() {
  const navigate = useNavigate()
  const user = getUserData()
  const { lastTopic, error, isEmpty, retry } = useTopicHub()

  const goToTopic = (topic) => navigate(generatePath(TopicHubRoute.detailRoute, { topicSlug: topic.slug }))

  const handleTopicClick = (topic) => {
    saveLastTopic(topic)
    goToTopic(topic)
  }

  return (
    <Container>
      <PageGreeting name={getFirstName(user?.name)} />

      {/* Kept above the error: the shortcut is read from localStorage, so a
          student can still resume where they were even when the topic list
          itself failed to load. */}
      <LastSession topic={lastTopic} onClick={() => goToTopic(lastTopic)} />

      {error ? (
        <EmptyState
          icon="⚠️"
          title="Gagal memuat topik"
          description="Periksa koneksi internetmu, lalu coba lagi."
          actionLabel="Coba Lagi"
          onAction={retry}
        />
      ) : isEmpty ? (
        <EmptyState
          icon={<img src={capybaraThinking} alt="" width="120" />}
          title="Materi belum tersedia"
          description="Topik sedang disiapkan. Coba lagi nanti ya."
        />
      ) : (
        <>
          <TopicGroupSection
            classification="primary"
            tag="Sistem Blok"
            description="Setiap sistem dipecah menjadi subtopik terurut dari embriologi, anatomi, fisiologi, hingga aplikasi klinis."
            onTopicClick={handleTopicClick}
          />

          <TopicGroupSection
            classification="special"
            tag="Ilmu Lintas Sistem"
            description="Materi preklinik yang tidak terikat pada satu sistem organ."
            onTopicClick={handleTopicClick}
          />
        </>
      )}
    </Container>
  )
}
