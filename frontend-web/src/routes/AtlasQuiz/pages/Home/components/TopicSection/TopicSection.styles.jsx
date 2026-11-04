import styled from 'styled-components'

export const Section = styled.div`
  margin-bottom: 2.5rem;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
`

export const SectionSubtitle = styled.p`
  font-size: 0.825rem;
  color: var(--color-gray-400);
  margin: 0;
`

export const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const TopicCard = styled.div`
  background: #fff;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 14px;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.18s, border-color 0.18s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    border-color: var(--color-brand-green-tint-strong);
  }
`

export const CardBody = styled.div`
  padding: 1.125rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`

export const CardDivider = styled.div`
  border-top: 1px solid var(--color-gray-100);
  margin: 0 -1.25rem;
`

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
`

export const CardIconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg || 'var(--color-gray-100)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`

export const CardTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`

export const CardTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
  line-height: 1.4;
`

export const CardDescription = styled.p`
  font-size: 0.8rem;
  color: var(--color-gray-500);
  margin: 0;
  line-height: 1.5;
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CardStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const StatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--color-surface-page);
  color: var(--color-gray-500);
`

export const CardArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400);
  font-size: 1rem;
  transition: color 0.15s, transform 0.15s;

  ${TopicCard}:hover & {
    color: var(--color-brand-green);
    transform: translateX(2px);
  }
`
