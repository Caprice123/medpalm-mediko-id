import styled from 'styled-components'

export const EmbedCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
`

export const EmbedFrame = styled.iframe`
  width: 100%;
  height: 680px;
  border: none;
  display: block;

  @media (max-width: 768px) {
    height: calc(100vh - 200px);
  }
`
