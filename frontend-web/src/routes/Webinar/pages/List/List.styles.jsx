import styled from 'styled-components'

// ─── Page layout ───────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.5rem; }
  @media (max-width: 640px) { padding: 1.25rem; }
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

export const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
  margin-bottom: 2rem;
`

// ─── Tabs ──────────────────────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.75rem;
`

export const TabBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? '#06b6d4' : '#6b7280'};
  border-bottom: 2px solid ${({ $active }) => $active ? '#06b6d4' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: #06b6d4; }
`
