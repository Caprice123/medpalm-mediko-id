import styled from 'styled-components'

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--color-gray-500);
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-gray-500);
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

export const ActionButton = styled.button`
  background: var(--color-brand-blue);
  color: white;
  border: 1px solid var(--color-brand-blue);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: var(--color-brand-blue-deep);
  }
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
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-gray-300);
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
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
`

export const StatusBadge = styled.span`
  background: ${props => props.published ? 'var(--color-brand-green-tint)' : '#e0e7ff'};
  color: ${props => props.published ? 'var(--color-brand-green-dark)' : '#4f46e5'};
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
  background: var(--color-gray-100);
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
  color: var(--color-gray-500);
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
  border-top: 1px solid var(--color-gray-200);
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-700);
  font-weight: 700;
`

export const EmbedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.625rem;
  background: #ede9fe;
  color: #6d28d9;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
`

export const ImageBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.625rem;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const CardActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.danger ? 'var(--color-danger)' : 'var(--color-brand-blue)'};
  background: white;
  color: ${props => props.danger ? 'var(--color-danger)' : 'var(--color-brand-blue)'};
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${props => props.danger ? 'var(--color-danger-tint-soft)' : 'var(--color-brand-blue-tint)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
    if (props.university) return 'var(--color-brand-blue-tint-strong)'; // Blue for university
    if (props.semester) return 'var(--color-brand-green-tint)'; // Green for semester
    if (props.topic) return 'var(--color-warning-tint)'; // Amber for topic
    return '#ede9fe'; // Purple default
  }};
  color: ${props => {
    if (props.university) return 'var(--color-brand-blue-deep)'; // Blue for university
    if (props.semester) return 'var(--color-brand-green-darker)'; // Green for semester
    if (props.topic) return '#92400e'; // Amber for topic
    return '#5b21b6'; // Purple default
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`
