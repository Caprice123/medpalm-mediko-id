import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 92px);
  max-height: calc(100vh - 92px);
  background: #f0fdfa;
  display: flex;
  justify-content: center;
  overflow: hidden;
`

export const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1280px;
  /* height: 100%; */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`

export const LeftPanel = styled.div`
  width: 380px;
  min-width: 320px;
  max-width: 450px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    border-right: none;
    display: ${props => props.$hidden ? 'none' : 'flex'};
  }
`

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.$hidden ? 'none' : 'flex'};
  }
`

export const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const NewChatButton = styled.button`
  background: white;
  color: #06b6d4;
  border: 1px solid #06b6d4;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ecfeff;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
`

export const SearchContainer = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: white;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

export const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    max-width: 100%;
  }
`
