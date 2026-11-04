import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 1.75rem 2rem 4rem;
  animation: ${fadeUp} 0.3s ease both;

  @media (max-width: 768px) {
    padding: 1.25rem 1.25rem 3rem;
  }
`

// ---------------------------------------------------------------------------
// Shared by ExplanationPanel, RelatedContentSection and AtlasModelsSection.
//
// These used to share a 13px uppercase, letter-spaced label — eyebrow styling
// doing a heading's job, so the page's structure whispered. They are real
// headings now.
//
// Smaller than the 1.625rem headings on the topic hub and topic detail, and
// deliberately so: there the sections are the page, while here they sit under
// the subtopic's own title and support the video above them.
// ---------------------------------------------------------------------------

export const Section = styled.section`
  margin-bottom: 2.25rem;
`

export const SectionHeading = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-brand-blue);
  margin: 0 0 0.25rem;
`

export const SectionDescription = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  max-width: 64rem;
  margin: 0 0 1rem;
`

// Shared by RelatedContentSection and AtlasModelsSection: both are grids of
// cards that open something, so they are one card, not two.
export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 0.75rem;
`

export const ItemCard = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.875rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  opacity: ${({ $locked }) => $locked ? 0.65 : 1};

  &:hover {
    border-color: ${({ $locked }) => $locked ? 'var(--color-border-strong)' : 'var(--color-brand-blue)'};
    background: ${({ $locked }) => $locked ? 'var(--color-surface)' : 'var(--color-brand-blue-tint)'};
    box-shadow: ${({ $locked }) => $locked ? 'none' : '0 2px 10px rgba(30, 115, 170, 0.08)'};
  }
`

export const ItemCardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue);
  flex-shrink: 0;
`

export const ItemCardText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const ItemCardName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-gray-900);
`

export const ItemCardMeta = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

export const ItemCardAction = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--color-gray-500);
  transition: color 0.15s;

  ${ItemCard}:hover & {
    color: var(--color-brand-blue);
  }
`
