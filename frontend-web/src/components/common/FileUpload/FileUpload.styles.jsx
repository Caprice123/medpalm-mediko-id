import styled from 'styled-components'

export const UploadSection = styled.div`
  margin-bottom: 1.5rem;
`

export const UploadArea = styled.div`
  border: 2px dashed ${({ $isDragging }) => $isDragging ? 'var(--color-brand-blue)' : 'var(--color-gray-300)'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $isDragging }) => $isDragging ? 'var(--color-brand-blue-tint)' : 'var(--color-surface-page)'};

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
  }
`

export const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`

export const UploadText = styled.p`
  margin: 0.25rem 0;
  color: var(--color-gray-600);
  font-size: 0.95rem;
`

export const ExistingFileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface-page);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
`

export const FileIcon = styled.div`
  font-size: 2rem;
`

export const FileName = styled.div`
  font-weight: 600;
  color: var(--color-gray-900);
  font-size: 0.95rem;
`

export const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--color-brand-blue);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: var(--color-brand-blue-deep);
  }

  &:disabled {
    background: var(--color-gray-400);
    cursor: not-allowed;
  }
`

export const RemoveButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--color-danger-dark);
  }
`
