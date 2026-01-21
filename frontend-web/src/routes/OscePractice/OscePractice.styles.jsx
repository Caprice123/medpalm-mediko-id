import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
    background: #f0fdfa;
`

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.neutral.gray900};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.neutral.gray500};
  margin: 0.5rem 0 0 0;
`

export const StartButton = styled.button`
  background: ${colors.osce.primary};
  color: ${colors.neutral.white};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${colors.osce.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`

export const Section = styled.div`
  margin-bottom: 3rem;
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin: 0;
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: ${colors.neutral.gray500};
`

export const LoadingSpinner = styled.div`
  border: 3px solid ${colors.neutral.gray200};
  border-top: 3px solid ${colors.osce.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${colors.neutral.gray500};

  svg, div {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  p {
    font-size: 1.125rem;
    margin: 0;
  }
`
