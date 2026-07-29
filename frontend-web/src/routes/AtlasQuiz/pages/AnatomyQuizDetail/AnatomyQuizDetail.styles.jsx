import styled from 'styled-components'

export const PageWrapper = styled.div`padding: 2rem 1.5rem;`

export const Inner = styled.div``

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`

export const Brand = styled.div`display: flex; align-items: center; gap: 0.875rem;`

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

export const BrandTitle = styled.div`font-size: 1.1rem; font-weight: 700; color: #0f172a;`
export const BrandSubtitle = styled.div`font-size: 0.8rem; color: #64748b;`

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

export const Breadcrumb = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`

export const BreadcrumbItem = styled.span`
  color: ${({ $active }) => $active ? '#0f172a' : '#94a3b8'};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  &:hover { color: ${({ $clickable }) => $clickable ? '#475569' : 'inherit'}; }
`

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
    $type === 'patologi' ? '#fee2e2' :
    $type === 'easy' ? '#dcfce7' :
    $type === 'hard' ? '#fee2e2' :
    $type === 'medium' ? '#fef9c3' :
    '#f1f5f9'};
  color: ${({ $type }) =>
    $type === 'module' ? '#6d28d9' :
    $type === 'patologi' ? '#b91c1c' :
    $type === 'easy' ? '#15803d' :
    $type === 'hard' ? '#b91c1c' :
    $type === 'medium' ? '#854d0e' :
    '#475569'};
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

export const EmbedCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
`

export const EmbedFrame = styled.iframe`
  width: 100%;
  height: 680px;
  border: none;
  display: block;

  @media (max-width: 768px) {
    height: calc(100vh - 200px);
  }
`

export const SectionCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
`

export const SectionHeader = styled.div`margin-bottom: 1.25rem;`

export const SectionTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SectionSubtitle = styled.p`font-size: 0.825rem; color: #64748b; margin: 0;`

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

export const ModelItemTop = styled.div`display: flex; align-items: flex-start; gap: 0.75rem;`

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

export const ModelItemTitle = styled.div`font-size: 0.875rem; font-weight: 600; color: #0f172a; line-height: 1.4;`
export const ModelItemSubtitle = styled.div`font-size: 0.75rem; color: #64748b;`

export const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

export const QuizCard = styled.div`
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: box-shadow 0.15s, border-color 0.15s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #94a3b8; }
`

export const QuizCardTop = styled.div`display: flex; align-items: flex-start; gap: 0.75rem;`

export const QuizIconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  color: #b45309;
`

export const QuizTitle = styled.div`font-size: 0.875rem; font-weight: 600; color: #0f172a; line-height: 1.4;`

export const QuizCardBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`

export const TagPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $variant }) =>
    $variant === 'easy' ? '#dcfce7' :
    $variant === 'hard' ? '#fee2e2' :
    $variant === 'medium' ? '#fef9c3' :
    '#f1f5f9'};
  color: ${({ $variant }) =>
    $variant === 'easy' ? '#15803d' :
    $variant === 'hard' ? '#b91c1c' :
    $variant === 'medium' ? '#854d0e' :
    '#475569'};
`
