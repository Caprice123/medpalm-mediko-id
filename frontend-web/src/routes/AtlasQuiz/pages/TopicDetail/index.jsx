import { useNavigate, useParams, generatePath } from 'react-router-dom'
import Loading from '@components/common/Loading'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { useTopicDetail } from './hooks/useTopicDetail'
import ModulesPanel from './components/ModulesPanel'
import QuizzesPanel from './components/QuizzesPanel'
import { PageWrapper, Inner } from './TopicDetail.styles'

function TopicDetailPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const {
    topic, modules, modulesPagination,
    quizzes, quizzesPagination,
    moduleOptions,
    isLoadingTopic, isLoadingModules, isLoadingQuizzes,
    handleModuleFilterChange, handleLoadMoreModules,
    handleQuizModuleFilterChange, handleLoadMoreQuizzes,
  } = useTopicDetail(slug)

  const handleModuleClick = (mod) => {
    navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug, uniqueId: mod.uniqueId }))
  }

  const handleQuizClick = (quiz) => {
    navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: quiz.uniqueId }))
  }

  if (isLoadingTopic) return <Loading />

  return (
    <PageWrapper>
      <Inner>
        <ModulesPanel
          topic={topic}
          modules={modules}
          modulesPagination={modulesPagination}
          moduleOptions={moduleOptions}
          isLoadingModules={isLoadingModules}
          onModuleFilterChange={handleModuleFilterChange}
          onLoadMoreModules={handleLoadMoreModules}
          onModuleClick={handleModuleClick}
          onBack={() => navigate(AtlasQuizRoute.moduleRoute)}
        />

        <QuizzesPanel
          quizzes={quizzes}
          quizzesPagination={quizzesPagination}
          moduleOptions={moduleOptions}
          isLoadingQuizzes={isLoadingQuizzes}
          onQuizModuleFilterChange={handleQuizModuleFilterChange}
          onLoadMoreQuizzes={handleLoadMoreQuizzes}
          onQuizClick={handleQuizClick}
        />
      </Inner>
    </PageWrapper>
  )
}

export default TopicDetailPage
