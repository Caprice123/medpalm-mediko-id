import styled from 'styled-components'

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`

export const BrandIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-brand-green-tint), var(--color-brand-green-tint-strong));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`

export const BrandTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gray-900);
`

export const BrandSubtitle = styled.div`
  font-size: 0.8rem;
  color: var(--color-gray-500);
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-gray-600);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover { background: var(--color-gray-200); }
`
