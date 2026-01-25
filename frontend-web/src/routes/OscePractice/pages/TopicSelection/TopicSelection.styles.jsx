import styled from 'styled-components'
import { colors } from '@config/colors'

export const PageContainer = styled.div`
    background: #f0fdfa;
`

export const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    background: "red";
    
    @media (max-width: 768px) {
      padding: 1rem;
    }

`

export const Header = styled.div`
  margin-bottom: 2rem;
`

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.primary.main};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.neutral.gray800};
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.neutral.gray600};
  margin: 0;
`

export const SearchSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TopicCard = styled.div`
  background: ${colors.neutral.white};
  border: 2px solid ${colors.neutral.gray200};
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${colors.primary.main};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
`

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`

export const CardDescription = styled.p`
  color: ${colors.neutral.gray500};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: ${props => props.university ? '#ede9fe' : '#fef3c7'};
  color: ${props => props.university ? '#5b21b6' : '#92400e'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${colors.neutral.gray200};
  font-size: 0.875rem;
  color: ${colors.neutral.gray500};
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.neutral.gray400};
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.neutral.gray500};
  font-weight: 600;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${colors.neutral.gray500};
  background: white;
  border-radius: 12px;

  p {
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: ${colors.neutral.gray500};
`

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${colors.neutral.gray200};
  border-top-color: ${colors.primary.main};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
