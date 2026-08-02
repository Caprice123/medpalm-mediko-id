import styled from 'styled-components'

export const LastSessionSection = styled.div`
  margin-bottom: 2.5rem;
`

export const SectionLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
  margin: 0 0 0.625rem;
`

export const LastSessionCard = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1.5px solid #d1fae5;
  border-left: 4px solid #10b981;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 14px rgba(16, 185, 129, 0.1);
  }
`

export const LastSessionIcon = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  flex-shrink: 0;
`

export const LastSessionText = styled.div`
  flex: 1;
  min-width: 0;
`

export const LastSessionName = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LastSessionMeta = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
`

export const LastSessionArrow = styled.span`
  font-size: 1.25rem;
  color: #10b981;
  flex-shrink: 0;
`
