import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const BackButton = styled.button`
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    color: #0891b2;
  }
`

export const TitleSection = styled.div`
  flex: 1;
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0e7490;
  margin: 0;
  line-height: 1.3;
`

export const MetaInfo = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export const Tag = styled.span`
  font-size: 0.75rem;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  background: ${props => props.type === 'university' ? '#dbeafe' : '#fef3c7'};
  color: ${props => props.type === 'university' ? '#1e40af' : '#92400e'};
`

export const ContentContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

export const MarkdownContent = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;

  h1, h2, h3, h4, h5, h6 {
    color: #0e7490;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-weight: 700;
  }

  h1 {
    font-size: 1.75rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4 {
    font-size: 1.125rem;
  }

  p {
    margin: 1em 0;
  }

  ul, ol {
    margin: 1em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.5em 0;
  }

  strong {
    color: #0e7490;
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  code {
    background: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.875em;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }

  blockquote {
    border-left: 4px solid #0891b2;
    margin: 1em 0;
    padding: 0.5em 1em;
    background: #f0fdfa;
    color: #0e7490;
    font-style: italic;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }

  th, td {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
    color: #0e7490;
  }

  tr:nth-child(even) {
    background: #f9fafb;
  }

  a {
    color: #0891b2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 2em 0;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1em 0;
  }
`
