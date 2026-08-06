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

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

export const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const ClassificationBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #ede9fe;
  color: #6d28d9;
  letter-spacing: 0.02em;
`
