import styled from 'styled-components'
import { Numeric, HairlineRow } from '../../../../../../styles/surface.styles'

export const Row = styled(HairlineRow)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px 110px 140px;
  align-items: center;
  gap: 1rem;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.625rem;
  }
`

export const Title = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  color: var(--color-gray-800);
`

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  background: var(--color-brand-blue-tint);
  border: 1px solid var(--color-brand-blue-tint-strong);
  color: var(--color-brand-blue-deep);
`

export const Duration = styled(Numeric)`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

// The line that answers "is this case worth my next fifteen minutes".
export const Record = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $tone, $color }) => ($tone === 'new' ? 'var(--color-gray-500)' : $color)};

  svg {
    flex: none;
  }
`

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
`
