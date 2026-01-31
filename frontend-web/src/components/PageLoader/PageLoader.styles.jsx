import styled from 'styled-components';
import { colors } from '@config/colors';

export const LoaderWrapper = styled.div`
  position: ${props => props.fullScreen ? 'fixed' : 'absolute'};
  inset: 0;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${props => props.fullScreen ? '100vw' : '100%'};
  height: ${props => props.fullScreen ? '100vh' : '400px'};
  min-height: ${props => props.minHeight || 'auto'};
  background: ${props => props.fullScreen
    ? `linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%)`
    : 'transparent'};
`;

export const LogoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LogoImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
  animation: bounce 1.2s ease-in-out infinite;

  img {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 6px;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    25% {
      transform: translateY(-15px) scale(1.1);
    }
    50% {
      transform: translateY(0) scale(1);
    }
    75% {
      transform: translateY(-8px) scale(1.05);
    }
  }
`;

export const SpinnerRing = styled.div`
  position: absolute;
  width: ${props => {
    const size = parseInt(props.size) || 80;
    return `${size + 30}px`;
  }};
  height: ${props => {
    const size = parseInt(props.size) || 80;
    return `${size + 30}px`;
  }};
  border: 3px solid transparent;
  border-top-color: ${props => props.fullScreen ? 'rgba(255, 255, 255, 0.3)' : 'rgba(25, 118, 210, 0.3)'};
  border-right-color: ${props => props.fullScreen ? 'rgba(255, 255, 255, 0.3)' : 'rgba(25, 118, 210, 0.3)'};
  border-radius: 50%;
  animation: spin 1.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoaderText = styled.div`
  color: ${props => props.fullScreen ? 'white' : '#1976D2'};
  font-size: ${props => props.fullScreen ? '1.25rem' : '1rem'};
  font-weight: 600;
  font-size: 2rem;
  animation: fadeInOut 1.5s ease-in-out infinite;

  @keyframes fadeInOut {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
