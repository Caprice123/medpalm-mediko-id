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

export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const NoteDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
    if (props.topic) return '#fef3c7'; // Amber for topic
    if (props.department) return '#fce7f3'; // Pink for department
    return '#ede9fe'; // Purple default
  }};
  color: ${props => {
    if (props.university) return '#1e40af'; // Blue for university
    if (props.semester) return '#065f46'; // Green for semester
    if (props.topic) return '#92400e'; // Amber for topic
    if (props.department) return '#9f1239'; // Pink for department
    return '#5b21b6'; // Purple default
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const UpdatedText = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`
