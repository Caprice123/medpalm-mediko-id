import styled from 'styled-components'
import { Numeric } from '../../../../Hub.styles'

export const Section = styled.div`
  padding: 1rem 1.25rem 0.5rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;

  h2 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-gray-800);
  }
`

export const ClearFilter = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue);

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`

// A row, not a card: the hairline is the only separator, and the whole row is the control.
export const Row = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px 2rem;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  text-align: left;
  padding: 0.625rem 1.25rem;
  border: none;
  border-top: 1px solid var(--color-gray-100);
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue-tint)' : 'transparent')};

  &:hover {
    background: var(--color-brand-blue-tint);
  }

  /* The active topic keeps a visible mark after the pointer leaves, so the panel beside it is
     never filtered by something the rail has stopped showing. */
  box-shadow: ${({ $active }) => ($active ? 'inset 3px 0 0 var(--color-brand-blue)' : 'none')};
`

export const Name = styled.span`
  font-size: 0.8125rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: var(--color-gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Bar = styled.span`
  display: block;
  height: 6px;
  border-radius: 3px;
  background: var(--color-gray-100);
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    border-radius: 3px;
    width: ${({ $value }) => Math.max(2, Math.min(100, $value))}%;
    background: ${({ $color }) => $color};
  }
`

export const Score = styled(Numeric)`
  font-size: 0.8125rem;
  font-weight: 700;
  text-align: right;
  color: ${({ $color }) => $color};
`

export const EmptyRows = styled.p`
  margin: 0;
  padding: 0.25rem 1.25rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-gray-500);
`

export const Footnotes = styled.dl`
  margin: 0;
  border-top: 1px solid var(--color-gray-200);

  div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
  }

  div + div {
    border-top: 1px solid var(--color-gray-100);
  }

  dd {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-gray-800);
  }
`
