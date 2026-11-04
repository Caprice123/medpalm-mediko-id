import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'

export const CardsRow = styled(Row)`
  --bs-gutter-x: 1.125rem;
  --bs-gutter-y: 1.125rem;
  margin: 0;
`

export const CardCol = styled(Col)`
  display: flex;
`

export const SearchForm = styled.form`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`

export const SearchField = styled.div`
  position: relative;
  width: 14rem;

  svg {
    position: absolute;
    left: 0.6875rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-gray-500);
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 2.375rem;
    padding: 0 0.75rem 0 2.125rem;
    border-radius: 999px;
    border: 1px solid var(--color-gray-200);
    background: var(--color-surface);
    font-family: inherit;
    font-size: 0.8125rem;
    color: var(--color-gray-900);

    &::placeholder { color: var(--color-gray-500); }
    &:hover { border-color: var(--color-border-strong); }

    &:focus {
      outline: none;
      border-color: var(--color-brand-blue);
      box-shadow: 0 0 0 3px var(--color-brand-blue-tint);
    }
  }

  @media (max-width: 768px) {
    flex: 1;
    width: auto;
  }
`

/**
 * Nothing claimable. Measured against the live data this is the page's normal
 * state, not an edge case: claim windows run six to seven days, so most of the
 * time no event is open. It gets a real notice rather than a shrug.
 */
export const QuietNotice = styled.div`
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1.375rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.06);

  > svg {
    flex-shrink: 0;
    color: var(--color-brand-blue);
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.1875rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-gray-500);
  }
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`
