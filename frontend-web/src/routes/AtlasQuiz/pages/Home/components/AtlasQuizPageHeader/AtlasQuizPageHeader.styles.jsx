import styled from 'styled-components'

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const PageHeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-brand-green-tint), var(--color-brand-green-tint-strong));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  color: var(--color-brand-green-darker);
`

export const PageHeaderTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.2rem 0;
  line-height: 1.2;
`

export const PageHeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin: 0;
`
