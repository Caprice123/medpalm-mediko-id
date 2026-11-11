import styled from 'styled-components'

export const ConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-gray-200);
`

export const MetaText = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

// The thread scrolls inside the modal, and paging back loads older messages at
// the top — so this element, not the page, is the scroll container.
export const MessagesScroller = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.25rem;
`

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OlderMessagesNote = styled.div`
  text-align: center;
  padding: 0.625rem;
  color: var(--color-gray-500);
  font-size: 0.8125rem;
`

export const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`

export const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-gray-500);
`

export const MessageContent = styled.div`
  background: ${props => props.$isUser ? 'var(--color-brand-blue)' : 'var(--color-gray-100)'};
  color: ${props => props.$isUser ? 'var(--color-surface)' : 'var(--color-gray-900)'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border-bottom-right-radius: ${props => props.$isUser ? '4px' : '12px'};
  border-bottom-left-radius: ${props => props.$isUser ? '12px' : '4px'};
  max-width: 75%;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.875rem;
`

export const MessageMeta = styled.div`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

// Per-mode categorical accents, matching the reader's badges: blue for Normal,
// green for Validated, fuchsia for Research. The fuchsia has no palette entry
// on purpose — it exists only to be distinguishable from the other two.
export const ModeBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  ${props => {
    switch (props.$mode) {
      case 'normal':
        return `
          background: var(--color-brand-blue-tint-strong);
          color: var(--color-brand-blue-deep);
        `
      case 'validated':
        return `
          background: var(--color-brand-green-tint);
          color: var(--color-brand-green-darker);
        `
      case 'research':
        return `
          background: #fce7f3;
          color: #831843;
        `
      default:
        return `
          background: var(--color-gray-100);
          color: var(--color-gray-500);
        `
    }
  }}
`

// Only AI messages carry sources, so unlike V1 these need no user/AI variants.
export const SourcesSection = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: var(--color-gray-200);
  border-radius: 8px;
  max-width: 75%;
`

export const SourcesTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-gray-700);
`

export const SourceItem = styled.div`
  font-size: 0.75rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  color: var(--color-gray-500);

  &:last-child {
    margin-bottom: 0;
  }
`

export const SourceTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-gray-900);
`

export const SourceUrl = styled.a`
  color: var(--color-brand-blue);
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`
