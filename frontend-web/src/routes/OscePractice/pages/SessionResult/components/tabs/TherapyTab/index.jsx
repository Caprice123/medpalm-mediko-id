import { useSelector } from 'react-redux'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import { Container } from './styles'
import { FormSection, SectionTitle } from '../../../../SessionPractice/SessionPractice.styles'
import Textarea from '@components/common/Textarea'

function TherapyTab() {
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  if (loading.isLoadingSessionDetail) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  const therapy = sessionDetail.userAnswer.therapy

  if (!therapy || !therapy.trim()) {
    return (
      <EmptyState>
        💊 Belum ada terapi yang dicatat dalam sesi ini.
      </EmptyState>
    )
  }

  return (
    <Container>
      <FormSection>
        <SectionTitle>
          TERAPI
        </SectionTitle>

        <Textarea
          value={therapy}
          disabled
          rows={6}
        />
      </FormSection>
    </Container>
  )
}

export default TherapyTab
