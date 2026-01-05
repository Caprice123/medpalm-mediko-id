import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const MessageBubble = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 100%;
`

export const UserMessage = styled.div`
  background: #3b82f6;
  color: white;
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  border-bottom-right-radius: 4px;
  max-width: 70%;
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
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  max-width: 70%;
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

  /* Markdown styles */
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
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875em;
  }

  pre {
    background: #1e1e1e;
    color: #d4d4d4;
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
    border-left: 3px solid #e5e7eb;
    padding-left: 1rem;
    margin: 0.75rem 0;
    color: #6b7280;

    @media (max-width: 768px) {
      padding-left: 0.75rem;
    }
  }

  a {
    color: #3b82f6;
    text-decoration: underline;
    &:hover {
      color: #2563eb;
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
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    text-align: left;

    @media (max-width: 768px) {
      padding: 0.375rem;
    }
  }

  th {
    background: #f9fafb;
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
    switch (props.mode) {
      case 'normal':
        return `
          background: #dbeafe;
          color: #1e40af;
        `
      case 'validated_search':
        return `
          background: #dcfce7;
          color: #166534;
        `
      case 'research':
        return `
          background: #fae8ff;
          color: #86198f;
        `
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `
    }
  }}
`

export const SourcesSection = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;

  .sources-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
`

export const SourceItem = styled.a`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.25rem;

  &:hover {
    color: #3b82f6;
  }
`

export const TypingIndicator = styled.div`
  display: flex;
  gap: 0.375rem;
  padding: 0.5rem 0;
`

export const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
  animation-delay: ${props => props.delay};

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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: #9ca3af;

  div:first-child {
    font-size: 3rem;
  }

  div:last-child {
    font-size: 0.875rem;
  }
`
