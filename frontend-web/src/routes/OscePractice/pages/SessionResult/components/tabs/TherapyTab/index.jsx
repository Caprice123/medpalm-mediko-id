import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionTherapies } from '@store/oscePractice/userAction'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  Container,
  TherapyList,
  TherapyItem,
  TherapyNumber,
  TherapyText,
  SummaryCard,
  SummaryText,
  SummaryCount,
} from './styles'

function TherapyTab({ sessionId }) {
  const dispatch = useDispatch()
  const { sessionTherapies, loading } = useSelector(state => state.oscePractice)

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionTherapies(sessionId))
    }
  }, [sessionId, dispatch])

  if (loading.isLoadingSessionTherapies) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  if (sessionTherapies.length === 0) {
    return (
      <EmptyState>
        💊 Belum ada terapi yang dicatat dalam sesi ini.
      </EmptyState>
    )
  }

  return (
    <Container>
      <SummaryCard>
        <SummaryText>
          Total terapi yang diberikan:
        </SummaryText>
        <SummaryCount>
          {sessionTherapies.length}
        </SummaryCount>
      </SummaryCard>

      <TherapyList>
        {sessionTherapies.map((therapy, index) => (
          <TherapyItem key={therapy.id}>
            <TherapyNumber>{index + 1}</TherapyNumber>
            <TherapyText>{therapy.therapy}</TherapyText>
          </TherapyItem>
        ))}
      </TherapyList>
    </Container>
  )
}

export default TherapyTab
