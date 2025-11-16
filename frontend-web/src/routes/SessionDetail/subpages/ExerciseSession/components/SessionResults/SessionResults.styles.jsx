import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`

export const HeaderNav = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const BackLink = styled.button`
  background: transparent;
  border: none;
  color: #0891b2;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #0e7490;
  }
`

export const HeaderTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
`

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

export const ResultCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
`

export const ScoreCircle = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: ${props => {
    if (props.percentage >= 80) return 'linear-gradient(135deg, #10b981, #059669)'
    if (props.percentage >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)'
    return 'linear-gradient(135deg, #ef4444, #dc2626)'
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`

export const ScoreNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  line-height: 1;
`

export const ScoreLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.5rem;
`

export const ResultTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`

export const ResultSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

export const StatCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #8b5cf6;
  margin-bottom: 0.5rem;
`

export const StatLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`

export const Button = styled.button`
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`

export const AnswersSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`

export const AnswerItem = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.isCorrect ? '#f0fdf4' : '#fef2f2'};
  border: 2px solid ${props => props.isCorrect ? '#10b981' : '#ef4444'};
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`

export const AnswerNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
`

export const AnswerStatus = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.isCorrect ? '#10b981' : '#ef4444'};
`

export const AnswerQuestion = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.5;
`

export const AnswerDetails = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;

  strong {
    font-weight: 600;
    color: #1f2937;
  }
`
