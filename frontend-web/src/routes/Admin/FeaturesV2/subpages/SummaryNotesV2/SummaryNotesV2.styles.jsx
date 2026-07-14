import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  flex-shrink: 0;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

export const Layout = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
`

export const TreePane = styled.div`
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  background: #f9fafb;
`

export const ContentPane = styled.div`
  flex: 1;
  overflow-y: auto;
  min-width: 0;
`

export const GlobalSearchBar = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-shrink: 0;
`

export const GlobalSearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  background: white;

  &:focus { border-color: #6ee7b7; box-shadow: 0 0 0 3px rgba(110,231,183,0.15); }
  &::placeholder { color: #9ca3af; }
`

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
  flex-shrink: 0;
`

export const FilterSearch = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #374151;
  outline: none;

  &:focus { border-color: #6ee7b7; }
  &::placeholder { color: #9ca3af; }
`

export const FilterChip = styled.button`
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${p => p.$active ? '#059669' : '#e5e7eb'};
  background: ${p => p.$active ? '#ecfdf5' : 'white'};
  color: ${p => p.$active ? '#059669' : '#6b7280'};
  transition: all 0.15s;
  white-space: nowrap;

  &:hover { border-color: #059669; color: #059669; }
`

export const PaneTitle = styled.div`
  padding: 0.75rem 1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
`

export const UnassignedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  background: ${p => p.$selected ? '#eff6ff' : 'transparent'};
  border-left: 3px solid ${p => p.$selected ? '#2563eb' : 'transparent'};
  border-bottom: 1px solid #e5e7eb;
  user-select: none;
  &:hover { background: ${p => p.$selected ? '#eff6ff' : '#f1f5f9'}; }
`

export const FolderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem 0.5rem ${p => 0.75 + p.$depth * 1}rem;
  cursor: pointer;
  background: ${p => p.$selected ? '#eff6ff' : 'transparent'};
  border-left: 3px solid ${p => p.$selected ? '#2563eb' : 'transparent'};
  user-select: none;
  &:hover { background: ${p => p.$selected ? '#eff6ff' : '#f1f5f9'}; }
`

export const FolderChevron = styled.span`
  font-size: 0.6rem;
  color: #9ca3af;
  width: 0.875rem;
  flex-shrink: 0;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
  display: inline-block;
  visibility: ${p => p.$visible ? 'visible' : 'hidden'};
`

export const FolderIcon = styled.span`
  font-size: 0.8125rem;
  flex-shrink: 0;
`

export const FolderName = styled.span`
  font-size: 0.8125rem;
  color: ${p => p.$selected ? '#1d4ed8' : '#374151'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NoteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  align-content: start;
`

export const NoteCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  &:hover {
    border-color: #6ee7b7;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.12);
    transform: translateY(-2px);
  }
`

export const NoteCardAccent = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #059669, #34d399);
`

export const NoteCardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem 1.125rem;
`

export const NoteCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
`

export const NoteTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const NoteStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;

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

export const NoteDescription = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`

export const NoteActions = styled.div`
  display: flex;
  gap: 0.375rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;

  & > * {
    flex: 1;
    justify-content: center;
  }
`

export const EmptyText = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  padding: 3rem 1.5rem;
  margin: 0;
`

/* ── Assign Folder Modal ── */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

export const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
`

export const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const ModalTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #9ca3af;
  line-height: 1;
  padding: 0.125rem;
  flex-shrink: 0;
  &:hover { color: #374151; }
`

export const ModalBody = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 0.5rem 0;
`

export const ModalFooter = styled.div`
  padding: 0.875rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

/* Folder picker rows inside the modal */

export const PickerNode = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem 0.5rem ${p => 1 + p.$depth * 1.25}rem;
  cursor: pointer;
  background: ${p => p.$linked ? '#f0fdf4' : 'transparent'};
  border-left: 3px solid ${p => p.$linked ? '#16a34a' : 'transparent'};
  transition: background 0.1s;
  &:hover { background: ${p => p.$linked ? '#dcfce7' : '#f9fafb'}; }
`

export const PickerChevron = styled.span`
  font-size: 0.6rem;
  color: #9ca3af;
  width: 0.875rem;
  flex-shrink: 0;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
  display: inline-block;
`

export const PickerIcon = styled.span`
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const PickerName = styled.span`
  font-size: 0.875rem;
  color: #374151;
  flex: 1;
`

export const PickerCheck = styled.span`
  font-size: 0.875rem;
  color: #16a34a;
  font-weight: 700;
  flex-shrink: 0;
`
