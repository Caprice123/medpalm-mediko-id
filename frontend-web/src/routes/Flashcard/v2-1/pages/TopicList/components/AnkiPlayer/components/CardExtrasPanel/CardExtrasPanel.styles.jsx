import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const ShortExplanationLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
`

export const ShortExplanationBox = styled.div`
  background: var(--color-brand-green-tint);
  border: 1px solid var(--color-brand-green-tint-strong);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: var(--color-brand-green-darker);
  line-height: 1.5;
  white-space: pre-wrap;
`

export const LongExplanationToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: var(--color-gray-200); }
`

export const LongExplanationChevron = styled.svg`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  transform: rotate(${p => p.$open ? '180deg' : '0deg'});
  color: var(--color-gray-500);
`

export const LongExplanationCollapse = styled.div`
  display: grid;
  grid-template-rows: ${p => p.$open ? '1fr' : '0fr'};
  transition: grid-template-rows 0.25s ease;
`

export const LongExplanationCollapseInner = styled.div`
  overflow: hidden;
  min-height: 0;
`

export const LongExplanationBox = styled.div`
  margin-top: 0.5rem;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.5;
  white-space: pre-wrap;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-gray-200);
  margin: 0;
`

export const RelatedGrid = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
`

export const RelatedColumn = styled.div`
  flex: 1 1 240px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RelatedColumnLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
  margin-bottom: 0.125rem;
`

export const RelatedRow = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid;
  cursor: pointer;
  transition: opacity 0.15s;

  ${p => p.$variant === 'module'
    ? `background: var(--color-brand-green-tint); border-color: var(--color-brand-green-tint-strong); color: var(--color-brand-green-darker);`
    : `background: var(--color-surface-page); border-color: var(--color-gray-200); color: var(--color-gray-700);`}

  &:hover { opacity: 0.85; }
`

export const RelatedRowText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RelatedRowIcon = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
`
