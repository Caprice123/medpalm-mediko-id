import styled, { keyframes } from 'styled-components'

const timerDrain = keyframes`
  0%   { width: 100%; background: #22C55E; }
  50%  { background: #22C55E; }
  51%  { background: #F59E0B; }
  90%  { background: #F59E0B; }
  91%  { background: #EF4444; }
  100% { width: 0%;  background: #EF4444; }
`

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
  display: flex;
  flex-direction: column;
`

export const StickyHeader = styled.div`
  position: sticky;
  top: 90px;
  z-index: 10;
`

export const TopBar = styled.div`
  background: #fff;
  border-bottom: 2px solid #a5f3fc;
  padding: 0.875rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.75rem 1rem;
  }
`

export const LeftSlot = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

export const TopBarTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`

export const TimerBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$urgent ? '#FEE2E2' : '#EFF6FF'};
  color: ${props => props.$urgent ? '#DC2626' : '#1E40AF'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  font-weight: 700;
`

export const ProgressBar = styled.div`
  height: 4px;
  background: #a5f3fc;
  width: 100%;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s;
  width: ${props => props.$pct}%;
`

export const Main = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
`

export const QuestionCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`

export const QuestionCounter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 1rem;
`

export const QuestionText = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  line-height: 1.6;
  margin-bottom: 1.75rem;
`

export const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`

export const OptionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  background: ${props =>
    props.$correct ? '#D1FAE5' :
    props.$wrong   ? '#FEE2E2' :
    props.$selected ? '#EFF6FF' : '#fff'};
  border: 2px solid ${props =>
    props.$correct ? '#10B981' :
    props.$wrong   ? '#EF4444' :
    props.$selected ? '#3B82F6' : '#e5e7eb'};
  border-radius: 10px;
  cursor: ${props => props.$locked ? 'default' : 'pointer'};
  text-align: left;
  transition: all 0.15s;
  font-size: 0.9375rem;
  color: #111827;

  &:hover {
    ${props => !props.$locked && `border-color: #93c5fd; background: #f0f9ff;`}
  }
`

export const OptionLetter = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props =>
    props.$correct ? '#10B981' :
    props.$wrong   ? '#EF4444' :
    props.$selected ? '#3B82F6' : '#f3f4f6'};
  color: ${props => (props.$correct || props.$wrong || props.$selected) ? '#fff' : '#374151'};
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
`

export const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const StreakBadge = styled.div`
  background: #fff7ed;
  border: 2px solid #f97316;
  color: #c2410c;
  border-radius: 20px;
  padding: 0.3rem 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`

export const ScoreBadge = styled.div`
  background: #ecfdf5;
  border: 2px solid #6ee7b7;
  color: #065f46;
  border-radius: 20px;
  padding: 0.3rem 0.875rem;
  font-size: 0.9375rem;
  font-weight: 700;
`

export const SpecialMultBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #fffbeb;
  border: 1.5px solid #fcd34d;
  color: #b45309;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-left: 0.5rem;
`

export const QuestionTimerBar = styled.div`
  height: 6px;
  background: #e5e7eb;
  width: 100%;
`

export const QuestionTimerFill = styled.div`
  height: 100%;
  border-radius: 3px;
  animation: ${timerDrain} ${props => props.$duration}s linear forwards;
  animation-delay: ${props => props.$delay ?? 0}s;
  animation-play-state: ${props => props.$paused ? 'paused' : 'running'};
`

export const PointsFlash = styled.div`
  text-align: center;
  margin-top: 1.25rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.$correct ? '#16a34a' : '#dc2626'};
  animation: fadeInUp 0.2s ease;

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

export const NavRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const NextBtn = styled.button`
  padding: 0.75rem 2rem;
  background: ${props => props.$disabled ? '#e5e7eb' : '#1E40AF'};
  color: ${props => props.$disabled ? '#9CA3AF' : '#fff'};
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.15s;

  &:not(:disabled):hover { background: #1e3a8a; }
`
