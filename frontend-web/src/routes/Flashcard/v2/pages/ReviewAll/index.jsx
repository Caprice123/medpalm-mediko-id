import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { startReviewSession } from '@store/review/userAction'
import Button from '@components/common/Button'
import { Container, Title, Subtitle, EmptyHint } from '../Review/Review.styles'
import { FlashcardRoute } from '../../../routes'
import styled from 'styled-components'

const HeroCard = styled.div`
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0891b2 100%);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(13,148,136,0.3);
`

const HeroTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.5rem;
`

const HeroDesc = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  opacity: 0.85;
  margin: 0 0 1.75rem;
`

export default function ReviewAllPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.review)

  const handleStart = () => {
    dispatch(startReviewSession(
      { type: 'all', recordType: 'flashcard_card', mode: 'due_today', cardLimit: 100 },
      (uniqueId) => navigate(FlashcardRoute.sessionRoute(uniqueId))
    ))
  }

  return (
    <Container>
      <Title>Review Semua</Title>
      <Subtitle>Review kartu yang jatuh tempo hari ini, termasuk kartu baru yang belum pernah dipelajari.</Subtitle>

      <HeroCard>
        <HeroTitle>Siap untuk review?</HeroTitle>
        <HeroDesc>
          Sesi ini akan memuat semua kartu yang sudah jatuh tempo hari ini — hingga 100 kartu.
          Kartu baru yang belum pernah dipelajari juga akan disertakan.
        </HeroDesc>
        <Button
          variant="secondary"
          onClick={handleStart}
          disabled={loading.isFetchingSession}
          style={{ background: 'white', color: '#0d9488', fontWeight: 700 }}
        >
          {loading.isFetchingSession ? 'Memuat...' : 'Mulai Sesi'}
        </Button>
      </HeroCard>
    </Container>
  )
}
