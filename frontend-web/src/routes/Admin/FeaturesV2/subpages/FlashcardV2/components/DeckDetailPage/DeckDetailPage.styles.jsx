import styled from 'styled-components'

export const DeckSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`

export const TabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 0;
`

export const Tab = styled.button`
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${p => p.$active ? '#0d9488' : '#6b7280'};
  border: none;
  border-bottom: 2px solid ${p => p.$active ? '#0d9488' : 'transparent'};
  background: none;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: -2px;

  &:hover {
    color: #0d9488;
  }
`

export const TabContent = styled.div`
  padding: 1.25rem 0;
`

export const RelationSection = styled.div`
  margin-bottom: 2rem;
`

export const RelationSectionTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const RelationSectionCount = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
  background: #ccfbf1;
  color: #0f766e;
`

export const ContentCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

export const ContentCard = styled.button`
  background: white;
  border: 2px solid ${p => p.$linked ? '#0d9488' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1.125rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  position: relative;

  background: ${p => p.$linked ? '#f0fdfa' : 'white'};

  &:hover:not(:disabled) {
    border-color: #0d9488;
    box-shadow: 0 2px 8px rgba(13, 148, 136, 0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const ContentCardLinkedBadge = styled.span`
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  background: #0d9488;
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
`

export const ContentCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

export const ContentCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`

export const ContentCardDescription = styled.p`
  color: #6b7280;
  font-size: 0.8125rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ContentCardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
`

export const ContentCardTag = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
  background: ${p =>
    p.$type === 'university' ? '#dbeafe' :
    p.$type === 'semester'   ? '#fef3c7' :
    p.$type === 'department' ? '#fce7f3' : '#ede9fe'};
  color: ${p =>
    p.$type === 'university' ? '#1e40af' :
    p.$type === 'semester'   ? '#92400e' :
    p.$type === 'department' ? '#9d174d' : '#5b21b6'};
`

export const ContentCardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`

export const ContentCardStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const ContentCardStatLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
`

export const ContentCardStatValue = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 700;
`

export const EmptyHint = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: 0;
`
