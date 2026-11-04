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
  flex-wrap: wrap;
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
    $type === 'patologi' ? 'var(--color-danger-tint)' :
    $type === 'easy' ? 'var(--color-brand-green-tint)' :
    $type === 'hard' ? 'var(--color-danger-tint)' :
    $type === 'medium' ? '#fef9c3' :
    'var(--color-gray-100)'};
  color: ${({ $type }) =>
    $type === 'module' ? '#6d28d9' :
    $type === 'patologi' ? '#b91c1c' :
    $type === 'easy' ? 'var(--color-brand-green-darker)' :
    $type === 'hard' ? '#b91c1c' :
    $type === 'medium' ? '#854d0e' :
    'var(--color-gray-600)'};
`

export const ModelTitle = styled.h1`
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.35rem 0;
  line-height: 1.35;
`

export const ModelDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin: 0;
  line-height: 1.6;
`
