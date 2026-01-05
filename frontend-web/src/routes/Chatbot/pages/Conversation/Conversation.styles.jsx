import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f9fafb;
`

export const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

export const BackButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  @media (max-width: 768px) {
    display: block;
  }
`

export const TopicTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.375rem;
  }
`

export const TopicInput = styled.input`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #06b6d4;
  border-radius: 6px;
  outline: none;
  background: white;

  &:focus {
    border-color: #0891b2;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.375rem;
  }
`

export const CreditBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;

  span:first-child {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;

    span:first-child {
      font-size: 0.875rem;
    }
  }
`

export const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: #6b7280;

  div:first-child {
    font-size: 3rem;
  }
`

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: #6b7280;

  div:first-child {
    font-size: 3rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: white;
    color: #3b82f6;
    border: 1px solid #3b82f6;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #eff6ff;
    }
  }
`
