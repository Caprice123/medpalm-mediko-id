import styled from 'styled-components';
import { colors } from '@config/colors';

export const TextWrap = styled.div`
  @media (max-width: 1100px) {
    text-align: center;
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  padding: 0.5rem 1.25rem 0.5rem 0.625rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid #eef2f6;
  color: #3d8fc6;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
`;

export const BadgeIcon = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  background: linear-gradient(135deg, ${colors.gradient.light1} 0%, ${colors.gradient.light2} 100%);
  flex-shrink: 0;
`;

export const Title = styled.h1`
  font-size: clamp(2.375rem, 5.6vw, 4rem);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 1.375rem;
  color: ${colors.text.primary};

  span {
    display: block;
  }
`;

export const TitleHighlight = styled.span`
  display: block;
  background: linear-gradient(90deg, #3d8fc6, #6fae2c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Lead = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: #4b5565;
  max-width: 540px;
  margin: 0;

  @media (max-width: 1100px) {
    margin: 0 auto;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
  margin: 2.125rem 0 2.375rem;

  @media (max-width: 1100px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;

    a, button {
      width: 100%;
    }
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: 2.75rem;
  flex-wrap: wrap;

  @media (max-width: 1100px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

export const StatValue = styled.b`
  display: block;
  font-size: 1.625rem;
  font-weight: 700;
  color: #3d8fc6;
  letter-spacing: -0.01em;
`;

export const StatLabel = styled.small`
  font-size: 0.8125rem;
  color: #4b5565;
`;
