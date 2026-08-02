import styled from 'styled-components'

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
`

export const FullScreenBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.8125rem;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #f9fafb; }

  @media (max-width: 768px) {
    display: none;
  }
`
