import styled, { keyframes } from 'styled-components'

export const List = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scrollbar-color: var(--color-gray-300) transparent;
`

export const Turn = styled.div`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
`

// The patient speaks on the left on white, the student on the right in brand blue. One
// speaker, one side, one ground — no avatars, because at this density they would crowd the
// text they label.
export const Bubble = styled.div`
  max-width: min(62ch, 82%);
  padding: 0.625rem 0.875rem;
  border-radius: ${({ $isUser }) => ($isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px')};
  background: ${({ $isUser }) => ($isUser ? 'var(--color-brand-blue)' : 'var(--color-surface)')};
  border: 1px solid ${({ $isUser }) => ($isUser ? 'var(--color-brand-blue)' : 'var(--color-gray-200)')};
  color: ${({ $isUser }) => ($isUser ? 'var(--color-surface)' : 'var(--color-gray-700)')};
  font-size: 0.875rem;
  line-height: 1.65;

  p {
    margin: 0 0 0.5rem;
  }

  p:last-child {
    margin-bottom: 0;
  }
`

export const Speaker = styled.span`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ $isUser }) => ($isUser ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-500)')};
`

export const Notice = styled.p`
  margin: 0;
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-gray-500);
`

export const OlderNotice = styled.p`
  margin: 0;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

const pulse = keyframes`
  0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
  30% { transform: translateY(-4px); opacity: 1; }
`

export const Typing = styled.span`
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.125rem 0;

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-gray-400);
    animation: ${pulse} 1.2s ease-in-out infinite;
  }

  i:nth-child(2) { animation-delay: 0.15s; }
  i:nth-child(3) { animation-delay: 0.3s; }

  @media (prefers-reduced-motion: reduce) {
    i { animation: none; opacity: 0.7; }
  }
`
