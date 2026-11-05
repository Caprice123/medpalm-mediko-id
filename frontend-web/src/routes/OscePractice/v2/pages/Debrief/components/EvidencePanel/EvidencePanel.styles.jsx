import styled from 'styled-components'

// A standard tab strip. Six of these were the whole of V1's result page; here they only switch
// the evidence, while the rubric stays on screen beside them.
export const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0;
  border-bottom: 1px solid var(--color-gray-200);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Tab = styled.button`
  flex: none;
  padding: 0.5625rem 0.75rem;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'transparent')};
  background: none;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)')};
  white-space: nowrap;

  &:hover {
    color: var(--color-brand-blue-deep);
  }
`

// Every view scrolls inside the panel rather than growing the page, so the rubric beside it
// stays aligned with whatever the student is reading.
export const Viewport = styled.div`
  display: flex;
  flex-direction: column;
  height: 560px;
  min-height: 0;
  overflow-y: auto;
  scrollbar-color: var(--color-gray-300) transparent;

  @media (max-width: 1180px) {
    height: 440px;
  }
`

export const ReadOnlyBlock = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-child {
    border-bottom: none;
  }

  h3 {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.5rem;
    color: var(--color-gray-500);
  }
`

export const AnswerList = styled.ol`
  margin: 0;
  padding-left: 1.25rem;

  li {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--color-gray-700);
  }
`

export const AnswerText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-gray-700);
  white-space: pre-line;
`

export const NotAnswered = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-danger-dark);
`

export const Investigation = styled.article`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }

  h3 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0 0 0.625rem;
    color: var(--color-gray-800);
  }
`

export const Plate = styled.button`
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-surface);
  cursor: zoom-in;

  img {
    display: block;
    width: 100%;
    max-height: 320px;
    object-fit: contain;
  }
`

export const Findings = styled.div`
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-gray-700);

  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }

  td, th {
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid var(--color-gray-100);
    text-align: left;
  }
`

export const Interpretation = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-100);

  h4 {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.3125rem;
    color: var(--color-gray-500);
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--color-gray-700);
    white-space: pre-line;
  }
`

export const KeyBlock = styled.div`
  padding: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--color-gray-700);
`
