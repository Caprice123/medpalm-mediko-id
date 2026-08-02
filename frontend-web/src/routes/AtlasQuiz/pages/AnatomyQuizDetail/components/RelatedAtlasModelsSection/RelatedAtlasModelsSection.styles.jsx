import styled from 'styled-components'

export const SectionCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
`

export const SectionHeader = styled.div`
  margin-bottom: 1.25rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SectionSubtitle = styled.p`
  font-size: 0.825rem;
  color: #64748b;
  margin: 0;
`

export const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const ModelItemCard = styled.div`
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #94a3b8; }
`

export const ModelItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

export const ModelItemIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  color: #047857;
`

export const ModelItemTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
`

export const ModelItemSubtitle = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`
