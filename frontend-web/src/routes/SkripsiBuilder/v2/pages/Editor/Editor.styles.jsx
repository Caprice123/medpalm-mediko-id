import styled from 'styled-components'

export const Wrapper = styled.div`
    background: var(--color-brand-blue-tint);

    /* Resize handle styles */
    .resize-handle-skripsi {
      width: 4px;
      background: var(--color-gray-200);
      cursor: col-resize;
      position: relative;
      transition: background 0.2s;
      user-select: none;

      &:hover {
        background: var(--color-brand-blue);
      }

      &[data-resize-handle-active="pointer"],
      &[data-resize-handle-active="keyboard"] {
        background: var(--color-brand-blue-deep);
      }

      /* Visual indicator */
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 40px;
        background: transparent;
        border-left: 2px dotted var(--color-gray-400);
        border-right: 2px dotted var(--color-gray-400);
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
    }
`

export const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: calc(100vh - 44px);

@media (max-width: 768px) {
    min-height: 100vh;
    max-width: 100%;
    height: initial;
    max-height: initial;
  }
`

export const EditorArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
`

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  font-size: 16px;
  color: var(--color-gray-500);
`
