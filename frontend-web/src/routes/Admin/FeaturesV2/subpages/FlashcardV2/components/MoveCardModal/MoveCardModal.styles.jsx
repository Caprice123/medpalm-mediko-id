import styled from 'styled-components'

export const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
  padding-bottom: 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
`

export const NavLink = styled.span`
  color: #6366f1;
  cursor: pointer;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`

export const NavCurrent = styled.span`
  color: #374151;
  font-weight: 600;
`

export const NavSep = styled.span`color: #d1d5db;`

export const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 280px;
  max-height: 420px;
  overflow-y: auto;
`

export const FolderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  background: ${p => p.$selected ? '#ede9fe' : 'transparent'};
  opacity: ${p => p.$disabled ? 0.4 : 1};

  &:hover {
    background: ${p => p.$disabled ? 'transparent' : p.$selected ? '#ede9fe' : '#f9fafb'};
  }
`

export const FolderIcon = styled.span`
  font-size: 0.95rem;
  flex-shrink: 0;
  color: ${p => p.$isFolder ? '#f59e0b' : '#9ca3af'};
`

export const FolderName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: ${p => p.$bold ? 600 : 400};
  color: ${p => p.$selected ? '#6d28d9' : '#111827'};
`

export const Chevron = styled.span`
  color: #9ca3af;
  font-size: 0.75rem;
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  color: #9ca3af;
  font-size: 0.875rem;
`
