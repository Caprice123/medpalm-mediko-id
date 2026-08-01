import styled, { keyframes } from 'styled-components'

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 300;
`

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100vw;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  z-index: 301;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.22s ease both;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100vw;
  }
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 0;
`

export const DrawerTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
`

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #9ca3af;
  padding: 0.125rem;
  flex-shrink: 0;
  line-height: 1;
  &:hover { color: #374151; }
`

export const TabBar = styled.div`
  display: flex;
  gap: 0;
  padding: 1rem 1.25rem 0;
  border-bottom: 2px solid #e5e7eb;
  margin-top: 0.75rem;
`

export const TabBtn = styled.button`
  background: none;
  border: none;
  border-bottom: 2.5px solid ${({ $active }) => $active ? '#10b981' : 'transparent'};
  margin-bottom: -2px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  color: ${({ $active }) => $active ? '#10b981' : '#6b7280'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: ${({ $active }) => $active ? '#10b981' : '#374151'};
  }
`

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const NoteItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 0.875rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: #10b981;
    background: #f0fdf9;
  }
`

export const NoteIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: #d1fae5;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const NoteInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const NoteTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const NoteReadTime = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`

export const NoteExtLink = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`

/* ── Note detail (inline) ── */

export const NoteDetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`

export const OpenFullBtn = styled.a`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #10b981;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  &:hover { background: #f0fdf9; }
`

export const NoteDetailTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0.75rem 0 0;
  line-height: 1.4;
`

export const NoteEditorWrap = styled.div`
  font-size: 0.875rem;
  line-height: 1.7;
  color: #374151;
  margin-top: 0.75rem;

  /* keep BlockNote content from overflowing the narrow panel */
  .bn-editor {
    padding: 0 !important;
  }
  img {
    max-width: 100%;
    height: auto;
  }
`

export const CountLabel = styled.p`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.5rem;
`

export const SessionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const CountInput = styled.input`
  width: 5rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #111827;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`

export const StartButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #059669; }
  &:disabled { background: #d1d5db; cursor: not-allowed; }
`

/* ── Inline flashcard player ── */

export const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const PlayerStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const PlayerCounter = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  b { color: #111827; }
`

export const PlayerBackBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { background: #fee2e2; color: #ef4444; }
`

export const PlayerProgress = styled.div`
  width: 100%;
  height: 5px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
`

export const PlayerFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #6BB9E8, #8DC63F);
  border-radius: 99px;
  transition: width 0.3s ease;
`

export const PlayerFlipArea = styled.div`
  width: 100%;
  min-height: 200px;
  perspective: 1000px;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
`

export const PlayerFlipCard = styled.div`
  width: 100%;
  min-height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${p => p.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`

const PlayerCardFaceBase = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 10px;
  border: 2px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  text-align: center;
  overflow: hidden;
  min-height: 200px;
`

export const PlayerFront = styled(PlayerCardFaceBase)`
  background: #fff;
  ${PlayerFlipArea}:hover & { border-color: #6BB9E8; }
`

export const PlayerBack = styled(PlayerCardFaceBase)`
  background: #f0f9ff;
  transform: rotateY(180deg);
  border-color: #bae6fd;
`

export const PlayerCardLabel = styled.div`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6BB9E8;
  margin-bottom: 0.5rem;
`

export const PlayerCardText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`

export const PlayerFlipHint = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6BB9E8;
`

export const PlayerActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const PlayerRatingBtn = styled.button`
  flex: 1;
  padding: 0.625rem 0.25rem;
  border: 2px solid ${p => p.$color};
  background: #fff;
  color: ${p => p.$color};
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) { background: ${p => p.$color}; color: #fff; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const PlayerDoneWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  text-align: center;
`

export const PlayerDoneText = styled.p`
  font-size: 0.9375rem;
  color: #374151;
  margin: 0;
  font-weight: 500;
`

/* ── Inline MCQ player ── */

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
