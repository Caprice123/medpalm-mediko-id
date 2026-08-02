import styled from 'styled-components'

export const AdjacentNav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const AdjacentCard = styled.div`
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: box-shadow 0.15s, border-color 0.15s;
  text-align: ${p => p.$right ? 'right' : 'left'};
  align-items: ${p => p.$right ? 'flex-end' : 'flex-start'};

  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #94a3b8; }
`

export const AdjacentCardEmpty = styled.div`
  background: #f8fafc;
  border: 1.5px dashed #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: ${p => p.$right ? 'flex-end' : 'flex-start'};
`

export const AdjacentLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
`

export const AdjacentTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
`
