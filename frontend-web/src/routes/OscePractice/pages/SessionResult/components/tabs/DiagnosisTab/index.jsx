import { useSelector } from 'react-redux'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  Container,
} from './styles'
import TextInput from '@components/common/TextInput'
import { EmptyListText, FormSection, ItemCard, ItemsList, ItemText, SectionTitle, } from '../../../../SessionPractice/SessionPractice.styles'

function DiagnosisTab() {
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  const mainDiagnosis = sessionDetail.userAnswer.diagnoses.find(d => d.type === 'utama')
  const differentialDiagnoses = sessionDetail.userAnswer.diagnoses.filter(d => d.type === 'pembanding')

  if (loading.isLoadingSessionDetail) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  return (
    <Container>
      {/* <Section>
        <SectionTitle>
          Diagnosis Utama
          <Badge primary>Utama</Badge>
        </SectionTitle>
        {mainDiagnosis ? (
          <DiagnosisCard>{mainDiagnosis.diagnosis}</DiagnosisCard>
        ) : (
          <EmptyState>Belum ada diagnosis utama yang dicatat.</EmptyState>
        )}
      </Section>

      <Section>
        <SectionTitle>
          Diagnosis Pembanding
          <Badge>Pembanding</Badge>
        </SectionTitle>
        {differentialDiagnoses.length > 0 ? (
          <DiagnosisList>
            {differentialDiagnoses.map((diagnosis, index) => (
              <DiagnosisItem key={diagnosis.id}>
                <DiagnosisNumber>{index + 1}</DiagnosisNumber>
                <DiagnosisText>{diagnosis.diagnosis}</DiagnosisText>
              </DiagnosisItem>
            ))}
          </DiagnosisList>
        ) : (
          <EmptyState>Belum ada diagnosis pembanding yang dicatat.</EmptyState>
        )}
      </Section> */}

      {/* Diagnosa Utama */}
      <FormSection>
        <SectionTitle>
          DIAGNOSA UTAMA
        </SectionTitle>
        <TextInput
          placeholder="Masukkan diagnosa utama..."
          value={mainDiagnosis.diagnosis}
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
            {differentialDiagnoses.map((diagnosis, index) => (
              <ItemCard key={index}>
                <ItemText>
                  {index + 1}. {diagnosis.diagnosis}
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
