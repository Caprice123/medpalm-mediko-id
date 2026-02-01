import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`

export const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const HeaderLeft = styled.div`
  flex: 1;
`

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const CreateButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #0891b2;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
  }
`

export const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SetCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
`

export const SetInfo = styled.div`
  flex: 1;
`

export const SetTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const SetMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`

export const MetaItem = styled.span``

export const SetActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.5rem;
  }
`

export const OpenButton = styled.button`
  background: #84cc16;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #65a30d;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
`

export const DeleteButton = styled.button`
  background: transparent;
  color: #ef4444;
  border: none;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fee2e2;
  }

  &:active {
    transform: scale(0.95);
  }
`

export const EmptyState = styled.div`
  background: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
`

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
`

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  font-size: 16px;
  color: #6b7280;
`
