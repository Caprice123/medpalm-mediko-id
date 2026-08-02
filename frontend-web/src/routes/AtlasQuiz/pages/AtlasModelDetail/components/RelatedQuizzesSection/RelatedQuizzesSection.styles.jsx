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

export const QuizCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

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

export const QuizTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
`

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
