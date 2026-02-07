import styled from 'styled-components'

export const Wrapper = styled.div`
    background: #f0fdfa;

    /* Resize handle styles */
    .resize-handle-skripsi {
      width: 4px;
      background: #e5e7eb;
      cursor: col-resize;
      position: relative;
      transition: background 0.2s;
      user-select: none;

      &:hover {
        background: #06b6d4;
      }

      &[data-resize-handle-active="pointer"],
      &[data-resize-handle-active="keyboard"] {
        background: #0891b2;
      }

      /* Visual indicator */
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 40px;
        background: transparent;
        border-left: 2px dotted #9ca3af;
        border-right: 2px dotted #9ca3af;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }

      &:hover::after {
        opacity: 1;
      }

      @media (max-width: 768px) {
        display: none;
      }
    }
`

export const Container = styled.div`
  height: calc(100vh - 90px);
  max-height: calc(100vh - 90px);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
    height: initial;
    max-height: initial;
  }
`

export const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
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

  @media (max-width: 768px) {
    font-size: 1rem;
  }
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

  @media (max-width: 768px) {
    font-size: 1rem;
    min-width: auto;
    width: 100%;
    padding: 0.5rem;
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

  @media (max-width: 768px) {
    display: none;
  }
`

export const EditorActions = styled.div`
  display: none;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;

  @media (max-width: 768px) {
    display: flex;
    padding: 0.625rem 0.75rem;
    gap: 0.5rem;
  }
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

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.625rem;
    font-size: 0.8125rem;
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

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.625rem;
    font-size: 0.8125rem;
  }
`

export const TabBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  display: flex;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.25rem;
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

  @media (max-width: 768px) {
    /* padding: 0.625rem 0.875rem; */
    font-size: 0.8125rem;
  }
`

export const EditorArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
`

export const ChatPanel = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
`

export const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const ChatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.625rem;
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

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
    max-width: 90%;
  }

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

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

export const ChatInputWrapper = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
    min-height: 38px;
    max-height: 100px;
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

  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }
`

export const EditorPanel = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  @media (max-width: 768px) {
    min-height: 100vh;
    height: 100vh;
    flex-shrink: 0;
  }
`

export const EditorToolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    gap: 0.25rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
`

export const EditorContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    height: 100%;
  }

  /* Ensure BlockNote takes full height */
  > div {
    height: 100%;
    flex: 1;
  }

  /* Custom BlockNote theme overrides */
  .bn-editor {
    background: transparent;
  }

  /* Ensure BlockNote content has good spacing */
  .ProseMirror {
    outline: none;
    padding: 0;

    /* Add spacing between blocks */
    > * + * {
      margin-top: 0.5em;
    }
  }

  /* Image styling for BlockNote */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
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
