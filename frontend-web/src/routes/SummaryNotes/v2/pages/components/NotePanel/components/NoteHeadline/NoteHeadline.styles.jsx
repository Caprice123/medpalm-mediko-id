import styled from 'styled-components'

export const NoteTitle = styled.h1`
  margin: 0 0 0.625rem;
  font-size: calc(2rem * var(--reader-font-scale));
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: var(--color-gray-900);

  @media (max-width: 768px) {
    font-size: calc(1.625rem * var(--reader-font-scale));
  }
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3125rem;

  svg { font-size: 0.9375rem; color: var(--color-gray-400); }
`

// The note's own description, treated as the lede it actually is. The old layout
// stamped a decorative "Ringkasan" label above the title and a second "Konten"
// label below the description, so a reader passed two headings before reaching a
// word of the note. A tinted rule carries the same "this is the summary" meaning
// without costing a line of vertical space.
export const Lede = styled.p`
  margin: 1.25rem 0 0;
  padding: 0.125rem 0 0.125rem 1rem;
  border-left: 3px solid var(--color-brand-blue-tint-strong);
  font-size: calc(1.0625rem * var(--reader-font-scale));
  line-height: 1.65;
  color: var(--color-gray-600);
`
