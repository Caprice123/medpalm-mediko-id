import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 300px);
  overflow: hidden;
  background: #f0fdfa;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    overflow: hidden;
  }
`

export const MessagesWrapper = styled.div`
  padding: 1rem;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  flex: 1;

  @media (max-width: 768px) {
    max-height: calc(100vh - 100px);
  }
`
