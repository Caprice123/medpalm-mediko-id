import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`

export const HelpText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.375rem 0 0;
`

export const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s;
  color: #6b7280;
  font-size: 0.875rem;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #374151;
`

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.8125rem;
  margin: 0.25rem 0 0;
`
