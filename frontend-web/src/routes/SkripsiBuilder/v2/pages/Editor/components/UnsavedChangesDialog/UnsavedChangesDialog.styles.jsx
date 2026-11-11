import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Above the editor's own resizable panels and the Excalidraw canvas, both of
     which stack their own layers. */
  z-index: 9999;
  padding: 16px;
`

export const Dialog = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`

export const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-800);
`

export const Message = styled.p`
  margin: 0 0 24px 0;
  color: var(--color-gray-500);
  line-height: 1.5;
`

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`
