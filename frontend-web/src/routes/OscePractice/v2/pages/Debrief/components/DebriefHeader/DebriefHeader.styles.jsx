import styled from 'styled-components'
import { Numeric } from '../../Debrief.styles'

// The verdict band. One large colour field, and which colour it is *is* the verdict — so the
// student knows the outcome before reading a single number.
export const Band = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.25rem;
  border-radius: 16px;
  background: ${({ $passing }) => ($passing
    ? 'linear-gradient(158deg, var(--color-brand-green-darker) 0%, var(--color-brand-green-dark) 85%)'
    : 'linear-gradient(158deg, var(--color-brand-blue-deep) 0%, var(--color-brand-blue) 85%)')};

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }
`

export const Station = styled.div`
  min-width: 0;

  h1 {
    font-size: 1.625rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0 0 0.4375rem;
    color: var(--color-surface);
  }
`

export const Facts = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1.25rem;
  margin: 0.75rem 0 0;

  div {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
  }

  dt {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-brand-blue-tint);
  }

  dd {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-surface);
  }
`

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  span {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.1875rem 0.5625rem;
    border-radius: 999px;
    background: rgba(4, 74, 119, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: var(--color-surface);
  }
`

// The score, as one block the eye lands on. Not a ring and not a gauge: the number is the
// thing, and the denominator belongs beside it rather than implied by an arc.
export const Score = styled.div`
  text-align: right;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 760px) {
    text-align: left;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 1rem;
  }
`

export const Percentage = styled(Numeric)`
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-surface);

  small {
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0.75;
  }
`

export const Raw = styled(Numeric)`
  display: block;
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue-tint);
`

export const Verdict = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0.625rem 0 0;
  padding: 0.3125rem 0.75rem;
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ $passing }) => ($passing
    ? 'var(--color-brand-green-darker)'
    : 'var(--color-brand-blue-deep)')};
`
