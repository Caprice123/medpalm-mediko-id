import styled from 'styled-components'

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`

export const EmptyStateText = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`


export const QuizzesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const QuizCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

export const QuizCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const QuizCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
`

export const StatusBadge = styled.span`
  background: ${props => props.published ? '#dcfce7' : '#e0e7ff'};
  color: ${props => props.published ? '#16a34a' : '#4f46e5'};
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
`

export const QuizImageContainer = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const QuizImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
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
    if (props.university) return '#dbeafe'; // Blue for university
    if (props.semester) return '#d1fae5'; // Green for semester
    return '#ede9fe'; // Purple default
  }};
  color: ${props => {
    if (props.university) return '#1e40af'; // Blue for university
    if (props.semester) return '#065f46'; // Green for semester
    return '#5b21b6'; // Purple default
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`
