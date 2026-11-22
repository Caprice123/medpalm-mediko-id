import styled from 'styled-components'

export const Panel = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: auto;
    border-bottom: 1px solid var(--color-gray-200);
  }
`

export const Body = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const Intro = styled.p`
  font-size: 0.85rem;
  color: var(--color-gray-600);
  margin: 0;
`

export const SectionLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gray-500);
  margin: 0.25rem 0 0;
`

export const QuickPrompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`

export const QuickPrompt = styled.button`
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--color-brand-blue);
    color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
  }
`

export const Hint = styled.p`
  font-size: 0.75rem;
  color: var(--color-brand-green-darker);
  margin: 0;
`

export const ResultsSection = styled.div`
  border-top: 1px solid var(--color-gray-200);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const ResultsTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
`

export const EmptyHint = styled.div`
  border: 1px dashed var(--color-gray-300);
  border-radius: 10px;
  padding: 1rem;
  font-size: 0.82rem;
  color: var(--color-gray-500);
  text-align: center;
`

export const DiagramCard = styled.figure`
  margin: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-surface);
`

export const DiagramImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  background: var(--color-gray-50);
`

export const DiagramMeta = styled.figcaption`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border-top: 1px solid var(--color-gray-200);
`

export const DiagramCaption = styled.span`
  flex: 1;
  font-size: 0.78rem;
  color: var(--color-gray-600);
  word-break: break-word;
`
