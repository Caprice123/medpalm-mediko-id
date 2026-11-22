import styled from 'styled-components'

export const EmptyHint = styled.div`
  border: 1px dashed var(--color-gray-300);
  border-radius: 10px;
  padding: 1rem;
  font-size: 0.82rem;
  color: var(--color-gray-500);
  text-align: center;
`

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

export const ResultCard = styled.div`
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
`

// The title and the year it was published, on one line: the year is what
// decides whether a source is worth citing, so it is read before the snippet.
export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
`

export const ResultTitle = styled.a`
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-brand-blue-deep);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

// `$muted` marks a year taken from the last update rather than a publication
// date — close enough to judge a source by, not close enough to cite as one.
export const YearBadge = styled.span`
  flex-shrink: 0;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: ${props => (props.$muted ? 'var(--color-gray-100)' : 'var(--color-brand-blue-tint-strong)')};
  color: ${props => (props.$muted ? 'var(--color-gray-500)' : 'var(--color-brand-blue-deep)')};
  font-size: 0.7rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`

export const ResultMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--color-gray-400);
  margin-bottom: 0.35rem;
`

export const ResultSnippet = styled.p`
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--color-gray-600);
  margin: 0 0 0.5rem;
`

// Three buttons in a panel that can be 300px wide, so the row wraps rather
// than pushing the card sideways.
export const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const RawJson = styled.pre`
  margin: 0;
  padding: 0.75rem;
  border-radius: 10px;
  background: var(--color-code-surface);
  color: var(--color-code-text);
  font-size: 0.72rem;
  line-height: 1.5;
  max-height: 22rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
`
