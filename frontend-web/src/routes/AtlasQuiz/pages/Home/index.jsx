import { useNavigate, generatePath } from 'react-router-dom'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import AtlasQuizPageHeader from './components/AtlasQuizPageHeader'
import TopicSection from './components/TopicSection'
import { Container } from './Home.styles'

function AtlasQuizHome() {
  const navigate = useNavigate()
  const handleTopicClick = (slug) => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug }))

  return (
    <Container>
      <AtlasQuizPageHeader />

      <TopicSection
        group="sistemBlok"
        title="Sistem"
        subtitle="Atlas 3D dan quiz anatomi yang dikelompokkan berdasarkan sistem tubuh."
        onTopicClick={handleTopicClick}
        colorOffset={0}
      />

      <TopicSection
        group="ilmuLintasSistem"
        title="Topik Lintas-Sistem"
        subtitle="Topik penunjang lintas-sistem yang memiliki model 3D anatomi terkait."
        onTopicClick={handleTopicClick}
        colorOffset={4}
      />
    </Container>
  )
}

export default AtlasQuizHome
