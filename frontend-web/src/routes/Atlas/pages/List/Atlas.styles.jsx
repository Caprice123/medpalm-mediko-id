import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  padding: 3rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(107, 185, 232, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(107, 185, 232, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const QuizDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const QuizStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 700;
`

export const UpdatedText = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: ${props => {
    if (props.topic) return '#dbeafe'
    if (props.subtopic) return '#d1fae5'
    return '#ede9fe'
  }};
  color: ${props => {
    if (props.topic) return '#1e40af'
    if (props.subtopic) return '#065f46'
    return '#5b21b6'
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`
