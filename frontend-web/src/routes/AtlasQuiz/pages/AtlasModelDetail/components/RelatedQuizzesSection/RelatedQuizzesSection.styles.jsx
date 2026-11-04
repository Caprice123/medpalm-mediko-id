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
  color: var(--color-gray-900);
  margin: 0 0 0.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SectionSubtitle = styled.p`
  font-size: 0.825rem;
  color: var(--color-gray-500);
  margin: 0;
`

export const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

export const QuizCard = styled.div`
  border: 1.5px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: box-shadow 0.15s, border-color 0.15s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: var(--color-gray-400); }
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
  background: var(--color-warning-tint);
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
  color: var(--color-gray-900);
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
    $variant === 'easy' ? 'var(--color-brand-green-tint)' :
    $variant === 'hard' ? 'var(--color-danger-tint)' :
    $variant === 'medium' ? '#fef9c3' :
    'var(--color-gray-100)'};
  color: ${({ $variant }) =>
    $variant === 'easy' ? 'var(--color-brand-green-darker)' :
    $variant === 'hard' ? '#b91c1c' :
    $variant === 'medium' ? '#854d0e' :
    'var(--color-gray-600)'};
`
