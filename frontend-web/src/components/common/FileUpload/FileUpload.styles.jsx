import styled from 'styled-components'

export const UploadSection = styled.div`
  margin-bottom: 1.5rem;
`

export const UploadArea = styled.div`
  border: 2px dashed ${({ $isDragging }) => $isDragging ? '#3b82f6' : '#cbd5e1'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $isDragging }) => $isDragging ? '#eff6ff' : '#f8fafc'};

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`

export const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`

export const UploadText = styled.p`
  margin: 0.25rem 0;
  color: #475569;
  font-size: 0.95rem;
`

export const ExistingFileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`

export const FileIcon = styled.div`
  font-size: 2rem;
`

export const FileName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
`

export const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
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
    background: #2563eb;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`

export const RemoveButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`
