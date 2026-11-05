import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const Container = styled.div`
  padding: 1.75rem 2.5rem 4rem;
  animation: ${fadeUp} 0.3s ease both;

  @media (max-width: 768px) {
    padding: 1.25rem 1.25rem 3rem;
  }
`

// ---------------------------------------------------------------------------
// Shared by SubtopicsSection and AtlasModelsSection.
//
// Both sections are the same object: a named heading over a grid of navigable
// items. They used to style that twice, differently — one with an icon chip
// and a count pill, one with a plain title — so the page read as two features
// stapled together. One set of parts, one look, matching the topic hub.
// ---------------------------------------------------------------------------

export const Section = styled.section`
  margin-bottom: 2.75rem;
`

export const SectionHeading = styled.h2`
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--color-brand-blue);
  margin: 0 0 0.375rem;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`

export const SectionDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  max-width: 64rem;
  margin: 0 0 1.5rem;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 0.75rem;
`

export const ItemCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.875rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
    box-shadow: 0 2px 10px rgba(30, 115, 170, 0.08);
  }
`

/* The sub-topic's own emoji, one mark only (see @utils/iconUtils) — the admin
   field is free text, and a row of emoji would crowd out the name. */
export const ItemCardIcon = styled.span`
  font-size: 1.125rem;
  line-height: 1;
  flex-shrink: 0;
`

export const ItemCardName = styled.span`
  /* Takes the slack between the icon and the arrow, so cards with an icon and
     cards without one keep their arrows on the same right edge. */
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-gray-700);
  transition: color 0.15s;

  ${ItemCard}:hover & {
    color: var(--color-brand-blue-deep);
  }
`

export const ItemCardArrow = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--color-gray-500);
  transition: color 0.15s;

  ${ItemCard}:hover & {
    color: var(--color-brand-blue);
  }
`

export const SkeletonCard = styled.div`
  height: 3.5rem;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`
