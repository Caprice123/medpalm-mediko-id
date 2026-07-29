import { useNavigate } from 'react-router-dom'
import { PiCube, PiMedal, PiBrain } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import Button from '@components/common/Button'
import { useAtlasQuizHome } from './hooks/useAtlasQuizHome'
import {
  Container,
  Hero, HeroTop, HeroIcon, HeroTitle, HeroSubtitle, HeroPills, HeroPill,
  Section, SectionHeader, SectionTitle, SectionSubtitle,
  TopicsGrid, TopicCard, CardAccent, CardBody,
  CardTop, CardIconWrapper, CardTitleBlock, CardTitle, CardDescription,
  CardFooter, CardStats, StatBadge, CardArrow,
} from './Home.styles'

const CARD_ACCENTS = [
  'linear-gradient(90deg, #6366f1, #0ea5e9)',
  'linear-gradient(90deg, #0ea5e9, #06b6d4)',
  'linear-gradient(90deg, #ec4899, #8b5cf6)',
  'linear-gradient(90deg, #10b981, #06b6d4)',
  'linear-gradient(90deg, #f59e0b, #ef4444)',
  'linear-gradient(90deg, #8b5cf6, #6366f1)',
  'linear-gradient(90deg, #14b8a6, #0ea5e9)',
  'linear-gradient(90deg, #f43f5e, #ec4899)',
]

const CARD_ICON_BG = [
  '#ede9fe', '#e0f2fe', '#fce7f3', '#d1fae5',
  '#fef3c7', '#fee2e2', '#e0e7ff', '#f0fdf4',
]

function TopicSection({ title, subtitle, topics, pagination, isLoading, onTopicClick, onLoadMore, accentOffset = 0 }) {
  const hasMore = pagination.page < pagination.totalPages

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      </SectionHeader>
      {isLoading && topics.length === 0 ? (
        <Loading />
      ) : topics.length === 0 ? (
        <EmptyState icon="📂" title="Belum ada topik" />
      ) : (
        <>
          <TopicsGrid>
            {topics.map((topic, i) => {
              const idx = (i + accentOffset) % CARD_ACCENTS.length
              return (
                <TopicCard key={topic.id} onClick={() => onTopicClick(topic.slug)}>
                  <CardAccent $bg={CARD_ACCENTS[idx]} />
                  <CardBody>
                    <CardTop>
                      <CardIconWrapper $bg={CARD_ICON_BG[idx]}>
                        {topic.icon || '🧠'}
                      </CardIconWrapper>
                      <CardTitleBlock>
                        <CardTitle>{topic.name}</CardTitle>
                        {topic.description && (
                          <CardDescription>{topic.description}</CardDescription>
                        )}
                      </CardTitleBlock>
                    </CardTop>
                    <CardFooter>
                      <CardStats>
                        {topic.atlasModelCount > 0 && (
                          <StatBadge $type="atlas">
                            <PiCube size={11} /> {topic.atlasModelCount} Model 3D
                          </StatBadge>
                        )}
                        {topic.quizCount > 0 && (
                          <StatBadge $type="quiz">
                            <PiMedal size={11} /> {topic.quizCount} Quiz
                          </StatBadge>
                        )}
                      </CardStats>
                      <CardArrow>→</CardArrow>
                    </CardFooter>
                  </CardBody>
                </TopicCard>
              )
            })}
          </TopicsGrid>
          {hasMore && (
            <Button
              variant="secondary"
              onClick={onLoadMore}
              disabled={isLoading}
              style={{ margin: '1.25rem auto 0', display: 'block' }}
            >
              {isLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
            </Button>
          )}
        </>
      )}
    </Section>
  )
}

function AtlasQuizHome() {
  const navigate = useNavigate()
  const {
    sistemBlokTopics, sistemBlokPagination,
    ilmuLintasSistemTopics, ilmuLintasSistemPagination,
    isLoadingSistemBlok,
    isLoadingIlmuLintasSistem,
    handleLoadMoreSistemBlok,
    handleLoadMoreIlmuLintasSistem,
  } = useAtlasQuizHome()

  const handleTopicClick = (slug) => navigate(`/atlas-quiz/${slug}`)

  const totalAtlas = [...sistemBlokTopics, ...ilmuLintasSistemTopics]
    .reduce((sum, t) => sum + (t.atlasModelCount || 0), 0)
  const totalQuiz = [...sistemBlokTopics, ...ilmuLintasSistemTopics]
    .reduce((sum, t) => sum + (t.quizCount || 0), 0)
  const totalTopics = sistemBlokPagination.total + ilmuLintasSistemPagination.total

  return (
    <Container>
      <Hero>
        <HeroTop>
          <HeroIcon>🧬</HeroIcon>
          <div>
            <HeroTitle>Atlas 3D &amp; Quiz Anatomi</HeroTitle>
            <HeroSubtitle>Eksplorasi model anatomi 3D interaktif dan uji pemahamanmu lewat quiz berbasis struktur.</HeroSubtitle>
          </div>
        </HeroTop>
        <HeroPills>
          <HeroPill><PiBrain size={13} /> {totalTopics} Topik</HeroPill>
          <HeroPill><PiCube size={13} /> {totalAtlas} Model 3D</HeroPill>
          <HeroPill><PiMedal size={13} /> {totalQuiz} Quiz Anatomi</HeroPill>
        </HeroPills>
      </Hero>

      <TopicSection
        title="Sistem Blok"
        subtitle="Dikelompokkan berdasarkan sistem tubuh."
        topics={sistemBlokTopics}
        pagination={sistemBlokPagination}
        isLoading={isLoadingSistemBlok}
        onTopicClick={handleTopicClick}
        onLoadMore={handleLoadMoreSistemBlok}
        accentOffset={0}
      />

      <TopicSection
        title="Ilmu Lintas Sistem"
        subtitle="Topik yang mencakup lebih dari satu sistem tubuh."
        topics={ilmuLintasSistemTopics}
        pagination={ilmuLintasSistemPagination}
        isLoading={isLoadingIlmuLintasSistem}
        onTopicClick={handleTopicClick}
        onLoadMore={handleLoadMoreIlmuLintasSistem}
        accentOffset={4}
      />
    </Container>
  )
}

export default AtlasQuizHome
