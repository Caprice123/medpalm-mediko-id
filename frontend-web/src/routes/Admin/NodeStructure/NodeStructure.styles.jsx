import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
`

export const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`

export const TreeWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

export const EmptyText = styled.p`
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 0.95rem;
`
