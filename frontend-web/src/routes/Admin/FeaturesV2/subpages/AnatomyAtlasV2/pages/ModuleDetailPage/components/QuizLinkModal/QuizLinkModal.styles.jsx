import styled from 'styled-components'

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Slots = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
`

export const SlotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0;

  & + & {
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }
`

export const SlotLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  min-width: 80px;
  flex-shrink: 0;
`

export const SlotValue = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.25rem 0.625rem;
`

export const SlotEmpty = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
`

export const SlotActions = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
`

export const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
`

export const PickerHeader = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
`

export const PickerFor = styled.span`
  color: #6366f1;
`

export const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
  padding-bottom: 0.5rem;
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
  height: 240px;
  overflow-y: auto;
`

export const FolderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.$disabled ? 0.4 : 1};

  &:hover {
    background: ${p => p.$disabled ? 'transparent' : '#f9fafb'};
  }
`

export const FolderIcon = styled.span`
  font-size: 0.95rem;
  flex-shrink: 0;
  color: ${p => p.$isFolder ? '#f59e0b' : '#6366f1'};
`

export const FolderName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: ${p => p.$bold ? 600 : 400};
  color: #111827;
`

export const Chevron = styled.span`
  color: #9ca3af;
  font-size: 0.75rem;
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: #9ca3af;
  font-size: 0.875rem;
`
