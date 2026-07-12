import styled from 'styled-components'

export const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`

export const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`

export const BuilderCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem;
`

export const SectionLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  margin-bottom: 0.625rem;
`

export const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  & > * { flex: 1; }
`

export const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
`

export const ModeOption = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid ${p => p.$active ? '#7c3aed' : '#e5e7eb'};
  background: ${p => p.$active ? '#f5f3ff' : 'white'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: border-color 0.15s;

  strong {
    font-size: 0.875rem;
    color: ${p => p.$active ? '#6d28d9' : '#111827'};
  }
  span {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.4;
  }

  &:hover { border-color: #c4b5fd; }
`

export const SaveRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 1rem 0 0.625rem;
`

export const SaveToggle = styled.button`
  width: 36px;
  height: 20px;
  border-radius: 99px;
  border: none;
  background: ${p => p.$active ? '#7c3aed' : '#d1d5db'};
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${p => p.$active ? '19px' : '3px'};
    transition: left 0.2s;
  }
`

export const SaveToggleLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
`

export const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.75rem;
`

export const SessionCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  gap: 1rem;
`

export const SessionName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
`

export const SessionMeta = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.2rem;
`

export const SessionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`

export const EmptyHint = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 0.9375rem;
`
