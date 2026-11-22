import styled from 'styled-components'

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
`

export const Summary = styled.div`
  flex: 1 1 12rem;
  min-width: 0;
  font-size: 0.8rem;
  color: var(--color-gray-600);
`

export const TargetNote = styled.div`
  font-size: 0.72rem;
  color: var(--color-gray-500);
`

// Narrow on purpose: it sits beside the generate button and a full-width
// react-select would push that button onto its own row.
export const StylePicker = styled.div`
  flex: 0 0 11rem;
  min-width: 9rem;
`

export const EmptyHint = styled.div`
  padding: 1rem;
  border: 1px dashed var(--color-gray-300);
  border-radius: 8px;
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--color-gray-500);
  text-align: center;
`

export const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

// Shown when the style numbers its entries: markers already pasted into a
// paragraph are plain text and do not follow a renumbering.
export const Warning = styled.p`
  margin: 0.7rem 0 0;
  font-size: 0.74rem;
  line-height: 1.5;
  color: var(--color-warning-text);
`
