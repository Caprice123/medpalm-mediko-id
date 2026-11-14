import styled, { keyframes } from 'styled-components'

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

// The player sits inline in the page flow (under the open topic, or under the
// button that started the session) — it is deliberately not an overlay.
export const Wrapper = styled.div`
  margin: 1rem 0;
  animation: ${fadeSlideUp} 0.3s ease both;
`

export const DeckContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const HeaderSection = styled.div`
  padding: 1.25rem 1.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  border-bottom: 1px solid var(--color-gray-100);

  @media (max-width: 768px) {
    padding: 1rem 1rem 0.875rem;
  }
`

export const BodySection = styled.div`
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`

export const FooterSection = styled.div`
  padding: 1rem 1.75rem 1.25rem;
  border-top: 1px solid var(--color-gray-100);

  @media (max-width: 768px) {
    padding: 0.875rem 1rem 1rem;
  }
`

export const DeckHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const DeckTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
`

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-gray-100);
  border: none;
  border-radius: 50%;
  color: var(--color-gray-500);
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover { background: var(--color-danger-tint); color: var(--color-danger); }
`

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TopicPath = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-500);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--color-gray-100);
  border-radius: 99px;
  overflow: hidden;
`

export const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-blue-light));
  border-radius: 99px;
  transition: width 0.3s ease;
`

export const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const RatingBtn = styled.button`
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: 2px solid ${p => p.$color};
  background: white;
  color: ${p => p.$color};
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${p => p.$color};
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
