import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const TopicSelectionContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`
