import styled, { keyframes } from 'styled-components';
import { colors } from '@config/colors';

export const FeaturesWrapper = styled.section`
  padding: 6rem 0;
  position: relative;

  @media (max-width: 768px) {
    padding: 4.5rem 0;
  }
`;

export const TabsScroller = styled.div`
  width: 100%;
  margin-bottom: 1.75rem;
`;

export const TabsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;

  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`;

export const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5625rem 1rem;
  border-radius: 999px;
  border: 1.5px solid ${props => props.$active ? colors.text.primary : '#e5e7eb'};
  background: ${props => props.$active ? colors.text.primary : '#fff'};
  color: ${props => props.$active ? '#fff' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${colors.primary.main};
    color: ${props => props.$active ? '#fff' : colors.text.primary};
  }
`;

export const SlideCard = styled.div`
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 32px;
  box-shadow: 0 1px 0 #eef1f5, 0 6px 0 #eef1f6, 0 18px 40px -24px rgba(17, 26, 43, 0.18);
  padding: clamp(28px, 4.5vw, 56px);
  overflow: hidden;
`;

export const SlideStage = styled.div`
  display: grid;
  touch-action: pan-y;
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: none; }
`;

export const Slide = styled.article`
  grid-area: 1 / 1;
  display: ${props => props.$active ? 'grid' : 'none'};
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

export const SlideNum = styled.span`
  display: block;
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${colors.primary.main};
  letter-spacing: 0.04em;
  margin-bottom: 1.125rem;

  i {
    font-style: normal;
    color: #8a94a6;
    font-weight: 500;
  }
`;

export const SlideIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  font-size: 1.875rem;
  margin-bottom: 1.375rem;
  background: ${props => props.$bg || colors.primary.light};
`;

export const SlideTitle = styled.h3`
  font-size: clamp(1.625rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 0.875rem;
  color: ${colors.text.primary};
`;

export const SlideDescription = styled.p`
  color: #4b5565;
  font-size: 1.0625rem;
  margin: 0 0 1.75rem;
  max-width: 460px;
`;

export const SlideVisual = styled.div`
  position: relative;
  padding: 0 0 28px 48px;

  @media (max-width: 900px) {
    order: -1;
  }

  @media (max-width: 480px) {
    padding: 0 0 20px 34px;
  }
`;

export const Frame = styled.div`
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e8edf3;
  box-shadow: 0 30px 60px -30px rgba(29, 95, 124, 0.4);
  overflow: hidden;
  animation: ${slideIn} 0.4s ease both;
`;

export const FrameBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 14px;
  background: #f3f6f9;
  border-bottom: 1px solid #e8edf3;

  i { width: 10px; height: 10px; border-radius: 50%; background: #dfe5ec; }
  i:nth-child(1) { background: #f7a5a0; }
  i:nth-child(2) { background: #f7d58c; }
  i:nth-child(3) { background: #a9dc86; }
`;

export const FrameUrl = styled.span`
  margin-left: 10px;
  font-size: 0.75rem;
  color: #8a94a6;
  background: #fff;
  border-radius: 8px;
  padding: 4px 12px;
  flex: 1;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FramePlaceholder = styled.div`
  aspect-ratio: 16 / 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, ${props => props.$tint || '#e3f1fb'}, #fff 70%);
`;

export const FramePlaceholderIcon = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 24px;
  background: #fff;
  display: grid;
  place-items: center;
  font-size: 2.25rem;
  box-shadow: 0 12px 24px -12px rgba(17, 26, 43, 0.25);
  margin-bottom: 8px;
`;

export const FramePlaceholderTitle = styled.b`
  font-size: 1.0625rem;
`;

export const FramePlaceholderSub = styled.small`
  font-size: 0.8125rem;
  color: #8a94a6;
`;

export const VideoThumb = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  cursor: pointer;
  background: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export const VideoPlayButton = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;

  &:hover { transform: scale(1.08); }

  svg {
    width: 18px;
    height: 18px;
    color: ${colors.primary.dark};
    margin-left: 3px;
  }
`;

const mascotPop = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.92); }
  to { opacity: 1; transform: none; }
`;

export const SlideMascot = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: clamp(120px, 35%, 213px);
  z-index: 2;
  pointer-events: none;
  user-select: none;
  animation: ${mascotPop} 0.6s 0.1s both;
  filter: drop-shadow(0 10px 16px rgba(17, 26, 43, 0.14));
`;

export const SlideNavRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: clamp(1.75rem, 4vw, 2.75rem);
`;

export const NavArrow = styled.button`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 1.375rem;
  color: ${colors.text.primary};
  cursor: pointer;
  display: grid;
  place-items: center;
  padding-bottom: 2px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary.main};
    color: #fff;
    border-color: ${colors.primary.main};
  }
`;

export const SlideProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 99px;
  background: #eef2f6;
  overflow: hidden;
`;

export const SlideProgressFill = styled.i`
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main});
  width: ${props => props.$progress}%;
`;
