import styled from 'styled-components'

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.375rem;
`

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${p => (p.$type === 'cloze' ? '#7c3aed' : p.$type === 'occlusion' ? '#b91c1c' : '#2563eb')};
  background: ${p => (p.$type === 'cloze' ? '#ede9fe' : p.$type === 'occlusion' ? '#fee2e2' : '#dbeafe')};
`
