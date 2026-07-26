import styled from 'styled-components'

/* ── Screen layout ── */

export const PlayerScreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: left 0.25s ease;

  @media (min-width: 769px) {
    left: var(--sidebar-width, 0px);
  }
`

export const PlayerHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
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
  color: #6b7280;
  font-size: 1.5rem;
  padding: 0.125rem 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 6px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #f3f4f6; color: #111827; }
`

export const HeaderTitle = styled.span`
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`

export const HeaderCounter = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  b { color: #111827; font-weight: 700; }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #f3f4f6;
`

export const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #0d9488, #059669);
  transition: width 0.3s ease;
`

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1rem ${p => p.$hasFooter ? '1.5rem' : '1.5rem'};

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
`

export const RatingFooter = styled.div`
  background: white;
  border-top: 1px solid #e5e7eb;
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
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.2rem 0.625rem;
`

export const BreadcrumbSep = styled.span`
  font-size: 0.75rem;
  color: #d1d5db;
`

export const NewBadge = styled.span`
  display: inline-block;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  border: 1px solid #86efac;
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
  color: #6b7280;
  margin: -0.25rem 0 0;
  font-style: italic;
  line-height: 1.5;
`

/* ── Question body ── */

export const VignetteText = styled.p`
  font-size: 0.9375rem;
  color: #1d4ed8;
  line-height: 1.7;
  margin: 0;
  font-style: italic;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  padding: 0.75rem 1rem;
  border-radius: 0 8px 8px 0;
`

export const QuestionText = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
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
    if (p.$state === 'correct') return '#22c55e'
    if (p.$state === 'wrong') return '#ef4444'
    if (p.$state === 'reveal') return '#e5e7eb'
    if (p.$state === 'selected') return '#0d9488'
    return '#e5e7eb'
  }};
  background: ${p => {
    if (p.$state === 'correct') return '#f0fdf4'
    if (p.$state === 'wrong') return '#fef2f2'
    if (p.$state === 'selected') return '#f0fdfa'
    return 'white'
  }};
  color: #111827;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  cursor: ${p => p.$disabled ? 'default' : 'pointer'};
  transition: border-color 0.15s, background 0.15s;

  &:hover:not([disabled]) {
    border-color: #0d9488;
    background: #f0fdfa;
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
    if (p.$state === 'correct') return '#22c55e'
    if (p.$state === 'wrong') return '#ef4444'
    if (p.$state === 'selected') return '#0d9488'
    return '#f3f4f6'
  }};
  color: ${p => ['correct', 'wrong', 'selected'].includes(p.$state) ? 'white' : '#6b7280'};
`

/* ── Answer reveal + explanation ── */

export const AnswerReveal = styled.div`
  padding: 0.875rem 1rem;
  background: #f0fdf4;
  border: 1.5px solid #86efac;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #166534;
  font-weight: 600;
`

export const ExplanationBox = styled.div`
  padding: 0.875rem 1rem;
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.6;

  strong { font-weight: 700; }
`

export const ShowAnswerBtn = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
  &:hover { opacity: 0.9; }
`

/* ── Rating footer ── */

export const RatingBtn = styled.button`
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: 2px solid ${p => p.$color};
  background: white;
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
