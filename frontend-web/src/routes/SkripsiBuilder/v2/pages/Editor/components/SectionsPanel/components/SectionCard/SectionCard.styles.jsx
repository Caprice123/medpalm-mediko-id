import styled from 'styled-components'

// A block on the sheet, not a card of its own: the rule above it comes from
// the divider between sections, so this carries only its own spacing.
export const Card = styled.section`
  padding: 0.35rem 0 0.75rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`

export const Title = styled.h2`
  flex: 1;
  min-width: 10rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0;
  cursor: ${props => (props.$locked ? 'default' : 'text')};
`

export const TitleField = styled.div`
  flex: 1;
  min-width: 10rem;
`

export const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  color: ${({ $danger, $accent }) => {
    if ($danger) return 'var(--color-danger-dark)'
    return $accent ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'
  }};
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${({ $danger }) => ($danger ? 'var(--color-danger-border)' : 'var(--color-brand-blue)')};
    color: ${({ $danger }) => ($danger ? 'var(--color-danger-dark)' : 'var(--color-brand-blue)')};
    background: ${({ $danger }) => ($danger ? 'var(--color-danger-tint-soft)' : 'var(--color-brand-blue-tint)')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

export const SavingNote = styled.span`
  font-size: 0.72rem;
  color: var(--color-gray-400);
  white-space: nowrap;
`

// Sits where the move and delete buttons would be on an ordinary section, so
// the row does not simply look like its controls failed to load.
export const LockNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
  font-size: 0.72rem;
  color: var(--color-gray-400);
  white-space: nowrap;
`

// What the run is doing to this section, shown beside its heading rather than
// in a progress bar somewhere else: the answer to "is it working" belongs next
// to the text that is about to change.
export const GenerationNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;

  ${({ $status }) => {
    if ($status === 'writing') {
      return `
        background: var(--color-brand-blue-tint);
        color: var(--color-brand-blue-deep);
      `
    }

    if ($status === 'error') {
      return `
        background: var(--color-danger-tint);
        color: var(--color-danger-dark);
      `
    }

    return `
      background: var(--color-gray-100);
      color: var(--color-gray-500);
    `
  }}
`
