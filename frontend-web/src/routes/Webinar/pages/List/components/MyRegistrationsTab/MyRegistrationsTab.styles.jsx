import styled from 'styled-components'

export const RegCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 0.75rem;

  @media (max-width: 480px) { flex-direction: column; }
`

export const RegInfo = styled.div`
  flex: 1;
`

export const RegTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.2rem;
`

export const RegMeta = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
`

export const StatusBadge = styled.span`
  flex-shrink: 0;
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

export const EvidenceLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`

export const EvidenceLink = styled.a`
  font-size: 0.75rem;
  color: #2563eb;
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;

  &:hover { background: #dbeafe; }
`

export const JoinLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const JoinLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`

export const AdminNote = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.375rem 0 0;
  font-style: italic;
`
