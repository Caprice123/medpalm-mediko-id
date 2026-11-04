import styled from 'styled-components'

export const LastSessionSection = styled.div`
  margin-bottom: 2.5rem;
`

/* Deliberately a step below the two topic headings. This block is a single
   shortcut back into one topic; "Sistem Blok" below it is the page's actual
   content. Giving all three the same 1.625rem blue heading made the page read
   as having no most-important thing on it. */
export const SectionLabel = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gray-600);
  margin: 0 0 0.625rem;
`

/* Held to a readable width. Full-bleed, the card stranded its arrow some
   1,500px away from the topic name it belonged to. */
export const LastSessionCard = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 32rem;
  padding: 1rem 1.25rem;
  background: var(--color-surface);
  border: 1.5px solid var(--color-brand-blue-tint);
  border-left: 4px solid var(--color-brand-blue);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;

  &:hover {
    border-color: var(--color-brand-blue-tint-strong);
    box-shadow: 0 2px 14px rgba(30, 115, 170, 0.12);
    transform: translateY(-1px);
  }
`

export const LastSessionText = styled.div`
  flex: 1;
  min-width: 0;
`

/* Long topic names wrap rather than ending in an ellipsis — a truncated name
   reads as broken. */
export const LastSessionName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-gray-900);
  margin: 0 0 0.1875rem;
`

export const LastSessionMeta = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin: 0;
`

export const LastSessionArrow = styled.span`
  font-size: 1.25rem;
  color: var(--color-brand-blue);
  flex-shrink: 0;
`
