import styled from 'styled-components'

export const Card = styled.div`
  margin: 1.25rem 1.5rem;
  background: #fff;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;

  @media (max-width: 768px) {
    margin: 0.875rem 0;
    padding: 1rem;
  }
`

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-gray-400);
  margin-bottom: 1rem;
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FieldLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.4rem;
`

export const CountRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  align-items: center;
`

export const CountPresetBtn = styled.button`
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  background: ${p => p.$active ? 'var(--color-brand-blue)' : '#fff'};
  color: ${p => p.$active ? '#fff' : 'var(--color-gray-700)'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) { border-color: var(--color-brand-blue); color: ${p => p.$active ? '#fff' : 'var(--color-brand-blue)'}; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`

export const AvailableText = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-400);
`

export const CountInput = styled.input`
  width: 72px;
  padding: 0.4rem 0.6rem;
  border: 1.5px solid var(--color-brand-blue);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(30, 115, 170,0.1);
`
