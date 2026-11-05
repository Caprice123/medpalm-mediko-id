import styled from 'styled-components'

/* ── Screen layout ── */

export const PlayerScreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--color-gray-50);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: left 0.25s ease;

  @media (min-width: 769px) {
    left: var(--sidebar-width, 0px);
  }
`

export const PlayerHeader = styled.div`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-gray-200);
  flex-shrink: 0;
`

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-gray-500);
  font-size: 1.5rem;
  padding: 0.125rem 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 6px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
  &:hover { background: var(--color-gray-100); color: var(--color-gray-900); }
`

export const HeaderTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
`

export const RevealAllBtn = styled.button`
  background: none;
  border: 1.5px solid var(--color-brand-blue);
  color: var(--color-brand-blue);
  border-radius: 8px;
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--color-brand-blue);
    color: var(--color-surface);
  }
`

export const HeaderCounter = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-400);
  b { color: var(--color-gray-900); font-weight: 700; }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--color-gray-100);
`

export const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-blue-deep));
  transition: width 0.3s ease;
`

/* ── Split body: case on the left, question on the right ──
   Below 1025px the two panels stack and the body is the single scroll
   container; from 1025px up each panel scrolls on its own and the divider
   between them is draggable (its width published as --case-width). */

const panelScrollbar = `
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--color-gray-300); border-radius: 99px; }
`

export const PlayerBody = styled.div`
  --case-width: ${p => p.$caseWidth}%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${panelScrollbar}

  @media (min-width: 1025px) {
    flex-direction: row;
    overflow: hidden;
  }
`

export const CasePanel = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1rem 0.875rem;
  border-bottom: 1px solid var(--color-gray-200);

  @media (min-width: 1025px) {
    flex: 0 0 var(--case-width, 50%);
    width: var(--case-width, 50%);
    min-width: 0;
    overflow-y: auto;
    border-bottom: none;
    padding: 1.5rem;
    ${panelScrollbar}
  }
`

export const ResizeHandle = styled.div`
  display: none;

  @media (min-width: 1025px) {
    display: block;
    width: 6px;
    flex-shrink: 0;
    cursor: col-resize;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      background: var(--color-gray-200);
      transition: background 0.15s;
    }

    &:hover::after,
    &:active::after {
      background: var(--color-brand-blue);
    }
  }
`

export const QuestionPanel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1rem 1.5rem;

  @media (min-width: 1025px) {
    overflow-y: auto;
    padding: 1.5rem;
    ${panelScrollbar}
  }
`

export const RatingFooter = styled.div`
  background: var(--color-surface);
  border-top: 1px solid var(--color-gray-200);
  padding: 0.875rem 1rem;
  flex-shrink: 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 0.625rem;
`

/* ── Breadcrumb chips ── */

export const BreadcrumbRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`

export const BreadcrumbChip = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 6px;
  padding: 0.2rem 0.625rem;
`

export const BreadcrumbSep = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-300);
`

export const NewBadge = styled.span`
  display: inline-block;
  background: var(--color-brand-green-tint);
  color: var(--color-brand-green-dark);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  border: 1px solid var(--color-brand-green-tint-strong);
`

export const QuestionCountBadge = styled.span`
  display: inline-block;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  border: 1px solid var(--color-brand-blue);
`

/* ── Image block ── */

export const ImageBlock = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  cursor: zoom-in;
  height: 300px;
  flex-shrink: 0;

  @media (min-width: 1025px) {
    height: 360px;
  }
`

export const QuestionImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const ImageCaption = styled.p`
  font-size: 0.78rem;
  color: var(--color-gray-500);
  margin: -0.25rem 0 0;
  font-style: italic;
  line-height: 1.5;
`

/* ── Question body ── */

export const VignetteText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-brand-blue-deep);
  line-height: 1.7;
  margin: 0;
  font-style: italic;
  background: var(--color-brand-blue-tint);
  border-left: 3px solid var(--color-brand-blue);
  padding: 0.75rem 1rem;
  border-radius: 0 8px 8px 0;
  white-space: pre-wrap;
`

export const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-gray-200);

  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`

export const QuestionHeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`

export const QuestionNumber = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  flex-shrink: 0;
`

export const QuestionText = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-900);
  line-height: 1.6;
  margin: 0;
`

/* ── Options ── */

export const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ChoiceBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1.5px solid ${p => {
    if (p.$state === 'correct') return 'var(--color-brand-green)'
    if (p.$state === 'wrong') return 'var(--color-danger)'
    if (p.$state === 'reveal') return 'var(--color-gray-200)'
    if (p.$state === 'selected') return 'var(--color-brand-blue)'
    return 'var(--color-gray-200)'
  }};
  background: ${p => {
    if (p.$state === 'correct') return 'var(--color-brand-green-tint)'
    if (p.$state === 'wrong') return 'var(--color-danger-tint-soft)'
    if (p.$state === 'selected') return 'var(--color-brand-blue-tint)'
    return 'white'
  }};
  color: var(--color-gray-900);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  cursor: ${p => p.$disabled ? 'default' : 'pointer'};
  transition: border-color 0.15s, background 0.15s;

  &:hover:not([disabled]) {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
  }
`

export const ChoiceLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
  background: ${p => {
    if (p.$state === 'correct') return 'var(--color-brand-green)'
    if (p.$state === 'wrong') return 'var(--color-danger)'
    if (p.$state === 'selected') return 'var(--color-brand-blue)'
    return 'var(--color-gray-100)'
  }};
  color: ${p => ['correct', 'wrong', 'selected'].includes(p.$state) ? 'white' : 'var(--color-gray-500)'};
`

/* ── Free-text answer ── */

export const TextAnswerWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

export const TextAnswerInput = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: inherit;
  color: var(--color-gray-900);
  background: var(--color-surface);
  resize: vertical;
  min-height: 4.5rem;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-blue);
  }

  &:disabled {
    background: var(--color-gray-50);
    color: var(--color-gray-500);
  }
`

/* ── Answer reveal + explanation ── */

export const AnswerReveal = styled.div`
  padding: 0.875rem 1rem;
  background: var(--color-brand-green-tint);
  border: 1.5px solid var(--color-brand-green-tint-strong);
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--color-brand-green-darker);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const YourAnswerLine = styled.div`
  color: var(--color-gray-700);
  font-weight: 500;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--color-brand-green-tint-strong);
`

export const ShowAnswerBtn = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-deep) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 4px 12px rgba(30, 115, 170, 0.3);
  &:hover { opacity: 0.9; }
`

/* ── Case-level discussion ── */

export const CaseExplanation = styled.div`
  padding: 0.875rem 1rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.7;
  white-space: pre-wrap;
`

export const CaseExplanationLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gray-500);
  margin-bottom: 0.375rem;
`

/* ── Rating footer ── */

export const RatingBtn = styled.button`
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: 2px solid ${p => p.$color};
  background: var(--color-surface);
  color: ${p => p.$color};
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${p => p.$color};
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const RatingSubLabel = styled.span`
  display: block;
  font-size: 0.625rem;
  opacity: 0.7;
`
