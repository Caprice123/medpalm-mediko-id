import styled from 'styled-components';
import { colors } from '@config/colors';

export const HowItWorksWrapper = styled.section`
  padding: 6rem 0;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

export const DemoPanel = styled.div`
  position: relative;
  background: linear-gradient(135deg, #1B5E7A 0%, #12876F 100%);
  border-radius: 34px;
  padding: 4rem 3.75rem;
  overflow: hidden;
  box-shadow: 0 40px 70px -40px rgba(23, 100, 110, 0.7);

  @media (max-width: 768px) {
    padding: 3rem 1.75rem;
    border-radius: 26px;
  }
`;

export const DemoPanelBlob = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  right: -80px;
  bottom: -120px;
  pointer-events: none;
`;

export const DemoGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 3.5rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

export const DemoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.4375rem 1rem;
  border-radius: 50px;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

export const DemoTitle = styled.h2`
  font-size: clamp(1.75rem, 3.6vw, 2.625rem);
  font-weight: 800;
  line-height: 1.15;
  color: #fff;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
`;

export const DemoSubtitle = styled.p`
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.82);
  margin: 0;
`;

export const DemoSteps = styled.ol`
  list-style: none;
  margin: 1.875rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
`;

export const DemoStep = styled.li`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  font-weight: 600;
  color: #fff;
`;

export const DemoStepNumber = styled.i`
  font-style: normal;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${colors.warning.main};
  display: grid;
  place-items: center;
  font-size: 0.875rem;
`;

export const VideoWrap = styled.div`
  position: relative;
  z-index: 1;
`;

export const VideoFrame = styled.div`
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  border: 4px solid #fff;
  background: #000;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
  aspect-ratio: 16 / 10;
  cursor: pointer;

  img, iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: none;
  }

  iframe {
    position: absolute;
    inset: 0;
  }
`;

export const PlayButton = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;

  &:hover { transform: scale(1.08); }

  svg {
    width: 22px;
    height: 22px;
    color: ${colors.primary.dark};
    margin-left: 4px;
  }
`;

export const VideoMascot = styled.img`
  position: absolute;
  width: 188px;
  right: -30px;
  bottom: -68px;
  z-index: 2;
  pointer-events: none;
  user-select: none;

  @media (max-width: 960px) {
    width: 138px;
    right: -5px;
    bottom: -45px;
  }
`;
