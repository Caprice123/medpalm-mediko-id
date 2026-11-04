import styled from 'styled-components'

export const DetailCover = styled.img`
  width: 100%;
  max-height: 16rem;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  margin-bottom: 1.25rem;
  cursor: zoom-in;
`

export const Section = styled.section`
  & + & {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-gray-100);
  }
`

export const SectionLabel = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin: 0 0 0.5rem;

  svg { flex-shrink: 0; }
`

export const BodyText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-700);
  white-space: pre-line;
  max-width: 68ch;
`

export const SpeakerEntry = styled.div`
  & + & {
    margin-top: 0.75rem;
  }

  h4 {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.125rem;
  }
`

export const TagList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
`

export const Tag = styled.li`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue-deep);
  background: var(--color-brand-blue-tint);
  border: 1px solid var(--color-brand-blue-tint-strong);
  border-radius: 999px;
  padding: 0.25rem 0.6875rem;
`

export const WindowNote = styled.p`
  margin: 1.25rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.5625rem 0.75rem;
  border-radius: 9px;
  background: ${({ $urgent }) =>
    $urgent ? 'var(--color-warning-tint)' : 'var(--color-gray-100)'};
  color: ${({ $urgent }) =>
    $urgent ? 'var(--color-warning-text)' : 'var(--color-gray-700)'};

  svg { flex-shrink: 0; }
`
