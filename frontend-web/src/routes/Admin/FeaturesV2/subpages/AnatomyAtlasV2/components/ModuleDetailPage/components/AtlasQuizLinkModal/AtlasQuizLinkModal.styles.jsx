import styled from 'styled-components'

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const LinkedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const LinkedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
`

export const LinkedTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  flex: 1;
`

export const EmptyLinked = styled.div`
  font-size: 0.825rem;
  color: #94a3b8;
  font-style: italic;
  padding: 0.5rem 0;
`

export const AddRow = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0;
`

export const PickerHeader = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`

export const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  flex-wrap: wrap;
`

export const NavLink = styled.span`
  color: #6366f1;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`

export const NavCurrent = styled.span`
  color: #374151;
  font-weight: 600;
`

export const NavSep = styled.span`
  color: #94a3b8;
`

export const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 260px;
  overflow-y: auto;
`

export const FolderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  background: #f8fafc;
  transition: background 0.12s;
  &:hover { background: ${({ $disabled }) => $disabled ? '#f8fafc' : '#e0e7ff'}; }
`

export const FolderIcon = styled.span`
  font-size: ${({ $isFolder }) => $isFolder ? '0.7rem' : '0.65rem'};
  color: ${({ $isFolder }) => $isFolder ? '#6366f1' : '#10b981'};
  flex-shrink: 0;
`

export const FolderName = styled.span`
  font-size: 0.875rem;
  font-weight: ${({ $bold }) => $bold ? '600' : '400'};
  color: #1e293b;
  flex: 1;
`

export const Chevron = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-left: auto;
`

export const EmptyState = styled.div`
  font-size: 0.825rem;
  color: #94a3b8;
  text-align: center;
  padding: 1rem 0;
`
