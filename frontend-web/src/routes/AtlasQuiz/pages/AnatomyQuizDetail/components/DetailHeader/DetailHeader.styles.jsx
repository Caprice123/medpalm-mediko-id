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
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`

export const BrandTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
`

export const BrandSubtitle = styled.div`
  font-size: 0.8rem;
  color: #64748b;
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #475569;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover { background: #e2e8f0; }
`
