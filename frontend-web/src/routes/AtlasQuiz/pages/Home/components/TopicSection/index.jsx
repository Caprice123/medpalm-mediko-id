import { PiCube, PiMedal } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import Button from '@components/common/Button'
import { useAtlasTopicSection } from './hooks/useAtlasTopicSection'
import {
  Section, SectionHeader, SectionTitle, SectionSubtitle,
  TopicsGrid, TopicCard, CardBody,
  CardTop, CardIconWrapper, CardTitleBlock, CardTitle, CardDescription,
  CardDivider, CardFooter, CardStats, StatBadge, CardArrow,
} from './TopicSection.styles'

const CARD_ICON_BG = [
  '#ede9fe', '#e0f2fe', '#fce7f3', '#d1fae5',
  '#fef3c7', '#fee2e2', '#e0e7ff', '#f0fdf4',
]

export default function TopicSection({ group, title, subtitle, onTopicClick, colorOffset = 0 }) {
  const { topics, hasMore, isLoading, handleLoadMore } = useAtlasTopicSection(group)

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
              onClick={handleLoadMore}
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
