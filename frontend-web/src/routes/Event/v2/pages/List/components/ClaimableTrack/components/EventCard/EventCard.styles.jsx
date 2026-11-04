import styled from 'styled-components'

export const CardFrame = styled.article`
  background: var(--color-surface);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.07);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px -14px rgba(11, 20, 25, 0.34);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.25s ease;
    &:hover { transform: none; }
  }
`

/**
 * The claim deadline across the card's top edge — the filled portion is how
 * much of the window is still open. Rendered only when the event actually has
 * both bounds; an evergreen event gets no bar rather than a guessed one.
 */
export const WindowTrack = styled.div`
  height: 5px;
  background: var(--color-gray-100);
  flex-shrink: 0;
`

export const WindowFill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => Math.max(2, $ratio * 100)}%;
  border-radius: 0 3px 3px 0;
  background: ${({ $urgent }) =>
    $urgent
      ? 'linear-gradient(90deg, var(--color-warning-light) 0%, var(--color-warning) 100%)'
      : 'linear-gradient(90deg, var(--color-brand-green) 0%, var(--color-brand-green-dark) 100%)'};
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`

export const CardBody = styled.div`
  padding: 1rem 1.0625rem 1.0625rem;
  display: flex;
  flex-direction: column;
  gap: 0.5625rem;
  flex: 1;
`

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-gray-900);
  margin: 0;
`

export const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--color-gray-500);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const WindowNote = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 0.4375rem 0.625rem;
  border-radius: 9px;
  background: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-warning-tint)'
      : $tone === 'evergreen' ? 'var(--color-brand-green-tint)'
        : 'var(--color-gray-100)'};
  color: ${({ $tone }) =>
    $tone === 'urgent' ? 'var(--color-warning-text)'
      : $tone === 'evergreen' ? 'var(--color-brand-green-darker)'
        : 'var(--color-gray-700)'};

  svg { flex-shrink: 0; }
`

export const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 0.875rem;
  display: flex;
  gap: 0.5625rem;

  & > * { flex: 1; }
`
