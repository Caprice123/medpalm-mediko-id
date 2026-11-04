import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

// Depth indent plus room for the 2px selection bar, so a selected and an
// unselected row at the same depth align exactly.
const indent = (depth) => `calc(0.75rem + ${depth} * 0.875rem)`

export const NodeRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem 0.375rem ${p => indent(p.$depth)};
  margin: 0 0.375rem;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  background: ${p => p.$selected ? 'var(--color-brand-blue-tint)' : 'transparent'};

  &:hover {
    background: ${p => p.$selected ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-100)'};
  }

  /* A left bar on the active row: the tint alone is easy to lose against the
     hover state, and a reader scanning a long tree needs one unambiguous mark. */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 2px;
    border-radius: 2px;
    background: ${p => p.$selected ? 'var(--color-brand-blue)' : 'transparent'};
  }
`

export const NodeGlyph = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1rem;
  font-size: ${p => p.$chevron ? '0.75rem' : '0.9375rem'};
  color: ${p => p.$selected ? 'var(--color-brand-blue)' : 'var(--color-gray-400)'};
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
  animation: ${p => p.$spinning ? spin : 'none'} 0.7s linear infinite;
`

export const NodeLabel = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: ${p => p.$selected ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-700)'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const HintRow = styled.div`
  padding: 0.3rem 0.5rem 0.3rem ${p => indent(p.$depth)};
  margin: 0 0.375rem;
  font-size: 0.75rem;
  color: var(--color-gray-400);
`
