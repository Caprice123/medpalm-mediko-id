import styled from 'styled-components'

export const ModelCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
`

export const ModelMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const MetaTag = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: ${({ $type }) =>
    $type === 'module' ? '#ede9fe' :
    $type === 'patologi' ? '#fee2e2' :
    '#d1fae5'};
  color: ${({ $type }) =>
    $type === 'module' ? '#6d28d9' :
    $type === 'patologi' ? '#b91c1c' :
    '#047857'};
`

export const ModelTitle = styled.h1`
  font-size: 1.45rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.35rem 0;
  line-height: 1.35;
`

export const ModelDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
`
