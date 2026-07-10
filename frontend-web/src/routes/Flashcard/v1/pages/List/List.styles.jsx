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

export const Header = styled.div`
  max-width: 1280px;
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
`

export const DeckSelectionContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`
