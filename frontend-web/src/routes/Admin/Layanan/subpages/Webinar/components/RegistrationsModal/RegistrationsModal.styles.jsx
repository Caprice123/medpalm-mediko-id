import styled from 'styled-components'

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
`

export const Tab = styled.button`
  padding: 0.375rem 0.875rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ active }) => active ? '#2563eb' : 'transparent'};
  color: ${({ active }) => active ? 'white' : '#6b7280'};
  transition: all 0.15s;

  &:hover {
    background: ${({ active }) => active ? '#1d4ed8' : '#f3f4f6'};
  }
`

export const RegistrationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const RegistrationCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
`

export const RegHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

export const UserName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
`

export const UserEmail = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
`

export const StatusBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ status }) =>
    status === 'approved' ? '#dcfce7' :
    status === 'rejected' ? '#fee2e2' : '#fef9c3'};
  color: ${({ status }) =>
    status === 'approved' ? '#16a34a' :
    status === 'rejected' ? '#dc2626' : '#854d0e'};
`

export const EvidenceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const EvidenceItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 4px;
  font-size: 0.8125rem;
  text-decoration: none;
  border: 1px solid #bfdbfe;

  &:hover {
    background: #dbeafe;
  }
`

export const RegActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
`

export const AdminNote = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
  font-style: italic;
`

export const NotesInput = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  min-height: 60px;
  margin-top: 0.5rem;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

export const EmptyText = styled.p`
  text-align: center;
  color: #9ca3af;
  padding: 2rem 0;
`

export const DateText = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`
