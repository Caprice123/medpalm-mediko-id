import styled from 'styled-components'

/* ── Page layout (shared across index + subpages) ── */

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

export const FilterRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`

export const ClassificationBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
  letter-spacing: 0.02em;
`

/* ── Shared breadcrumb + page title ── */

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
`

export const BreadcrumbLink = styled.span`
  color: #6366f1;
  cursor: pointer;
  font-weight: 500;

  &:hover { text-decoration: underline; }
`

export const BreadcrumbSep = styled.span`
  color: #d1d5db;
`

export const BreadcrumbCurrent = styled.span`
  color: #6b7280;
`

export const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

/* ── Note-specific shared components ── */

export const NoteStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;

  background: ${p =>
    p.$status === 'published' ? '#dcfce7' :
    p.$status === 'testing'   ? '#fef3c7' : '#f3f4f6'};
  color: ${p =>
    p.$status === 'published' ? '#15803d' :
    p.$status === 'testing'   ? '#92400e' : '#6b7280'};
  border: 1px solid ${p =>
    p.$status === 'published' ? '#bbf7d0' :
    p.$status === 'testing'   ? '#fde68a' : '#e5e7eb'};

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${p =>
      p.$status === 'published' ? '#16a34a' :
      p.$status === 'testing'   ? '#d97706' : '#9ca3af'};
  }
`

export const NoteActions = styled.div`
  display: flex;
  gap: 0.375rem;
  justify-content: flex-end;
`
