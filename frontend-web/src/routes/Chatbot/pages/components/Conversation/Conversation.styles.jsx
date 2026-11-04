import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-gray-50);
`

export const Header = styled.div`
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 1rem 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const HeaderContent = styled.div`
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
  color: var(--color-gray-500);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: var(--color-gray-100);
    color: var(--color-gray-700);
  }

  @media (max-width: 768px) {
    display: block;
  }
`

export const TopicTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
  padding: 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid var(--color-gray-200);
  border-radius: 6px;
  color: var(--color-gray-400);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-gray-100);
    border-color: var(--color-gray-300);
    color: var(--color-gray-700);
  }
`

export const TitleActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) => $variant === 'save' ? `
    background: var(--color-brand-green);
    color: white;
    &:hover { background: var(--color-brand-green-dark); }
  ` : `
    background: var(--color-gray-100);
    color: var(--color-gray-500);
    &:hover { background: var(--color-gray-200); color: var(--color-gray-700); }
  `}
`

export const TopicInput = styled.input`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
  padding: 0.5rem;
  border: 2px solid var(--color-brand-blue);
  border-radius: 6px;
  outline: none;
  background: white;

  &:focus {
    border-color: var(--color-brand-blue-deep);
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
  background: var(--color-gray-100);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);

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
    background: var(--color-gray-300);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray-400);
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
  color: var(--color-gray-500);

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
  color: var(--color-gray-500);

  div:first-child {
    font-size: 3rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: white;
    color: var(--color-brand-blue);
    border: 1px solid var(--color-brand-blue);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--color-brand-blue-tint);
    }
  }
`
