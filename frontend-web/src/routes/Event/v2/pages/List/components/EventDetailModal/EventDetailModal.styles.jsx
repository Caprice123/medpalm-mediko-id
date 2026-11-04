import styled from 'styled-components'

export const DetailCover = styled.img`
  width: 100%;
  max-height: 14rem;
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

export const WindowNote = styled.p`
  margin: 1.25rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.5625rem 0.75rem;
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
