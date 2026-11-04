import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: var(--color-brand-blue-tint);
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
  color: var(--color-brand-blue);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const Subtitle = styled.p`
  color: var(--color-gray-500);
  font-size: 1.05rem;
`

export const DeckSelectionContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`
