import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchFlashcardSubtopics, startFlashcardNodeSession } from '@store/flashcardNodes'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import Loading from '@components/common/Loading'
import { FlashcardRoute } from '../../../../routes'
import {
  Container, BackLink, PageHeader, Title, Subtitle,
  Grid, SubtopicCard, SubtopicName, CardMeta, CardCount, EmptyWrap,
  ModalBody, ModalLabel, PresetRow, PresetBtn,
  CountDisplay, CountNum, CountBtn,
} from './SubtopicList.styles'

const PRESETS = [10, 20, 50]

function StartSessionModal({ subtopic, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.flashcardNodes)
  const maxCards = subtopic.cardCount
  const [count, setCount] = useState(Math.min(20, maxCards))

  const handlePreset = (n) => {
    if (n > maxCards) return
    setCount(n)
  }

  const handleStart = () => {
    dispatch(startFlashcardNodeSession(subtopic.id, count, () => {
      navigate(FlashcardRoute.nodeSessionRoute)
    }))
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={subtopic.name}
      size="small"
      footer={
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={loading.isStartingSession || maxCards === 0}
          >
            {loading.isStartingSession ? 'Menyiapkan...' : 'Mulai Sesi'}
          </Button>
        </div>
      }
    >
      <ModalBody>
        <ModalLabel>Jumlah Kartu</ModalLabel>

        <PresetRow>
          {PRESETS.map(p => (
            <PresetBtn
              key={p}
              $active={count === p}
              $disabled={p > maxCards}
              onClick={() => handlePreset(p)}
              disabled={p > maxCards}
            >
              {p}
            </PresetBtn>
          ))}
          <PresetBtn
            $active={count === maxCards}
            onClick={() => setCount(maxCards)}
          >
            Semua ({maxCards})
          </PresetBtn>
        </PresetRow>

        <CountDisplay>
          <CountBtn onClick={() => setCount(c => Math.max(1, c - 1))} disabled={count <= 1}>−</CountBtn>
          <CountNum>{count}</CountNum>
          <CountBtn onClick={() => setCount(c => Math.min(maxCards, c + 1))} disabled={count >= maxCards}>+</CountBtn>
        </CountDisplay>
      </ModalBody>
    </Modal>
  )
}

function SubtopicListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { topicId } = useParams()
  const { topics, subtopics, loading } = useSelector(state => state.flashcardNodes)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)

  const topic = topics.find(t => String(t.id) === topicId)

  useEffect(() => {
    dispatch(fetchFlashcardSubtopics(topicId))
  }, [dispatch, topicId])

  if (loading.isFetchingSubtopics) {
    return <Loading />
  }

  return (
    <Container>
      <BackLink onClick={() => navigate(FlashcardRoute.topicsRoute)}>
        ← Semua Topik
      </BackLink>

      <PageHeader>
        <Title>{topic?.name ?? 'Sub-topik'}</Title>
        <Subtitle>Pilih sub-topik untuk mulai belajar</Subtitle>
      </PageHeader>

      {subtopics.length === 0 ? (
        <EmptyWrap>Belum ada sub-topik tersedia.</EmptyWrap>
      ) : (
        <Grid>
          {subtopics.map(sub => (
            <SubtopicCard key={sub.id}>
              <SubtopicName>{sub.name}</SubtopicName>
              <CardMeta>
                <CardCount>{sub.cardCount} kartu</CardCount>
                <Button
                  variant="primary"
                  size="small"
                  disabled={sub.cardCount === 0}
                  onClick={() => setSelectedSubtopic(sub)}
                >
                  Mulai
                </Button>
              </CardMeta>
            </SubtopicCard>
          ))}
        </Grid>
      )}

      {selectedSubtopic && (
        <StartSessionModal
          subtopic={selectedSubtopic}
          onClose={() => setSelectedSubtopic(null)}
        />
      )}
    </Container>
  )
}

export default SubtopicListPage
