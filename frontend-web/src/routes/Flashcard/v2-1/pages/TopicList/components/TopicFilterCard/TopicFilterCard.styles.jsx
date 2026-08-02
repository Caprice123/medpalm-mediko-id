import styled from 'styled-components'

export const Card = styled.div`
  margin: 1.25rem 1.5rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
`

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 1rem;
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

export const FieldLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
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
  border: 1.5px solid ${p => p.$active ? '#0d9488' : '#e5e7eb'};
  background: ${p => p.$active ? '#0d9488' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#374151'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) { border-color: #0d9488; color: ${p => p.$active ? '#fff' : '#0d9488'}; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`

export const AvailableText = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
`

export const CountInput = styled.input`
  width: 72px;
  padding: 0.4rem 0.6rem;
  border: 1.5px solid #0d9488;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
`
