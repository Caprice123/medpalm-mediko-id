import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionDiagnoses } from '@store/oscePractice/userAction'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  Container,
  Section,
  SectionTitle,
  Badge,
  DiagnosisCard,
  DiagnosisList,
  DiagnosisItem,
  DiagnosisNumber,
  DiagnosisText,
} from './styles'

function DiagnosisTab({ sessionId }) {
  const dispatch = useDispatch()
  const { sessionDiagnoses, loading } = useSelector(state => state.oscePractice)

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionDiagnoses(sessionId))
    }
  }, [sessionId, dispatch])

  const mainDiagnosis = sessionDiagnoses.find(d => d.type === 'utama')
  const differentialDiagnoses = sessionDiagnoses.filter(d => d.type === 'pembanding')

  if (loading.isLoadingSessionDiagnoses) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  return (
    <Container>
      <Section>
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
      </Section>
    </Container>
  )
}

export default DiagnosisTab
