import { EmptyState } from '../../../styles/shared'
import {
  Container,
  Section,
  SectionTitle,
  FeedbackCard,
  ScoreBreakdownGrid,
  BreakdownCard,
  BreakdownLabel,
  BreakdownScore,
  BreakdownMax,
} from './styles'

function HasilTab({ session }) {
  const { totalScore, maxScore, aiFeedback } = session || {}
  const percentage = totalScore && maxScore ? Math.round((totalScore / maxScore) * 100) : 0

  // Parse breakdown from feedback if available (assuming it's in JSON format at the end)
  const getBreakdown = () => {
    // This is a placeholder - you might need to adjust based on actual data structure
    // For now, returning null as breakdown might not be stored separately
    return null
  }

  const breakdown = getBreakdown()

  return (
    <Container>
      <Section>
        <SectionTitle>Hasil Evaluasi</SectionTitle>
        <FeedbackCard>
          {aiFeedback || 'Belum ada feedback untuk sesi ini.'}
        </FeedbackCard>
      </Section>

      {breakdown && (
        <Section>
          <SectionTitle>Breakdown Nilai</SectionTitle>
          <ScoreBreakdownGrid>
            {breakdown.anamnesis !== undefined && (
              <BreakdownCard>
                <BreakdownLabel>Anamnesis</BreakdownLabel>
                <BreakdownScore>{breakdown.anamnesis}</BreakdownScore>
                <BreakdownMax>dari 30</BreakdownMax>
              </BreakdownCard>
            )}
            {breakdown.pemeriksaan !== undefined && (
              <BreakdownCard>
                <BreakdownLabel>Pemeriksaan</BreakdownLabel>
                <BreakdownScore>{breakdown.pemeriksaan}</BreakdownScore>
                <BreakdownMax>dari 20</BreakdownMax>
              </BreakdownCard>
            )}
            {breakdown.diagnosis !== undefined && (
              <BreakdownCard>
                <BreakdownLabel>Diagnosis</BreakdownLabel>
                <BreakdownScore>{breakdown.diagnosis}</BreakdownScore>
                <BreakdownMax>dari 25</BreakdownMax>
              </BreakdownCard>
            )}
            {breakdown.terapi !== undefined && (
              <BreakdownCard>
                <BreakdownLabel>Terapi</BreakdownLabel>
                <BreakdownScore>{breakdown.terapi}</BreakdownScore>
                <BreakdownMax>dari 25</BreakdownMax>
              </BreakdownCard>
            )}
          </ScoreBreakdownGrid>
        </Section>
      )}

      {!aiFeedback && (
        <EmptyState>
          Sesi ini belum dievaluasi atau belum selesai.
        </EmptyState>
      )}
    </Container>
  )
}

export default HasilTab
