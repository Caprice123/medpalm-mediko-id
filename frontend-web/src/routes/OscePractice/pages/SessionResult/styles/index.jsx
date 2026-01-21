import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
background: #f0fdfa;
`

export const Wrapper = styled.div`
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;

    @media (max-width: 768px) {
      padding: 1rem;
    }
`



export const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 8px;
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;

  &:hover {
    background: ${colors.neutral.gray50};
    border-color: ${colors.primary.main};
    color: ${colors.primary.main};
  }
`

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`

export const TitleSection = styled.div`
  flex: 1;
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin: 0;
`

export const ScoreCard = styled.div`
  background: ${props => props.passing ? colors.success.lighter : colors.error.lighter};
  border: 2px solid ${props => props.passing ? colors.success.main : colors.error.main};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`

export const ScoreLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.passing ? colors.success.darker : colors.error.dark};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const Score = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.passing ? colors.success.main : colors.error.main};
  line-height: 1;
  margin-bottom: 0.25rem;
`

export const ScoreMax = styled.div`
  font-size: 1rem;
  color: ${props => props.passing ? colors.success.darker : colors.error.dark};
  font-weight: 500;
`

export const MetaInfo = styled.div`
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.neutral.gray200};

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`

export const MetaValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  font-weight: 500;
`

export const Content = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.neutral.gray200};
  background: ${colors.neutral.gray50};
  overflow-x: auto;

  @media (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
  }
`

export const Tab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? colors.primary.main : 'transparent'};
  color: ${props => props.active ? colors.primary.main : colors.text.secondary};
  font-size: 0.9375rem;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? 'white' : colors.neutral.gray100};
    color: ${colors.primary.main};
  }

  @media (max-width: 768px) {
    flex: 0 0 auto;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
`

export const TabContent = styled.div`
  padding: 2rem;
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: ${colors.text.secondary};
`

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${colors.neutral.gray200};
  border-top-color: ${colors.primary.main};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

export const ErrorMessage = styled.div`
  background: ${colors.error.lighter};
  border: 1px solid ${colors.error.main};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  color: ${colors.error.dark};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
`
