import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchFlashcardTopics } from '@store/flashcardNodes'
import Loading from '@components/common/Loading'
import { FlashcardRoute } from '../../../../routes'
import {
  Container, PageHeader, Title, Subtitle,
  Grid, TopicCard, CardTop, ClassBadge, CardCount,
  TopicName, CardArrow, EmptyWrap,
} from './TopicList.styles'

const CLASS_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Lintas Sistem',
}

function TopicListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { topics, loading } = useSelector(state => state.flashcardNodes)

  useEffect(() => {
    dispatch(fetchFlashcardTopics())
  }, [dispatch])

  if (loading.isFetchingTopics) {
    return <Loading />
  }

  return (
    <Container>
      <PageHeader>
        <Title>Flashcard</Title>
        <Subtitle>Pilih topik untuk mulai belajar</Subtitle>
      </PageHeader>

      {topics.length === 0 ? (
        <EmptyWrap>Belum ada topik tersedia.</EmptyWrap>
      ) : (
        <Grid>
          {topics.map(topic => (
            <TopicCard
              key={topic.id}
              onClick={() => navigate(FlashcardRoute.topicDetailRoute(topic.id))}
            >
              <CardTop>
                {topic.classification && (
                  <ClassBadge>{CLASS_LABELS[topic.classification] ?? topic.classification}</ClassBadge>
                )}
                <CardCount>{topic.cardCount} kartu</CardCount>
              </CardTop>
              <TopicName>{topic.name}</TopicName>
              <CardArrow>›</CardArrow>
            </TopicCard>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default TopicListPage
