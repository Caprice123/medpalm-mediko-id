import styled from 'styled-components'

export const Warning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: var(--color-warning-tint);
  color: var(--color-warning-text);
  font-size: 0.75rem;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 0.1rem;
    color: var(--color-warning-dark);
  }
`

export const Label = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin-bottom: 0.4rem;
`

export const SectionName = styled.span`
  color: var(--color-brand-blue);
`

// The selection is shown, not edited: it is a reminder of what is about to be
// replaced, so it scrolls rather than growing the modal.
export const SelectedText = styled.div`
  max-height: 140px;
  overflow-y: auto;
  padding: 0.75rem;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 8px;
  background: var(--color-gray-50);
  color: var(--color-gray-700);
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 1rem;
`

// Quick actions sit under the label and above the box they fill, so pressing
// one reads as writing into the prompt rather than as a separate choice.
export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
`

export const Chip = styled.button`
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1.5px solid ${props => (props.$active ? 'var(--color-gray-900)' : 'var(--color-gray-200)')};
  background: ${props => (props.$active ? 'var(--color-gray-900)' : 'var(--color-surface)')};
  color: ${props => (props.$active ? 'var(--color-surface)' : 'var(--color-gray-700)')};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    border-color: var(--color-gray-900);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.4rem;
`

// The revision, once it arrives. Bordered in the brand colour so it reads as
// the answer rather than as more of the form.
// A word the model dropped and a word it added, inline in the revision. Colour
// alone would not survive a colour-blind reader, so each also carries a shape:
// a strike-through for what went, an underline for what arrived.
export const Removed = styled.del`
  background: var(--color-danger-tint-soft);
  color: var(--color-danger-dark);
  text-decoration: line-through;
  text-decoration-thickness: 1px;
`

export const Added = styled.ins`
  background: var(--color-brand-green-tint);
  color: var(--color-brand-green-darker);
  text-decoration: underline;
  text-decoration-thickness: 1px;
`

export const RevisionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

export const ViewSwitch = styled.div`
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 999px;
  background: var(--color-gray-100);
`

export const ViewOption = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  background: ${props => (props.$active ? 'var(--color-surface)' : 'transparent')};
  color: ${props => (props.$active ? 'var(--color-gray-800)' : 'var(--color-gray-500)')};
`

// Said instead of showing two paragraphs that look alike: a model told the text
// already meets the instruction returns it unchanged, and that is an answer.
export const NoChangeNote = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  color: var(--color-warning-text);
`

export const Revision = styled.div`
  max-height: 220px;
  overflow-y: auto;
  padding: 0.75rem;
  border: 1.5px solid var(--color-brand-blue);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-gray-800);
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 0.5rem;
`

export const Divider = styled.div`
  border-top: 1.5px solid var(--color-gray-200);
  margin: 1.25rem 0 1rem;
`

// What the request will carry from the rest of the report. Visually quieter
// than the quick actions below it: this is a setting on the request, not the
// request itself.
export const ContextChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`

export const ContextChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid ${props => (props.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-300)')};
  background: ${props => (props.$active ? 'var(--color-brand-blue-tint)' : 'var(--color-surface)')};
  color: ${props => (props.$active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)')};
  font-size: 0.72rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s;

  &:hover:not(:disabled) {
    border-color: var(--color-brand-blue);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// A draft comes back as editor HTML, so it is shown rendered — a student
// deciding whether to keep it should see what will land in the document, not
// its markup.
export const DraftPreview = styled.div`
  max-height: 320px;
  overflow-y: auto;
  padding: 0.75rem 0.875rem;
  border: 1.5px solid var(--color-brand-blue);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-gray-800);
  font-size: 0.8125rem;
  line-height: 1.7;
  margin-bottom: 0.5rem;

  > :first-child { margin-top: 0; }
  > :last-child { margin-bottom: 0; }

  p { margin: 0 0 0.5rem; }
  ul, ol { margin: 0 0 0.5rem; padding-left: 1.25rem; }
  li { margin-bottom: 0.2rem; }
`
