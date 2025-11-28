import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const Header = styled.div`
  max-width: 1280px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
`

export const CreditBadge = styled.div`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  white-space: nowrap;
`

export const TopicSelectionContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`

export const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const FilterGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FilterLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
  }

  &:hover {
    border-color: #06b6d4;
  }
`

export const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`

export const TopicCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(6, 182, 212, 0.15);
    border-color: #06b6d4;
  }
`

export const TopicHeader = styled.div`
  flex: 1;
`

export const TopicTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

export const TopicDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
`

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const Tag = styled.span`
  background: ${props => props.type === 'university' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.type === 'university' ? '#6366f1' : '#10b981'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const TopicFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const QuestionCount = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
`

export const CostBadge = styled.div`
  color: #06b6d4;
  font-weight: 600;
  margin-top: 0.25rem;
`

export const StartButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
