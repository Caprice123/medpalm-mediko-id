import styled, { css, keyframes } from 'styled-components'

export const Composer = styled.div`
  flex: none;
  padding: 0.75rem 1rem 0.875rem;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-surface);
`

export const Field = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;

  /* Three controls on one row leave the field about 150px wide on a phone, which wraps the
     placeholder and puts a scrollbar inside a one-line input. Below this width the field
     takes the full row and the two buttons sit under it. */
  @media (max-width: 560px) {
    flex-wrap: wrap;

    textarea {
      flex: 1 0 100%;
    }
  }
`

export const Entry = styled.textarea`
  flex: 1;
  min-width: 0;
  /* Two lines at rest: an anamnesis question is rarely one short phrase, and a single-line
     field makes the student scroll their own sentence while the clock runs. It grows with
     the text (useVoiceInput) and stops at ten lines so the transcript keeps its room. */
  min-height: 4rem;
  max-height: 10rem;
  resize: none;
  padding: 0.6875rem 0.875rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--color-gray-800);
  background: var(--color-surface);
  caret-color: var(--color-brand-blue);

  &::placeholder {
    color: var(--color-gray-500);
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px var(--color-brand-blue-tint);
  }

  &:disabled {
    background: var(--color-gray-50);
    color: var(--color-gray-500);
  }
`

// What the transcriber has heard so far, shown over the field in italics so the student can
// see the sentence forming without it being editable text yet.
export const Interim = styled.div`
  position: absolute;
  inset: 0;
  padding: 0.6875rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.55;
  pointer-events: none;
  overflow: hidden;

  span.typed {
    visibility: hidden;
  }

  span.heard {
    font-style: italic;
    color: var(--color-gray-500);
  }
`

const ripple = keyframes`
  from { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45); }
  to { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
`

export const Mic = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  flex: none;
  height: 2.75rem;
  padding: 0 0.875rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid ${({ $recording }) => ($recording ? 'var(--color-danger-dark)' : 'var(--color-brand-blue)')};
  background: ${({ $recording }) => ($recording ? 'var(--color-danger-dark)' : 'var(--color-surface)')};
  color: ${({ $recording }) => ($recording ? 'var(--color-surface)' : 'var(--color-brand-blue)')};

  /* While recording, a red ring pulses out of the button — the one place on the board that
     moves, because it is the only control whose state the student cannot otherwise see. */
  ${({ $recording }) => $recording && css`
    animation: ${ripple} 1.4s ease-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `}

  &:disabled {
    border-color: var(--color-gray-300);
    background: var(--color-gray-50);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }

  /* Once the field takes its own row, the record button shares the row below it with send. */
  @media (max-width: 560px) {
    flex: 1;
  }
`

export const Send = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-brand-blue);
  background: var(--color-brand-blue);
  color: var(--color-surface);

  &:disabled {
    border-color: var(--color-gray-300);
    background: var(--color-gray-200);
    color: var(--color-gray-500);
    cursor: not-allowed;
  }
`

export const ComposerFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-gray-500);

  /* The reassurance line is the first thing to go when there is no room for both. */
  @media (max-width: 560px) {
    > span:last-child {
      display: none;
    }
  }
`

// Auto-send lives next to the microphone it governs. V1 put this switch in the sidebar and had
// the input poll localStorage twice a second to find out whether it had changed.
export const AutoSend = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-600);
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  input:focus-visible + span {
    outline: 2px solid var(--color-brand-blue);
    outline-offset: 2px;
  }
`

export const Switch = styled.span`
  position: relative;
  display: inline-block;
  width: 2.125rem;
  height: 1.125rem;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? 'var(--color-brand-blue)' : 'var(--color-gray-300)')};
  transition: background 140ms ease-out;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? '1.125rem' : '2px')};
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    background: var(--color-surface);
    transition: left 140ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::after {
      transition: none;
    }
  }
`
