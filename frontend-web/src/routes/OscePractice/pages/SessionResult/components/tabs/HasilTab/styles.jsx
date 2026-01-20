import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`

// Section Card
export const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid ${colors.primary.main};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const SectionIcon = styled.span`
  font-size: 1.75rem;
`

// Info Grid (Judul, Mulai Pada, Topik, Batch)
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${colors.neutral.gray50};
  border-radius: 8px;
  border: 1px solid ${colors.neutral.gray200};
`

export const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary.main};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

export const InfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.neutral.gray600};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`

export const InfoValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.text.primary};
`

// Metrics Grid (Durasi, Status, Skor)
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const MetricCard = styled.div`
  background: ${colors.neutral.gray50};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`

export const MetricLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.neutral.gray600};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
`

export const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text.primary};
  font-family: 'Courier New', monospace;
`

export const StatusBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

export const StatusLabel = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.passing ? colors.success.main : colors.error.main};
`

export const MinimumText = styled.div`
  font-size: 0.875rem;
  color: ${colors.neutral.gray600};
`

export const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.passing ? colors.primary.main : colors.error.main};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`

export const ScorePercentage = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`

// Analysis Grid
export const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const CategoryCard = styled.div`
  background: ${colors.neutral.gray50};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${colors.neutral.gray200};
`

export const CategoryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin: 0 0 1rem 0;
`

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors.neutral.gray300};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
`

export const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: ${colors.primary.main};
  transition: width 0.3s ease;
`

export const CategoryScore = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
  text-align: right;
`

export const FormulaText = styled.div`
  font-size: 0.875rem;
  color: ${colors.neutral.gray600};
  font-style: italic;
  background: ${colors.neutral.gray200};
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
`

export const FeedbackText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${colors.text.primary};
  margin-bottom: 0.75rem;
`

export const ReasonLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.primary.main};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`

export const ReasonText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${colors.neutral.gray700};
  background: ${colors.neutral.white};
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid ${colors.primary.main};
`

// Total Score Card
export const TotalScoreCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const TotalScoreLabel = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
`

export const TotalScoreValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.primary.main};
`

// Answer Key Section
export const AnswerKeySection = styled.div`
  margin-top: 1rem;
`

export const AnswerKeyContent = styled.div`
  font-size: 0.9375rem;
  line-height: 1.8;
  color: ${colors.text.primary};

  h1, h2, h3, h4, h5, h6 {
    color: ${colors.primary.main};
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.125rem; }

  p {
    margin-bottom: 1rem;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  strong {
    font-weight: 600;
    color: ${colors.text.primary};
  }

  code {
    background: ${colors.neutral.gray100};
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }

  pre {
    background: ${colors.neutral.gray100};
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
  }

  blockquote {
    border-left: 4px solid ${colors.primary.main};
    padding-left: 1rem;
    margin: 1rem 0;
    color: ${colors.neutral.gray700};
    font-style: italic;
  }
`
