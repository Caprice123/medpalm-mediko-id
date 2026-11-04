import styled from 'styled-components'

// ─── Page layout ───────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--color-surface-app);
`

export const Container = styled.div`
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.5rem; }
  @media (max-width: 640px) { padding: 1.25rem; }
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand-blue);
  margin-bottom: 0.5rem;
`

export const PageSubtitle = styled.p`
  color: var(--color-gray-500);
  font-size: 1.05rem;
  margin-bottom: 2rem;
`

// ─── Tabs ──────────────────────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid var(--color-gray-200);
  margin-bottom: 1.75rem;
`

export const TabBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  border-bottom: 2px solid ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: var(--color-brand-blue); }
`
