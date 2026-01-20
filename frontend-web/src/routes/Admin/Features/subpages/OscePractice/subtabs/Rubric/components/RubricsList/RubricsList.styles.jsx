import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: 400px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  color: ${colors.neutral.gray500};
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${colors.neutral.gray500};

  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.25rem;
    margin: 1rem 0 0.5rem 0;
    color: ${colors.text.primary};
  }

  p {
    margin: 0 0 1.5rem 0;
    font-size: 0.9375rem;
  }
`
