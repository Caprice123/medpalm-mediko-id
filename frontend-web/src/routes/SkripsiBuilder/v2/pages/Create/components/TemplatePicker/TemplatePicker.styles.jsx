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

// What step 1 becomes once a template is picked: the grid folds away to this,
// so the two steps below it sit at the top of the page instead of under a wall
// of cards that grows every time an admin publishes another template.
export const ChosenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid var(--color-brand-blue);
  border-radius: 10px;
  background: var(--color-brand-blue-tint);
`

export const ChosenIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: var(--color-brand-blue);
`

export const ChosenName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-brand-blue-deep);
`
