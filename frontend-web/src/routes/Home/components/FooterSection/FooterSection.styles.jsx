import styled from 'styled-components';
import { colors } from '@config/colors';

export const SocialWrapper = styled.section`
  padding: 5rem 0 4rem;
`;

export const SocialMascot = styled.img`
  display: block;
  width: 213px;
  margin: 0 auto 1rem;
`;

export const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 300px));
  justify-content: center;
  gap: 1.375rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
`;

export const SocialCard = styled.a`
  background: #fff;
  border: 1.5px solid #eef1f5;
  border-radius: 20px;
  box-shadow: 0 5px 0 #eef1f5;
  padding: 1.75rem;
  text-align: center;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(2px);
    box-shadow: 0 4px 0 #dbe9f5;
    border-color: ${colors.primary.main};
  }
`;

export const SocialIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  margin: 0 auto 0.875rem;
  background: ${props => props.$bg || 'rgba(107, 185, 232, 0.15)'};
`;

export const SocialPlatform = styled.h3`
  font-size: 1.1875rem;
  margin: 0 0 0.25rem;
  color: ${colors.text.primary};
`;

export const SocialHandle = styled.p`
  color: #6b7280;
  font-weight: 500;
  margin: 0;
`;

export const Copyright = styled.div`
  text-align: center;
  margin-top: 2.5rem;
  font-size: 0.875rem;
  color: #8a94a6;
`;
