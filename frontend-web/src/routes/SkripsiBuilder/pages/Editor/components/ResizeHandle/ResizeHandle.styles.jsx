import styled from 'styled-components'

export const Handle = styled.div`
  width: 4px;
  background: #e5e7eb;
  cursor: col-resize;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
  user-select: none;

  &:hover {
    background: #06b6d4;
  }

  &:active {
    background: #0891b2;
  }

  /* Visual indicator on hover */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 40px;
    background: transparent;
    border-left: 2px dotted #9ca3af;
    border-right: 2px dotted #9ca3af;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 768px) {
    display: none;
  }
`
