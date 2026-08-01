import styled from 'styled-components'

export const Container = styled.div``

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

export const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  > *:first-child {
    flex: 1;
  }
`

export const ClassificationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  background: ${({ $type }) => $type === 'sistem_blok' ? '#d1fae5' : '#ede9fe'};
  color: ${({ $type }) => $type === 'sistem_blok' ? '#065f46' : '#5b21b6'};
`

export const IconPreview = styled.span`
  font-size: 1.375rem;
`
