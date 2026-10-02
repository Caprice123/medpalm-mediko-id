import styled from 'styled-components';

export const ArtWrap = styled.div`
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  container-type: inline-size;

  @media (max-width: 1100px) {
    margin-top: 1rem;
  }
`;

export const Stage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 100 / 84;
`;

export const Blob = styled.div`
  position: absolute;
  left: 12cqw;
  top: 8cqw;
  width: 80cqw;
  height: 70cqw;
  border-radius: 46% 54% 52% 48% / 50% 44% 56% 50%;
  background:
    radial-gradient(circle at 30% 30%, #dff1fb, transparent 62%),
    radial-gradient(circle at 72% 72%, #e5f6da, transparent 62%);
`;

export const Board = styled.div`
  box-sizing: border-box;
  position: absolute;
  left: 39cqw;
  top: 13cqw;
  width: 58cqw;
  padding: 4.4cqw 4.2cqw;
  background: #fff;
  border: 0.4cqw solid #8fc5e6;
  border-radius: 5cqw;
  box-shadow: 0 5cqw 10cqw -5cqw rgba(29, 95, 124, 0.35);
  z-index: 1;
`;

export const BoardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2cqw;
  font-weight: 600;
  font-size: 3.2cqw;
  white-space: nowrap;
`;

export const BoardTag = styled.span`
  font-size: 2.3cqw;
  font-weight: 600;
  color: #2f7fb3;
  background: #e8f3fb;
  padding: 1cqw 2.4cqw;
  border-radius: 99px;
`;

export const Progress = styled.div`
  height: 1.2cqw;
  border-radius: 99px;
  background: #eef2f6;
  margin: 2.2cqw 0 2.6cqw;
  overflow: hidden;
`;

export const ProgressFill = styled.i`
  display: block;
  height: 100%;
  width: 30%;
  border-radius: inherit;
  background: linear-gradient(90deg, #9ad14f, #6fae2c);
`;

export const Question = styled.p`
  font-weight: 600;
  font-size: 3cqw;
  line-height: 1.4;
  margin: 0 0 2.4cqw;
`;

export const Options = styled.div`
  display: grid;
  gap: 1.2cqw;
`;

export const Option = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 2.2cqw;
  width: 100%;
  text-align: left;
  font: 500 2.7cqw/1.3 'Lexend', system-ui, sans-serif;
  color: #111a2b;
  background: #fff;
  border: 0.3cqw solid #e3e9f0;
  border-radius: 2.6cqw;
  padding: 1.3cqw 1.8cqw;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    border-color: #bfe0f4;
    background: #f7fbfe;
  }

  ${props => props.$state === 'ok' && `
    background: #effae8;
    border-color: #86c440;
  `}

  ${props => props.$state === 'no' && `
    background: #fdeeee;
    border-color: #f2a3a3;
  `}
`;

export const OptionLetter = styled.b`
  flex-shrink: 0;
  width: 4.8cqw;
  height: 4.8cqw;
  border-radius: 1.6cqw;
  display: grid;
  place-items: center;
  font-size: 2.5cqw;
  background: #eef2f6;
  color: #4b5565;

  ${props => props.$state === 'ok' && `background: #86c440; color: #fff;`}
  ${props => props.$state === 'no' && `background: #e86a6a; color: #fff;`}
`;

export const OptionLabel = styled.span`
  flex: 1;
`;

export const OptionBadge = styled.em`
  font-style: normal;
  font-weight: 700;
  font-size: 2.4cqw;
  color: #fff;
  background: #6fae2c;
  padding: 0.6cqw 1.6cqw;
  border-radius: 99px;
  white-space: nowrap;
`;

export const StreakBadge = styled.div`
  position: absolute;
  right: 3cqw;
  top: 4cqw;
  display: flex;
  align-items: center;
  gap: 2.2cqw;
  background: #fff;
  padding: 1.8cqw 3.2cqw 1.8cqw 1.8cqw;
  border-radius: 3.4cqw;
  box-shadow: 0 3cqw 7cqw -2.6cqw rgba(17, 26, 43, 0.3);
  z-index: 3;
`;

export const StreakFire = styled.div`
  width: 7.4cqw;
  height: 7.4cqw;
  border-radius: 50%;
  background: #fff0e6;
  display: grid;
  place-items: center;
  font-size: 3.6cqw;
`;

export const StreakValue = styled.b`
  display: block;
  font-size: 3.2cqw;
  line-height: 1.2;
`;

export const StreakLabel = styled.small`
  font-size: 2.3cqw;
  color: #8a94a6;
`;

export const Mascot = styled.img`
  position: absolute;
  left: -3cqw;
  width: 45cqw;
  bottom: var(--hero-stage-base, 0px);
  z-index: 2;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 2.4cqw 3cqw rgba(17, 26, 43, 0.14));
  animation: heroFloat 5s ease-in-out infinite;

  @keyframes heroFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Bubble = styled.div`
  position: absolute;
  left: 3cqw;
  bottom: calc(var(--hero-stage-base, 0px) + 47cqw);
  z-index: 3;
  background: #fff;
  border: 0.4cqw solid #111a2b;
  border-radius: 3.2cqw;
  padding: 1.8cqw 2.8cqw;
  font-weight: 600;
  font-size: 2.9cqw;
  line-height: 1.3;
  max-width: 31cqw;
  text-align: center;
  box-shadow: 0.8cqw 0.8cqw 0 #111a2b;

  &::after {
    content: '';
    position: absolute;
    left: 9cqw;
    bottom: -1.5cqw;
    width: 2.6cqw;
    height: 2.6cqw;
    background: #fff;
    border: 0.4cqw solid #111a2b;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg);
  }
`;
