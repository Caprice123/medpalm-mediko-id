import styled from 'styled-components'

export const Container = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  display: flex;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.375rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`

export const ModeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.active ? '#eff6ff' : 'white'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#374151'};

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .cost {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    gap: 0.375rem;

    .cost {
      font-size: 0.6875rem;
    }
  }

  @media (max-width: 768px) {
    flex: 1;
    min-width: 100%;
    justify-content: center;
  }
`
