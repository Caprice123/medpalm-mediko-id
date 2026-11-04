import styled from 'styled-components'

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem 0.5rem;
`

export const SectionLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-700);
`

export const NodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 1rem 0.35rem ${p => 1 + p.$depth * 1.25}rem;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  border-radius: 0;
  user-select: none;
  background: ${p => p.$selected ? 'var(--color-brand-blue-tint-strong)' : 'transparent'};
  &:hover { background: ${p => p.$selected ? 'var(--color-brand-blue-tint-strong)' : (p.$clickable ? 'var(--color-gray-100)' : 'transparent')}; }
`

export const ChevronIcon = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  width: 0.75rem;
  flex-shrink: 0;
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
  display: inline-block;
`

export const NodeIcon = styled.span`
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const NodeLabel = styled.span`
  font-size: 0.9375rem;
  color: ${p => p.$selected ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-700)'};
  font-weight: ${p => p.$selected ? '600' : '400'};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const LoadingRow = styled.div`
  padding: 0.35rem 1rem 0.35rem ${p => 1 + p.$depth * 1.25}rem;
  font-size: 0.75rem;
  color: ${p => p.$clickable ? 'var(--color-brand-blue)' : 'var(--color-gray-400)'};
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  &:hover { ${p => p.$clickable && 'text-decoration: underline;'} }
`
