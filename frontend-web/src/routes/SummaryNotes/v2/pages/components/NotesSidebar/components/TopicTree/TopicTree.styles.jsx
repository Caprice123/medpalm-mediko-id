import styled from 'styled-components'

export const SectionBlock = styled.div`
  padding: 0.625rem 0 0.25rem;
`

export const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.25rem 0.875rem 0.375rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;

  &:hover > span { color: var(--color-gray-700); }
`

export const SectionChevron = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 0.625rem;
  color: var(--color-gray-400);
  transform: ${p => p.$open ? 'rotate(90deg)' : 'none'};
  transition: transform 0.15s;
`

export const SectionLabel = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SectionCount = styled.span`
  flex-shrink: 0;
  padding: 0.0625rem 0.375rem;
  border-radius: 99px;
  background: var(--color-gray-100);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-gray-500);
`
