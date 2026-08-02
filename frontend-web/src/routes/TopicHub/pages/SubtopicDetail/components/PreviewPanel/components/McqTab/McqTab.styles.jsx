import styled from 'styled-components'

export const McqQuestion = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #fff;
`

export const McqText = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.6;
  margin: 0;
`

export const McqOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

export const McqOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
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

export const McqOptionLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.75rem;
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

export const McqOptionText = styled.span`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
`

export const McqExplanation = styled.div`
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.6;
`

export const McqActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const McqNextBtn = styled.button`
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 3px 8px rgba(107,185,232,0.3);

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const McqResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  padding: 1.5rem 0;
  text-align: center;
`

export const McqScore = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`

export const McqScoreLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const McqResultStats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.25rem;
`

export const McqResultStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
`

export const McqResultNum = styled.div`
  font-size: 1.375rem;
  font-weight: 800;
  color: #111827;
`

export const McqResultLabel = styled.div`
  font-size: 0.6875rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const McqResultActions = styled.div`
  display: flex;
  gap: 0.625rem;
  margin-top: 0.25rem;
`

export const McqSecondaryBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover { border-color: #6BB9E8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
