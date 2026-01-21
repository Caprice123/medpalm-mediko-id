import styled from 'styled-components'

export const Heading1 = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

export const Heading2 = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
`

export const Heading3 = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
`

export const Paragraph = styled.p`
  margin-bottom: 0.5rem;
`

export const UnorderedList = styled.ul`
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
`

export const OrderedList = styled.ol`
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
`

export const ListItem = styled.li`
  margin-bottom: 0.25rem;
`

export const Blockquote = styled.blockquote`
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

export const Link = styled.a`
  color: #0066cc;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #004499;
  }
`
