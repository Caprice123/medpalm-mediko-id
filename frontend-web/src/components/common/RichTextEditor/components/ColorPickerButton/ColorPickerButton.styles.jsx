import styled from 'styled-components'

export const PickerWrap = styled.div`
  position: relative;
  display: inline-flex;
`

export const SwatchIndicator = styled.span`
  position: absolute;
  left: 50%;
  bottom: 3px;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
  background: ${p => p.$color || 'transparent'};
`

export const Popover = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  padding: 0.375rem;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
`

export const Swatch = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--color-gray-200);
  cursor: pointer;
  background: ${p => p.$color};

  &:hover { transform: scale(1.1); }
`

export const ClearSwatch = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  color: var(--color-gray-500);
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;

  &:hover { background: var(--color-gray-100); }
`
