import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const TopicSection = styled.section`
  margin-bottom: 2.75rem;
`

/* The section is named once, by this heading. It used to be an eyebrow label
   above a second, longer title ("Sistem Blok" / "Topik berbasis sistem organ")
   — two lines saying the same thing, with the shorter and clearer of the two
   set in the smaller type. The eyebrow won. */
export const TopicSectionTag = styled.h2`
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--color-brand-blue);
  margin: 0 0 0.375rem;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`

export const TopicSectionDesc = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  /* Wide enough that each section's one-sentence description stays on a single
     line on a desktop screen — at a 46rem measure it broke two words onto a
     second line and read as though it had been cut off. */
  max-width: 64rem;
  margin: 0 0 1.5rem;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

/* A uniform grid rather than wrapped pills. Topic names range from "Dasar
   Kedokteran" to "Sistem Gastrointestinal, Hepatobilier, dan Pankreas", so
   content-width pills produced ragged rows with nothing for the eye to follow.
   Equal columns give the list a left edge to scan down. */
export const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 0.75rem;
`

export const TopicCard = styled.button`
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
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-gray-700);
  text-align: left;
  transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: var(--color-brand-blue-tint-strong);
    background: var(--color-brand-blue-tint);
    color: var(--color-brand-blue-deep);
    box-shadow: 0 2px 10px rgba(30, 115, 170, 0.08);
  }
`

export const TopicCardArrow = styled.span`
  /* The card's only affordance marker, so it has to be legible as text:
     gray-400 was 2.92:1 against white, under the 4.5:1 a glyph this size
     needs. gray-500 measures 5.51:1. */
  color: var(--color-gray-500);
  font-size: 0.875rem;
  flex-shrink: 0;
  transition: color 0.15s;

  ${TopicCard}:hover & {
    color: var(--color-brand-blue);
  }
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`

export const SkeletonCard = styled(SkeletonBase)`
  height: 3.5rem;
  border-radius: 12px;
`
