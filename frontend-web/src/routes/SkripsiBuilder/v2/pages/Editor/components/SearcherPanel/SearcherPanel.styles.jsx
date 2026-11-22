import styled from 'styled-components'

export const Panel = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: auto;
    border-bottom: 1px solid var(--color-gray-200);
  }
`

export const Body = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Heading = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
`

export const HeadingIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue);
`

export const HeadingTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.1rem;
`

export const HeadingSubtitle = styled.p`
  font-size: 0.8rem;
  color: var(--color-gray-500);
  margin: 0;
`

export const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
`

export const FieldLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-gray-800);
`

// The order a date field expects, printed next to its label — shared by
// "Terbit setelah" and "Terbit sebelum".
export const FieldFormat = styled.span`
  margin-left: 0.3rem;
  font-weight: 400;
  color: var(--color-gray-400);
  text-transform: none;
`

// The Single/Multiple and Web/Akademik pickers — same control, two uses.
export const Segmented = styled.div`
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 999px;
  background: var(--color-gray-100);
`

export const SegmentedOption = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-500)')};
  background: ${({ $active }) => ($active ? 'var(--color-surface)' : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 2px rgba(11, 20, 25, 0.08)' : 'none')};
`

export const WideSegmented = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

export const WideOption = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue-tint)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)')};
`

export const RunButtonRow = styled.div`
  margin-top: 0.25rem;
`

export const ResultsSection = styled.div`
  border-top: 1px solid var(--color-gray-200);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`

export const ResultsTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
`
