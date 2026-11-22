import styled from 'styled-components'

export const Message = styled.div`
  display: flex;
  justify-content: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 100%;
`

export const UserMessage = styled.div`
  background: var(--color-brand-blue);
  color: var(--color-surface);
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  border-bottom-right-radius: 4px;
  max-width: 95%;
  word-wrap: break-word;

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 0.75rem;
  }
`

export const AIMessage = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  max-width: 95%;
  word-wrap: break-word;

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 0.75rem;
  }
`

export const MessageContent = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  p {
    margin: 0 0 0.75rem 0;
    &:last-child {
      margin-bottom: 0;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1rem 0 0.5rem 0;
    font-weight: 600;
    &:first-child {
      margin-top: 0;
    }
  }

  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.125rem; }

  @media (max-width: 768px) {
    h1 { font-size: 1.25rem; }
    h2 { font-size: 1.125rem; }
    h3 { font-size: 1rem; }
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.25rem 0;
  }

  code {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.875em;
  }

  pre {
    background: var(--color-code-surface);
    color: var(--color-code-text);
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.75rem 0;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }

    @media (max-width: 768px) {
      padding: 0.75rem;
      font-size: 0.8125rem;
    }
  }

  blockquote {
    border-left: 3px solid var(--color-gray-200);
    padding-left: 1rem;
    margin: 0.75rem 0;
    color: var(--color-gray-500);

    @media (max-width: 768px) {
      padding-left: 0.75rem;
    }
  }

  a {
    color: var(--color-brand-blue);
    text-decoration: underline;
    &:hover {
      color: var(--color-brand-blue-deep);
    }
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.75rem 0;
    display: block;
    overflow-x: auto;

    @media (max-width: 768px) {
      font-size: 0.8125rem;
    }
  }

  th, td {
    border: 1px solid var(--color-gray-200);
    padding: 0.5rem;
    text-align: left;

    @media (max-width: 768px) {
      padding: 0.375rem;
    }
  }

  th {
    background: var(--color-gray-50);
    font-weight: 600;
  }
`

export const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

export const Timestamp = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`

export const ModeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;

  ${props => {
    switch (props.$mode) {
      // 'validated', not 'validated_search' — the stored mode_type is
      // 'validated', so V1's spelling never matched and this badge always fell
      // through to the grey default. The AI Chat tab answers in normal mode
      // now, which keeps that grey default; this case is what the messages
      // answered before the switch still render as.
      case 'validated':
        return `
          background: var(--color-brand-green-tint);
          color: var(--color-brand-green-darker);
        `
      // A per-mode categorical accent: its job is to be unmistakably not the
      // green of Validated, so it stays local rather than joining the palette.
      case 'research':
        return `
          background: #fae8ff;
          color: #86198f;
        `
      default:
        return `
          background: var(--color-gray-100);
          color: var(--color-gray-700);
        `
    }
  }}
`

export const SourcesSection = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-100);

  .sources-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-gray-700);
    margin-bottom: 0.5rem;
  }
`

export const SourceItem = styled.a`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  margin-bottom: 0.25rem;

  &:hover {
    color: var(--color-brand-blue);
  }
`

export const EmptyMessages = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-gray-400);
  font-size: 14px;
`

export const TypingIndicator = styled.div`
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 0;
`

export const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--color-gray-400);
  border-radius: 50%;
  animation: typing 1.4s infinite;
  animation-delay: ${props => props.$delay};

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`
