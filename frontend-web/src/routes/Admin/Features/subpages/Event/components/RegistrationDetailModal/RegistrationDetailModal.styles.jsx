import styled from 'styled-components'

export const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`

export const SectionTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem;
`

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const DetailItem = styled.div``

export const DetailLabel = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0 0.125rem;
`

export const DetailValue = styled.p`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
  margin: 0;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ $s }) =>
    $s === 'approved' ? '#dcfce7' :
    $s === 'rejected' ? '#fee2e2' : '#fef9c3'};
  color: ${({ $s }) =>
    $s === 'approved' ? '#16a34a' :
    $s === 'rejected' ? '#dc2626' : '#854d0e'};
`

export const EvidenceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const EvidenceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`

export const EvidenceInfo = styled.div`
  flex: 1;
`

export const EvidenceFileName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
`

export const NotesField = styled.div`
  margin-top: 0.75rem;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0;
`

export const GrantedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const GrantedTag = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  background: #dcfce7;
  color: #16a34a;
`
