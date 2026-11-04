import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import { scrimLayer, brandField } from '../../utils/surfaces'

export const BillboardFrame = styled.section`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 17rem;
  display: flex;
  align-items: flex-end;
  background-color: var(--color-brand-blue-deep);
  background-image: ${({ $thumbnail }) =>
    $thumbnail ? `${scrimLayer()}, url(${$thumbnail})` : brandField};
  background-size: cover;
  background-position: center;
  box-shadow: 0 6px 20px -8px rgba(4, 74, 119, 0.45);

  @media (max-width: 992px) {
    background-image: ${({ $thumbnail }) =>
      $thumbnail ? `${scrimLayer('185deg')}, url(${$thumbnail})` : brandField};
  }
`

/**
 * The registration deadline, drawn across the top edge: the filled portion is
 * how much of the registration window is still open. The only progress
 * indicator on the page, and it carries real data or it is not rendered.
 */
export const DeadlineTrack = styled.div`
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: rgba(255, 255, 255, 0.22);
`

export const DeadlineFill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => Math.max(2, $ratio * 100)}%;
  background: ${({ $urgent }) =>
    $urgent
      ? 'linear-gradient(90deg, var(--color-warning-light) 0%, var(--color-warning) 100%)'
      : 'linear-gradient(90deg, var(--color-brand-green) 0%, var(--color-brand-green-dark) 100%)'};
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`

export const BillboardRow = styled(Row)`
  width: 100%;
  align-items: flex-end;
  padding: 2rem 1.75rem 1.75rem;
  margin: 0;
  row-gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.75rem 1.25rem 1.25rem;
  }
`

export const BillboardCol = styled(Col)`
  padding: 0;
`

export const BillboardTitle = styled.h1`
  font-size: clamp(1.5rem, 2.6vw, 2.125rem);
  font-weight: 700;
  line-height: 1.18;
  color: var(--color-surface);
  text-wrap: balance;
  margin: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.26);
`

export const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`

export const MetaRow = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: var(--color-surface);

  svg {
    flex-shrink: 0;
    margin-top: 0.15rem;
    opacity: 0.85;
  }

  strong {
    font-weight: 600;
  }
`

export const ActionCard = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 4px 16px -6px rgba(11, 20, 25, 0.35);
`

export const DeadlineNote = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
  background: ${({ $urgent }) =>
    $urgent ? 'var(--color-warning-tint)' : 'var(--color-brand-green-tint)'};
  color: ${({ $urgent }) =>
    $urgent ? 'var(--color-warning-text)' : 'var(--color-brand-green-darker)'};

  svg { flex-shrink: 0; }
`

export const DetailLink = styled.button`
  border: 0;
  background: none;
  padding: 0.25rem;
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-brand-blue);
  border-radius: 6px;

  &:hover { color: var(--color-brand-blue-deep); }
`

// ─── No webinar is open for registration ───────────────────────────────────
export const QuietNotice = styled.section`
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1.5rem 1.625rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.06);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-blue);
  }
`

export const NoticeText = styled.div`
  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.25rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-gray-500);
  }
`
