import styled from 'styled-components';
import { colors } from '@config/colors';

export const FAQWrapper = styled.section`
  padding: 6rem 0;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

export const FAQLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2.5rem;
  align-items: start;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FAQSide = styled.div`
  position: sticky;
  top: 110px;
  text-align: center;

  @media (max-width: 900px) {
    position: static;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: left;
  }
`;

export const SideBubble = styled.div`
  position: relative;
  display: inline-block;
  background: #fff;
  border: 2px solid ${colors.text.primary};
  border-radius: 18px;
  padding: 0.625rem 0.875rem;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.35;
  box-shadow: 4px 4px 0 ${colors.text.primary};
  margin-bottom: 1.125rem;

  @media (max-width: 900px) {
    margin-bottom: 0;
  }

  &::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    border: 2px solid ${colors.text.primary};
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg);
    bottom: -9px;
    left: 50%;
    margin-left: -7px;

    @media (max-width: 900px) {
      display: none;
    }
  }
`;

export const SideMascot = styled.img`
  width: 275px;
  margin: 0 auto;
  animation: faqFloat 5s ease-in-out infinite;

  @media (max-width: 900px) {
    width: 138px;
    margin: 0;
  }

  @keyframes faqFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const FAQList = styled.div`
  display: grid;
  gap: 0.875rem;
`;

export const FAQItem = styled.div`
  background: #fff;
  border: 1.5px solid ${props => props.$open ? colors.primary.main : '#eef1f5'};
  border-radius: 20px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${props => props.$open ? `0 4px 0 ${colors.primary.light}` : '0 4px 0 #eef1f5'};
`;

export const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.text.primary};
  transition: color 0.2s ease;

  &:hover { color: ${colors.primary.main}; }
`;

export const FAQIcon = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$open ? colors.primary.main : 'rgba(107, 185, 232, 0.12)'};
  color: ${props => props.$open ? '#fff' : colors.primary.dark};
  transition: background 0.25s ease, color 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$open ? 'rotate(45deg)' : 'rotate(0deg)'};

  svg { width: 14px; height: 14px; display: block; }
`;

export const FAQAnswer = styled.div`
  max-height: ${props => props.$open ? '400px' : '0'};
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const FAQAnswerInner = styled.div`
  padding: 0 1.5rem 1.25rem;
  font-size: 0.9375rem;
  color: #4b5565;
  line-height: 1.75;
`;
