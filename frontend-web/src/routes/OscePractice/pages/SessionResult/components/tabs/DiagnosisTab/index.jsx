import { useSelector } from 'react-redux'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  Container,
} from './styles'
import TextInput from '@components/common/TextInput'
import { EmptyListText, FormSection, ItemCard, ItemsList, ItemText, SectionTitle, } from '../../../../SessionPractice/SessionPractice.styles'

function DiagnosisTab() {
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  const diagnosis = sessionDetail.userAnswer.diagnosis || { utama: '', pembanding: [] }
  const mainDiagnosis = diagnosis.utama
  const differentialDiagnoses = diagnosis.pembanding || []

  if (loading.isLoadingSessionDetail) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  return (
    <Container>
      {/* Diagnosa Utama */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA UTAMA
        </SectionTitle>
        <TextInput
          placeholder="Masukkan diagnosa utama..."
          value={mainDiagnosis}
          disabled
        />
      </FormSection>

      {/* Diagnosa Pembanding */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA PEMBANDING
        </SectionTitle>

        {differentialDiagnoses.length > 0 ? (
          <ItemsList>
            {differentialDiagnoses.map((diagnosisItem, index) => (
              <ItemCard key={index}>
                <ItemText>
                  {index + 1}. {diagnosisItem}
                </ItemText>
              </ItemCard>
            ))}
          </ItemsList>
        ) : (
          <EmptyListText>
            Belum ada diagnosa pembanding
          </EmptyListText>
        )}
      </FormSection>
    </Container>
  )
}

export default DiagnosisTab
