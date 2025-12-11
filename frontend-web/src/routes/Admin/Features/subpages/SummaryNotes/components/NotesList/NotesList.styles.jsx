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

export const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
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
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;

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
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`

export const Tag = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: ${props => props.university ? '#dbeafe' : props.semester ? '#fef3c7' : '#ede9fe'};
  color: ${props => props.university ? '#1e40af' : props.semester ? '#92400e' : '#5b21b6'};
  border-radius: 4px;
  font-size: 0.75rem;
`

export const NoteStats = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
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
