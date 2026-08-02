import styled from 'styled-components'

export const PageWrapper = styled.div`
  padding: 2rem 1.5rem;
`

export const Inner = styled.div``

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
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover { background: #e2e8f0; }
`

export const TopicSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
`

export const ClassificationLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
`

export const TopicRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const TopicIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #ede9fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

export const TopicName = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem 0;
`

export const TopicDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`

export const ModulesCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
`

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`


export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const ModuleCard = styled.div`
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.125rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  height: 100%;
  transition: box-shadow 0.15s, border-color 0.15s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #94a3b8; }
`

export const ModuleCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

export const ModuleIconBox = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  color: #047857;
`

export const ModuleTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  flex: 1;
`

export const ModuleCardDivider = styled.div`
  border-top: 1px solid #f1f5f9;
  margin: 0 -1.125rem;
`

export const ModuleCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`

export const ClassificationTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $type }) => $type === 'patologi' ? '#fee2e2' : '#d1fae5'};
  color: ${({ $type }) => $type === 'patologi' ? '#b91c1c' : '#047857'};
`

export const QuizCountTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
`

export const ArrowIcon = styled.span`
  color: #94a3b8;
  font-size: 1rem;
`

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
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const QuizSectionSubtitle = styled.p`
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
  padding: 1rem 1.125rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  height: 100%;
  transition: box-shadow 0.15s, border-color 0.15s;
  &:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #94a3b8; }
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

export const QuizModuleName = styled.div`
  font-size: 0.78rem;
  color: #64748b;
`

export const QuizCardDivider = styled.div`
  border-top: 1px solid #f1f5f9;
  margin: 0 -1.125rem;
`

export const QuizCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const QuizMeta = styled.span`
  font-size: 0.775rem;
  color: #94a3b8;
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
    $level === 'easy' ? '#dcfce7' :
    $level === 'hard' ? '#fee2e2' :
    '#fef9c3'};
  color: ${({ $level }) =>
    $level === 'easy' ? '#15803d' :
    $level === 'hard' ? '#b91c1c' :
    '#854d0e'};
`

export const ModuleSubtitle = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.15rem;
  line-height: 1.3;
`
