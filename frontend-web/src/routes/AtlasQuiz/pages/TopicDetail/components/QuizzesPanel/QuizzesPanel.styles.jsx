import styled from 'styled-components'

export const QuizSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
`

export const QuizSectionHeader = styled.div`
  margin-bottom: 1.25rem;
`

export const QuizSectionTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const QuizSectionSubtitle = styled.p`
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
  padding: 1rem 1.125rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  height: 100%;
  transition: box-shadow 0.15s, border-color 0.15s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: var(--color-gray-400); }
`

export const QuizCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

export const QuizIconBox = styled.div`
  width: 34px;
  height: 34px;
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

export const QuizModuleName = styled.div`
  font-size: 0.78rem;
  color: var(--color-gray-500);
`

export const QuizCardDivider = styled.div`
  border-top: 1px solid var(--color-gray-100);
  margin: 0 -1.125rem;
`

export const QuizCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const QuizMeta = styled.span`
  font-size: 0.775rem;
  color: var(--color-gray-400);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const DifficultyTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $level }) =>
    $level === 'easy' ? 'var(--color-brand-green-tint)' :
    $level === 'hard' ? 'var(--color-danger-tint)' :
    '#fef9c3'};
  color: ${({ $level }) =>
    $level === 'easy' ? 'var(--color-brand-green-darker)' :
    $level === 'hard' ? '#b91c1c' :
    '#854d0e'};
`
