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

export const NoteCard = styled.div`
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

export const NoteCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const NoteCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
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

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.75rem;
`

export const CardActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  background: white;
  color: #3b82f6;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #eff6ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
