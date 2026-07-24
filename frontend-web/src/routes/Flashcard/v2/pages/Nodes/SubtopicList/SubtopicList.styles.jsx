import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

export const BackLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: #6366f1;
  font-weight: 500;
  margin-bottom: 1.25rem;

  &:hover { text-decoration: underline; }
`

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`

export const SubtopicCard = styled.div`
  background: #fff;
  border: 1.5px solid #f0f0f0;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const SubtopicName = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

export const CardCount = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
`

export const EmptyWrap = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
`

/* ── Start Session Modal ── */

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const ModalLabel = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
`

export const PresetRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const PresetBtn = styled.button`
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? '#6366f1' : '#e5e7eb'};
  background: ${p => p.$active ? '#ede9fe' : '#fff'};
  color: ${p => p.$active ? '#4f46e5' : '#374151'};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.$disabled ? 0.4 : 1};

  &:hover:not(:disabled) {
    border-color: #a5b4fc;
    background: #f5f3ff;
  }
`

export const CustomCountWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const CountDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CountNum = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #4f46e5;
  min-width: 3rem;
  text-align: center;
`

export const CountBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { border-color: #a5b4fc; background: #f5f3ff; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`
