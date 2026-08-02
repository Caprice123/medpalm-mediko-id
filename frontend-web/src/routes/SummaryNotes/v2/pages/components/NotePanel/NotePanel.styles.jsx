import styled from 'styled-components'

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  margin-left: -1rem;

  .bn-editor {
    padding-left: 1rem;
    padding-inline: 0;
  }
`

export const PanelContent = styled.div`
  padding: 1.5rem 2rem;
  padding-right: 1rem;
  background: #fdfcf8;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding-right: 0;
  }
`

// Shared by NoteContent, NoteReferenceSection, and LinkedResourcesSection
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
