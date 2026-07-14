import styled from 'styled-components'

export const EmptyPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: #9ca3af;
  padding: 3rem;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    min-height: 100vh;
  }
`

export const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  .bn-editor {
    padding: 0;
  }
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
`

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
`

export const BreadcrumbItem = styled.span`
  color: #6b7280;
  cursor: default;
  &:last-child { color: #374151; font-weight: 500; }
`

export const BreadcrumbSep = styled.span`
  color: #d1d5db;
`

export const FullScreenBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.8125rem;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #f9fafb; }

  @media (max-width: 768px) {
    display: none;
  }
`

export const MobileMenuBtn = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.625rem;
    border: none;
    border-radius: 6px;
    background: none;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #0d9488;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    &:hover { background: #f0fdfa; }
  }
`

export const NoteHeaderSection = styled.div`
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #f1f5f9;
`

export const PanelContent = styled.div`
  padding: 1.5rem 2rem;
  background: #fdfcf8;
  min-height: calc(100vh - 70px);
`

export const NoteTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`

export const NoteDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.6;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: ${p => p.$teal ? '#ccfbf1' : '#f1f5f9'};
  color: ${p => p.$teal ? '#0f766e' : '#6b7280'};
`

export const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 2rem 0;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9ca3af;
  white-space: nowrap;
`

export const SectionLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e5e7eb;
`

export const LinkedGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child { margin-bottom: 0; }
`

export const LinkedGroupLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${p => p.$type === 'mcq' ? '#7c3aed' : '#0d9488'};
  margin-bottom: 0.5rem;
`

export const LinkedCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`

export const LinkedCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-left: 4px solid ${p => p.$type === 'mcq' ? '#7c3aed' : '#0d9488'};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: box-shadow 0.15s, background 0.15s;
  width: 100%;

  &:hover {
    background: ${p => p.$type === 'mcq' ? '#faf5ff' : '#f0fdfa'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`

export const LinkedCardTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  flex: 1;
  text-align: left;
`

export const LinkedCardArrow = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`
