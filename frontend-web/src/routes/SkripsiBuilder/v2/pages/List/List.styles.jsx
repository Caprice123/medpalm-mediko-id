import styled from 'styled-components'

export const Container = styled.div`
  background: var(--color-brand-blue-tint);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 44px);

  @media (max-width: 768px) {
    min-height: 100vh;
    padding: 1.5rem 1rem;
  }
`

export const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`
