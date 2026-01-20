import { useSelector } from 'react-redux'
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
import { EmptyListText, FormSection, ItemCard, ItemsList, ItemText, SectionTitle } from '../../../../SessionPractice/SessionPractice.styles'

function TherapyTab() {
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  if (loading.isLoadingSessionDetail) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  const sessionTherapies = sessionDetail.userAnswer.therapies

  if (sessionTherapies.length === 0) {
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

        {sessionTherapies.length > 0 ? (
          <ItemsList>
            {sessionTherapies.map((therapy, index) => (
              <ItemCard key={index}>
                <ItemText>
                  {index + 1}. {therapy.therapy}
                </ItemText>
              </ItemCard>
            ))}
          </ItemsList>
        ) : (
          <EmptyListText>
            Belum ada terapi yang ditambahkan
          </EmptyListText>
        )}
      </FormSection>
    </Container>
  )
}

export default TherapyTab
