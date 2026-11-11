import styled from 'styled-components'

export const ConversationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const ConversationCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    border-color: var(--color-gray-300);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

export const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const ConversationTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: var(--color-gray-50);
  border-radius: 6px;
`

export const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
`

export const UserEmail = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-500);
`

export const ConversationStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-200);
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-700);
  font-weight: 700;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`

// Pushes the stats and actions to the bottom so cards in a row line up however
// long their titles are. V1 did this with an inline-styled empty div.
export const CardSpacer = styled.div`
  flex: 1;
`
