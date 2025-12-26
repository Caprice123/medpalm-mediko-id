import styled from 'styled-components'

export const Container = styled.div`
  height: calc(100vh - 63px);
  max-height: calc(100vh - 63px);
  max-width: 1200px;
  margin: 0 auto;
  background: #f0fdfa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`

export const SetTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
`

export const SetTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-align: center;
`

export const SetTitleInput = styled.input`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  padding: 8px 12px;
  border: 2px solid #06b6d4;
  border-radius: 6px;
  outline: none;
  background: white;
  text-align: center;
  min-width: 300px;

  &:focus {
    border-color: #0891b2;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`

export const EditButton = styled.button`
  background: ${props =>
    props.$variant === 'success' ? '#10b981' :
    props.$variant === 'danger' ? '#ef4444' :
    'transparent'
  };
  color: ${props =>
    props.$variant === 'success' || props.$variant === 'danger' ? 'white' : '#6b7280'
  };
  border: ${props =>
    props.$variant === 'success' || props.$variant === 'danger' ? 'none' : '1px solid #d1d5db'
  };
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props =>
      props.$variant === 'success' ? '#059669' :
      props.$variant === 'danger' ? '#dc2626' :
      '#f3f4f6'
    };
    color: ${props =>
      props.$variant === 'success' || props.$variant === 'danger' ? 'white' : '#1f2937'
    };
  }
`

export const TopActions = styled.div`
  display: flex;
  gap: 12px;
`

export const SaveButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #0891b2;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`

export const ExportButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`

export const TabBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  display: flex;
  gap: 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
`

export const Tab = styled.button`
  background: ${props => props.$active ? '#f0fdfa' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#06b6d4' : 'transparent'};
  color: ${props => props.$active ? '#06b6d4' : '#6b7280'};
  padding: 12px 20px;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: ${props => props.$active ? '#06b6d4' : '#1f2937'};
  }
`

export const EditorArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

export const ChatPanel = styled.div`
  width: 400px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`

export const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`

export const ChatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`

export const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
`

export const MessageBubble = styled.div`
  background: ${props => props.$sender === 'user' ? '#3b82f6' : 'white'};
  color: ${props => props.$sender === 'user' ? 'white' : '#1f2937'};
  padding: 10px 14px;
  border-radius: 12px;
  border: ${props => props.$sender === 'user' ? 'none' : '1px solid #e5e7eb'};
  max-width: 85%;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  /* Markdown styling */
  p {
    margin: 0.5em 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0.75em 0 0.5em 0;
    font-weight: 600;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.1em; }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.25em 0;
  }

  code {
    background: ${props => props.$sender === 'user' ? 'rgba(0, 0, 0, 0.2)' : '#f3f4f6'};
    color: ${props => props.$sender === 'user' ? 'white' : '#ef4444'};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${props => props.$sender === 'user' ? 'rgba(0, 0, 0, 0.3)' : '#1f2937'};
    color: ${props => props.$sender === 'user' ? 'white' : '#f9fafb'};
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5em 0;

    code {
      background: none;
      color: inherit;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid ${props => props.$sender === 'user' ? 'rgba(255, 255, 255, 0.5)' : '#06b6d4'};
    padding-left: 12px;
    margin: 0.5em 0;
    color: ${props => props.$sender === 'user' ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'};
  }

  a {
    color: ${props => props.$sender === 'user' ? 'white' : '#06b6d4'};
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1px solid ${props => props.$sender === 'user' ? 'rgba(255, 255, 255, 0.3)' : '#e5e7eb'};
    margin: 0.75em 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5em 0;
    font-size: 0.9em;
  }

  th, td {
    border: 1px solid ${props => props.$sender === 'user' ? 'rgba(255, 255, 255, 0.3)' : '#e5e7eb'};
    padding: 6px 10px;
    text-align: left;
  }

  th {
    background: ${props => props.$sender === 'user' ? 'rgba(0, 0, 0, 0.2)' : '#f9fafb'};
    font-weight: 600;
  }

  img {
    max-width: 100%;
    border-radius: 6px;
    margin: 0.5em 0;
  }
`

export const MessageTime = styled.span`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
`

export const ChatInputArea = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
`

export const ChatInputWrapper = styled.div`
  display: flex;
  gap: 8px;
`

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  resize: vertical;
  min-height: 42px;
  max-height: 120px;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    border-color: #06b6d4;
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const SendButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #0891b2;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`

export const EditorPanel = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const EditorToolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`

export const ToolbarButton = styled.button`
  background: ${props => props.$active ? '#e0f2fe' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#06b6d4' : '#d1d5db'};
  color: ${props => props.$active ? '#06b6d4' : '#6b7280'};
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f3f4f6;
    border-color: #06b6d4;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const EditorContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  .ProseMirror {
    outline: none;
    min-height: 100%;

    > * + * {
      margin-top: 0.75em;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.3;
    }

    h2 {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.3;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.3;
    }

    p {
      line-height: 1.6;
    }

    ul, ol {
      padding-left: 24px;
    }

    li {
      line-height: 1.6;
    }

    blockquote {
      border-left: 3px solid #06b6d4;
      padding-left: 16px;
      color: #6b7280;
    }

    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }

    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 12px 16px;
      border-radius: 6px;
      overflow-x: auto;

      code {
        background: none;
        padding: 0;
        color: inherit;
      }
    }

    a {
      color: #06b6d4;
      text-decoration: underline;
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
`

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  font-size: 16px;
  color: #6b7280;
`

export const EmptyMessages = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
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
