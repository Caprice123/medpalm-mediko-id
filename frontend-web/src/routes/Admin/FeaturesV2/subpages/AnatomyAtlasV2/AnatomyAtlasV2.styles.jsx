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

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
`

export const BreadcrumbLink = styled.span`
  color: #6366f1;
  cursor: pointer;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`

export const BreadcrumbSep = styled.span`
  color: #d1d5db;
`

export const BreadcrumbCurrent = styled.span`
  color: #6b7280;
`
