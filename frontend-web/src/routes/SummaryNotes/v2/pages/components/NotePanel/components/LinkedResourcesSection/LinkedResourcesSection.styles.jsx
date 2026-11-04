import styled from 'styled-components'

// Per-feature categorical accents: these exist to tell content types apart at a
// glance, which is exactly the case the palette rule leaves local to a feature.
// Blue and deep blue come from the brand ramp; purple and orange have no palette
// equivalent because nothing else in the product needs them.
const TYPE_ACCENT = {
  topic: 'var(--color-brand-blue-deep)',
  flashcard: 'var(--color-brand-blue)',
  mcq: '#7c3aed',
  anatomy: '#ea580c',
}

const TYPE_WASH = {
  topic: 'var(--color-brand-blue-tint)',
  flashcard: 'var(--color-brand-blue-tint)',
  mcq: '#f5f0ff',
  anatomy: '#fff4ea',
}

export const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.625rem;
`

export const ResourceCard = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 0.875rem;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;

  &:hover {
    background: ${p => TYPE_WASH[p.$type]};
    border-color: ${p => TYPE_ACCENT[p.$type]};
    transform: translateY(-1px);
  }
`

export const ResourceIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 8px;
  background: ${p => TYPE_WASH[p.$type]};
  color: ${p => TYPE_ACCENT[p.$type]};
  font-size: 1.125rem;
`

export const ResourceInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  flex: 1;
  min-width: 0;
`

export const ResourceKind = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${p => TYPE_ACCENT[p.$type]};
`

export const ResourceTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ResourceMeta = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ResourceArrow = styled.span`
  display: flex;
  flex-shrink: 0;
  color: var(--color-gray-400);
  font-size: 1rem;

  ${ResourceCard}:hover & {
    color: ${p => TYPE_ACCENT[p.$type]};
  }
`
