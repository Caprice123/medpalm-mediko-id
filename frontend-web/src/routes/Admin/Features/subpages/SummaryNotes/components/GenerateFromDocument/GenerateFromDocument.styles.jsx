import styled from 'styled-components'

export const Container = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

export const Header = styled.div`
  margin-bottom: 1rem;
`

export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
`

export const Description = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

export const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`

export const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`

export const UploadText = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0.25rem 0;
`

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border: 2px solid #bfdbfe;
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

export const FileSize = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const GenerateButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const RemoveButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
