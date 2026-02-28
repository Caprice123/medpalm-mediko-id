import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  padding: 3rem 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(107, 185, 232, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(107, 185, 232, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const FormHeader = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const TopicInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props => props.topic && `
    background: #EFF6FF;
    color: ${colors.primary.dark};
    border: 1px solid ${colors.primary.main};
  `}

  ${props => props.subtopic && `
    background: #ECFDF5;
    color: ${colors.success.dark};
    border: 1px solid ${colors.success.main};
  `}
`

export const EmbedWrapper = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`

export const EmbedFrame = styled.iframe`
  width: 100%;
  height: 700px;
  border: none;
  display: block;

  @media (max-width: 768px) {
    height: calc(100vh - 200px);
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(107, 185, 232, 0.2);
  border-top: 4px solid #6BB9E8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
