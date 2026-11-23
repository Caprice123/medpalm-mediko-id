import styled from 'styled-components'

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.button`
  width: 100%;
  height: 100%;
  text-align: left;
  background: var(--color-surface);
  border: 1.5px solid ${({ $selected }) => ($selected ? 'var(--color-brand-blue)' : 'var(--color-gray-200)')};
  box-shadow: ${({ $selected }) => ($selected ? '0 0 0 3px var(--color-brand-blue-tint)' : 'none')};
  border-radius: 12px;
  padding: 1rem 1.1rem;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: var(--color-brand-blue-light);
  }
`

export const CardHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-800);
  margin-bottom: 0.3rem;
`

export const CardIcon = styled.span`
  display: inline-flex;
  color: var(--color-brand-blue);
  font-size: 0.95rem;
`

export const CardDescription = styled.p`
  font-size: 0.85rem;
  color: var(--color-gray-500);
  margin: 0 0 0.6rem;
`

export const SectionList = styled.p`
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--color-brand-blue);
  margin: 0;
  word-break: break-word;
`

// Marks an outline this student saved themselves, which only they can see and
// only they can delete.
export const OwnBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-brand-blue-deep);
  background: var(--color-brand-blue-tint);
  border-radius: 999px;
  padding: 0.12rem 0.45rem;
`

export const DeleteOwn = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 6px;
  color: var(--color-gray-400);
  font-size: 0.7rem;
  cursor: pointer;

  &:hover {
    color: var(--color-danger-dark);
    background: var(--color-danger-tint-soft);
  }
`

// A form, not a div: Enter in the field runs the search, which the submit
// handler covers without a per-input key handler.
export const SearchRow = styled.form`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 1rem;

  /* The input is the part that should take the width. */
  > *:first-child {
    flex: 1;
    min-width: 0;
  }
`

export const EmptyNote = styled.p`
  margin: 0;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-gray-500);
  border: 1px dashed var(--color-gray-300);
  border-radius: 10px;
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`
