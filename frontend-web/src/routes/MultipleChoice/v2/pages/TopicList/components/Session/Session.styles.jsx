import styled from 'styled-components'

export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
`

export const SessionContainer = styled.div`
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.18);
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const SessionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const SessionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

export const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover { background: #fee2e2; color: #ef4444; }
`

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const QuestionCounter = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;

  b { color: #111827; }
`

export const AnsweredCount = styled.div`
  font-size: 0.8125rem;
  color: #9ca3af;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
`

export const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: linear-gradient(90deg, #6BB9E8, #8DC63F);
  border-radius: 99px;
  transition: width 0.3s ease;
`

export const QuestionCard = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fff;
  position: relative;
`

export const NodePath = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const NewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
  border: 1px solid #86efac;
  flex-shrink: 0;
`

export const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

export const QuestionImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f4f6;
  align-self: center;
`

export const QuestionText = styled.p`
  font-size: 1.0625rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.6;
  margin: 0;
`

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid ${p => {
    if (!p.$answered) return '#e5e7eb'
    if (p.$correct) return '#22c55e'
    if (p.$selected) return '#ef4444'
    return '#e5e7eb'
  }};
  background: ${p => {
    if (!p.$answered) return '#fff'
    if (p.$correct) return '#f0fdf4'
    if (p.$selected) return '#fef2f2'
    return '#fff'
  }};
  cursor: ${p => p.$answered ? 'default' : 'pointer'};
  text-align: left;
  width: 100%;
  transition: border-color 0.15s, background 0.15s;

  &:hover:not([disabled]) {
    border-color: ${p => !p.$answered ? '#6BB9E8' : 'inherit'};
    background: ${p => !p.$answered ? '#f0f9ff' : 'inherit'};
  }
`

export const OptionLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  background: ${p => {
    if (!p.$answered) return '#f3f4f6'
    if (p.$correct) return '#22c55e'
    if (p.$selected) return '#ef4444'
    return '#f3f4f6'
  }};
  color: ${p => (p.$answered && (p.$correct || p.$selected)) ? '#fff' : '#374151'};
  transition: all 0.15s;
`

export const OptionText = styled.span`
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.5;
`

export const ExplanationBox = styled.div`
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.6;
`

export const ReferencesBox = styled.div`
  background: #f0f9ff;
  border: 1.5px solid #bae6fd;
  border-radius: 10px;
  padding: 0.875rem 1rem;
`

export const ReferencesLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #0369a1;
  margin-bottom: 0.375rem;
`

export const ReferencesList = styled.ol`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #374151;
`

export const ReferenceLink = styled.a`
  color: #0369a1;
  text-decoration: underline;
`

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const NextButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
  box-shadow: 0 4px 12px rgba(107,185,232,0.35);

  &:hover { opacity: 0.92; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

/* Result screen */
export const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
`

export const ResultScore = styled.div`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`

export const ResultLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const ResultStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
`

export const ResultStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`

export const ResultStatNum = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
`

export const ResultStatLabel = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const ResultActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

export const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover { border-color: #6BB9E8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
