import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

export const FilterRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${p => {
    if (p.$type === 'department') return '#dbeafe'
    if (p.$type === 'topic') return '#dcfce7'
    return '#fef9c3'
  }};
  color: ${p => {
    if (p.$type === 'department') return '#1d4ed8'
    if (p.$type === 'topic') return '#15803d'
    return '#a16207'
  }};
`

