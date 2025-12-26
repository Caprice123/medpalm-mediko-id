import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 1400px;
  height: 90vh;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f9fafb;
  border-radius: 12px 12px 0 0;
`

export const HeaderContent = styled.div`
  flex: 1;
`

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
`

export const ReadOnlyBadge = styled.span`
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
`

export const UserInfo = styled.div`
  margin-top: 0.5rem;
`

export const UserText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #f0fdfa;
`

export const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const SetTitleText = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`

export const TabBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  min-height: 48px;

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

export const EmptyMessages = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
`

export const EditorPanel = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const EditorContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  /* Match TipTap editor styling */
  > * + * {
    margin-top: 0.75em;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0.75em 0;

    &:first-child {
      margin-top: 0;
    }
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    margin: 0.75em 0;

    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
    margin: 0.75em 0;

    &:first-child {
      margin-top: 0;
    }
  }

  p {
    line-height: 1.6;
    margin: 0.75em 0;

    &:first-child {
      margin-top: 0;
    }
  }

  ul, ol {
    padding-left: 24px;
    margin: 0.75em 0;
  }

  li {
    line-height: 1.6;
  }

  blockquote {
    border-left: 3px solid #06b6d4;
    padding-left: 16px;
    color: #6b7280;
    margin: 0.75em 0;
  }

  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: #ef4444;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 12px 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.75em 0;

    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }

  a {
    color: #06b6d4;
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

  u {
    text-decoration: underline;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.5em 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.75em 0;
  }

  th, td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 0.75em 0;
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
  padding: 3rem;
  color: #6b7280;
  font-size: 14px;
`
