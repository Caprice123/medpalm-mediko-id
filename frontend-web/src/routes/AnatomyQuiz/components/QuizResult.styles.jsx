import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-surface-page) 0%, var(--color-brand-blue-tint) 100%);
  padding: 2rem;
`

export const ResultContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`

export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--color-gray-200);
`

export const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.score >= 80
      ? 'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-green-dark))'
      : props.score >= 60
      ? 'linear-gradient(135deg, var(--color-warning), var(--color-warning-dark))'
      : 'linear-gradient(135deg, var(--color-danger), var(--color-danger-dark))'};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`

export const ScoreText = styled.div`
  color: white;
  font-size: 3rem;
  font-weight: 800;
`

export const ScoreLabel = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-gray-800);
  margin-bottom: 0.5rem;
`

export const ScoreSubtext = styled.p`
  color: var(--color-gray-500);
  font-size: 1.1rem;
`

export const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const ImageSection = styled.div`
  position: sticky;
  top: 2rem;
  align-self: start;
`

export const ResultsSection = styled.div`
  flex: 1;
`

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const ResultCard = styled.div`
  padding: 1.5rem;
  background: ${props => (props.isCorrect ? 'var(--color-brand-green-tint)' : 'var(--color-danger-tint-soft)')};
  border-left: 4px solid ${props => (props.isCorrect ? 'var(--color-brand-green)' : 'var(--color-danger)')};
  border-radius: 8px;
`

export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const ResultIcon = styled.div`
  font-size: 1.5rem;
`

export const ResultTitle = styled.div`
  font-weight: 700;
  color: var(--color-gray-800);
  font-size: 0.875rem;
`

export const QuestionText = styled.p`
  color: var(--color-gray-600);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
`

export const AnswerRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const AnswerLabel = styled.div`
  font-weight: 600;
  color: var(--color-gray-500);
  min-width: 120px;
`

export const AnswerValue = styled.div`
  color: ${props => (props.isCorrect ? 'var(--color-brand-green-dark)' : 'var(--color-danger-dark)')};
  font-weight: ${props => (props.isCorrect ? 600 : 400)};
`

export const SimilarityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ede9fe;
  color: #7c3aed;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.5rem;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-gray-200);
`

export const ImagePreview = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: var(--color-surface-page);
`

export const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`

export const ImageLabel = styled.div`
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--color-gray-200);
  text-align: center;
  font-weight: 600;
  color: var(--color-gray-500);
  font-size: 0.875rem;
`
