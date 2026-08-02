import { useNavigate } from 'react-router-dom'
import { PiCube, PiMedal } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import Button from '@components/common/Button'
import { useAtlasQuizHome } from './hooks/useAtlasQuizHome'
import {
  Container,
  PageHeader, PageHeaderIcon, PageHeaderTitle, PageHeaderSubtitle,
  Section, SectionHeader, SectionTitle, SectionSubtitle,
  TopicsGrid, TopicCard, CardBody,
  CardTop, CardIconWrapper, CardTitleBlock, CardTitle, CardDescription,
  CardDivider, CardFooter, CardStats, StatBadge, CardArrow,
} from './Home.styles'

const CARD_ICON_BG = [
  '#ede9fe', '#e0f2fe', '#fce7f3', '#d1fae5',
  '#fef3c7', '#fee2e2', '#e0e7ff', '#f0fdf4',
]

function TopicSection({ title, subtitle, topics, pagination, isLoading, onTopicClick, onLoadMore, colorOffset = 0 }) {
  const hasMore = pagination.page < pagination.totalPages

  if (!isLoading && topics.length === 0) return null

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      </SectionHeader>
      {isLoading && topics.length === 0 ? (
        <Loading />
      ) : (
        <>
          <TopicsGrid>
            {topics.map((topic, i) => {
              const idx = (i + colorOffset) % CARD_ICON_BG.length
              return (
                <TopicCard key={topic.id} onClick={() => onTopicClick(topic.slug)}>
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
                    <CardDivider />
                    <CardFooter>
                      <CardStats>
                        <StatBadge>
                          <PiCube size={11} /> {topic.atlasModelCount} model
                        </StatBadge>
                        <StatBadge>
                          <PiMedal size={11} /> {topic.quizCount} quiz
                        </StatBadge>
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

  return (
    <Container>
      <PageHeader>
        <PageHeaderIcon><PiCube size={22} /></PageHeaderIcon>
        <div>
          <PageHeaderTitle>Atlas 3D &amp; Quiz Anatomi</PageHeaderTitle>
          <PageHeaderSubtitle>Eksplorasi atlas 3D dan latihan quiz anatomi interaktif.</PageHeaderSubtitle>
        </div>
      </PageHeader>

      <TopicSection
        title="Sistem"
        subtitle="Atlas 3D dan quiz anatomi yang dikelompokkan berdasarkan sistem tubuh."
        topics={sistemBlokTopics}
        pagination={sistemBlokPagination}
        isLoading={isLoadingSistemBlok}
        onTopicClick={handleTopicClick}
        onLoadMore={handleLoadMoreSistemBlok}
        colorOffset={0}
      />

      <TopicSection
        title="Topik Lintas-Sistem"
        subtitle="Topik penunjang lintas-sistem yang memiliki model 3D anatomi terkait."
        topics={ilmuLintasSistemTopics}
        pagination={ilmuLintasSistemPagination}
        isLoading={isLoadingIlmuLintasSistem}
        onTopicClick={handleTopicClick}
        onLoadMore={handleLoadMoreIlmuLintasSistem}
        colorOffset={4}
      />
    </Container>
  )
}

export default AtlasQuizHome
