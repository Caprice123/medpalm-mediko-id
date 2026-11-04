import styled from 'styled-components'

export const McqQuestion = styled.div`
  border: 2px solid var(--color-gray-200);
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
  color: var(--color-gray-900);
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
    if (!p.$answered) return 'var(--color-gray-200)'
    if (p.$correct) return 'var(--color-brand-green)'
    if (p.$selected) return 'var(--color-danger)'
    return 'var(--color-gray-200)'
  }};
  background: ${p => {
    if (!p.$answered) return '#fff'
    if (p.$correct) return 'var(--color-brand-green-tint)'
    if (p.$selected) return 'var(--color-danger-tint-soft)'
    return '#fff'
  }};
  cursor: ${p => p.$answered ? 'default' : 'pointer'};
  text-align: left;
  width: 100%;
  transition: border-color 0.15s, background 0.15s;

  &:hover:not([disabled]) {
    border-color: ${p => !p.$answered ? 'var(--color-brand-blue)' : 'inherit'};
    background: ${p => !p.$answered ? 'var(--color-surface-page)' : 'inherit'};
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
    if (!p.$answered) return 'var(--color-gray-100)'
    if (p.$correct) return 'var(--color-brand-green)'
    if (p.$selected) return 'var(--color-danger)'
    return 'var(--color-gray-100)'
  }};
  color: ${p => (p.$answered && (p.$correct || p.$selected)) ? '#fff' : 'var(--color-gray-700)'};
  transition: all 0.15s;
`

export const McqOptionText = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.5;
`

export const McqImage = styled.img`
  display: block;
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  background: var(--color-gray-100);
`

export const McqNewBadge = styled.span`
  align-self: flex-start;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  border: 1px solid var(--color-brand-blue-tint-strong);
  border-radius: 99px;
  padding: 0.2rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const McqActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const McqNextBtn = styled.button`
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 3px 8px rgba(30, 115, 170,0.3);

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
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`

export const McqScoreLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
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
  color: var(--color-gray-900);
`

export const McqResultLabel = styled.div`
  font-size: 0.6875rem;
  color: var(--color-gray-400);
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
  border: 2px solid var(--color-gray-200);
  border-radius: 8px;
  background: #fff;
  color: var(--color-gray-700);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover { border-color: var(--color-brand-blue); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
